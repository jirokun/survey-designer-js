/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Frame from 'react-frame-component';
import tinymce from 'tinymce';
import '../tinymce_plugins/form';
import { Button } from 'react-bootstrap';
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp';
import Page from '../../runtime/components/Page';
import * as EditorActions from '../actions';
import runtimeCss from '!css-loader!sass-loader!../../runtime/css/runtime.scss';
import detailCss from '!css-loader!sass-loader!../../preview/css/detail.scss';

/** エディタの領域を描画する */
class PreviewPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { survey, runtime, changePageAttribute } = this.props;
    const page = runtime.findCurrentPage(survey);
    const prevSurvey = prevProps.survey;
    const prevRuntime = prevProps.runtime;
    const prevPage = prevRuntime.findCurrentPage(prevSurvey);
    if (prevPage.isFreeMode() === page.isFreeMode()) return;
    const id = 'free-editor';
    const toolbar = 'bold italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen form_editor code';
    if (page.isFreeMode()) {
      const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/);
      tinymce.init({
        selector: `#${id}`,
        menubar: '',
        toolbar,
        plugins: 'table contextmenu textcolor paste fullscreen link reference_answer form_editor code',
        content_css: cssLinks,
        init_instance_callback: (editor) => {
          editor.on('Change', (e) => {
            changePageAttribute(page.getId(), 'html', editor.getContent());
          });
        },
        setup: (editor) => { 
          editor.on('init', () => {
            // pluginで使うため下記の設定をsettingsに格納しておく
            editor.settings.survey = survey;
            editor.settings.runtime = runtime;

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
    const { survey, runtime, changePageAttribute } = this.props;
    const page = runtime.findCurrentPage(survey);
    changePageAttribute(page.getId(), 'freeMode', !page.isFreeMode());
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
    const { survey, runtime } = this.props;
    const page = runtime.findCurrentPage(survey);
    return (
      <div key="previewPane" className={classNames('preview-pane', { hidden: this.state.dragging })}>
        <div>
          <label>
            <input type="checkbox" onChange={() => this.handleToggleFreeEditMode()} checked={page.isFreeMode()} />フリー編集モード
          </label>
          {page.isFreeMode() ? <span className="text-danger">この画面で設定したページが実際に表示されます。デザインビューの変更は画面に反映されません</span> : null}
        </div>
        { page.isFreeMode() ? this.renderFreeEditor() : this.renderPreview()}
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
  changePageAttribute: (pageId, attributeName, value) => dispatch(EditorActions.changePageAttribute(pageId, attributeName, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PreviewPane);
