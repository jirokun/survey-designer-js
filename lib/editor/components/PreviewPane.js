/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Frame from 'react-frame-component';
import tinymce from 'tinymce';
import { Button } from 'react-bootstrap';
import * as PreviewPaneActions from '../actions';
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp';
import Page from '../../runtime/components/Page';
import runtimeCss from '!css-loader!sass-loader!../../runtime/css/runtime.scss';
import detailCss from '!css-loader!sass-loader!../../preview/css/detail.scss';

/** エディタの領域を描画する */
class PreviewPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      freeEditMode: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.freeEditMode === this.state.freeEditMode) return;
    const id = 'free-editor';
    if (this.state.freeEditMode) {
      const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/);
      tinymce.init({
        selector: `#${id}`,
        plugins: 'table contextmenu textcolor paste fullscreen link reference_answer',
        content_css: cssLinks,
        setup: (editor) => { 
          editor.on('init', () => {
            editor.contentDocument.head.appendChild(this.createStyle(runtimeCss));
            editor.contentDocument.head.appendChild(this.createStyle(detailCss));
          });
        },
      });
    } else {
      const editor = tinymce.EditorManager.get(id);
      editor.destroy();
    }
  }

  createStyle(cssText) {
    const style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = cssText;
    } else {
      style.appendChild(document.createTextNode(cssText));
    }
    return style;
  }

  handleToggleFreeEditMode() {
    this.setState({ freeEditMode: !this.state.freeEditMode });
  }

  renderPreview() {
    // ランタイム時に使用するcssを環境変数(.env)から取得する。
    // カンマ区切りでURLを指定すると、URLのlinkタグがプレビューアプリに注入される
    const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/).map(url => `<link type="text/css" rel="stylesheet" href="${url}" />`).join('');
    return (
      <Frame
        initialContent={`
          <!DOCTYPE html>
          <html>
          <head>
            ${cssLinks}
            <style>${runtimeCss}</style>
            <style>${detailCss}</style>
          </head>
          <body class="m3-enquete__user-agent-group--PC">
            <div id="runtime-container"></div>
          </body>
        </html>`}
        mountTarget="#runtime-container"
      >
        <EnqueteRuntimeApp doNotPostAnswers doNotTransition doNotExecuteJavaScript doNotValidate />
      </Frame>
    );
  }

  renderFreeEditor() {
    const { survey, runtime } = this.props;
    const page = runtime.findCurrentPage(survey);
    return (
      <div id="free-editor">
        <div className="m3-enquete__user-agent-group--PC">
          <div id="content">
            <div className="questionsEditBox">
              <Page
                key={page.getId()}
                page={page}
                surveyManager={null}
                doNotTransition
                doNotExecuteJavaScript
                doNotValidate
                showEditModeMessage
                hideButtons
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div key="previewPane" className={classNames('preview-pane', { hidden: this.state.dragging })}>
        <div><Button onClick={() => this.handleToggleFreeEditMode()}>フリー編集モード</Button></div>
        { this.state.freeEditMode ? this.renderFreeEditor() : this.renderPreview()}
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});
const actionsToProps = dispatch => ({
  changeCodemirror: value => dispatch(PreviewPaneActions.changeCodemirror(value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PreviewPane);
