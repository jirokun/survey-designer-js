/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Frame from 'react-frame-component';
import tinymce from 'tinymce';
import $ from 'jquery';
import '../tinymce_plugins/form';
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp';
import Page from '../../runtime/components/Page';
import * as EditorActions from '../actions';
import runtimeCss from '!css-loader!sass-loader!../../runtime/css/runtime.scss';
import detailCss from '!css-loader!sass-loader!../../preview/css/detail.scss';
import photoSwipeCss from '!css-loader!photoswipe/dist/photoswipe.css';
import photoSwipeDefaultSkinCSS from '!css-loader!photoswipe/dist/default-skin/default-skin.css';

const TINYMCE_ID = 'free-editor';

/** エディタの領域を描画する */
class PreviewPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
  }

  componentDidMount() {
    this.initTinyMCE();
  }

  componentDidUpdate(prevProps) {
    const { survey, runtime } = this.props;
    const node = runtime.findCurrentNode(survey);
    if (!node.isPage()) return;

    const page = runtime.findCurrentPage(survey);
    const prevSurvey = prevProps.survey;
    const prevRuntime = prevProps.runtime;
    const prevNode = prevProps.runtime.findCurrentNode(prevProps.survey);
    const prevPage = prevNode.isPage() ? prevRuntime.findCurrentPage(prevSurvey) : null;
    if ((prevPage && prevPage.isFreeMode()) === page.isFreeMode()) return;

    if (page.isFreeMode()) {
      this.initTinyMCE();
    } else {
      this.destroyTinyMCE();
    }
  }

  componentWillUnmount() {
    this.destroyTinyMCE();
  }

  getFreeEditHtml() {
    const rootEl = ReactDOM.findDOMNode(this);
    return $(rootEl).find('iframe')[0].contentDocument.querySelector('form.page .questions').innerHTML;
  }

  initTinyMCE() {
    const { survey, runtime, changePageAttribute } = this.props;
    const node = runtime.findCurrentNode(survey);
    if (!node.isPage()) return;

    const page = runtime.findCurrentPage(survey);
    const toolbar = 'bold italic underline strikethrough forecolor backcolor removeformat table ' +
      'link unlink | alignleft aligncenter alignright alignjustify | fullscreen code';

    const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/);
    tinymce.init({
      selector: `#${TINYMCE_ID}`,
      menubar: '',
      toolbar,
      plugins: 'table contextmenu textcolor paste fullscreen link reference_answer code field_editor',
      contextmenu: 'link inserttable | cell row column deletetable | field_editor',
      content_css: cssLinks,
      init_instance_callback: (editor) => {
        editor.on('Change', () => {
          changePageAttribute(page.getId(), 'html', this.getFreeEditHtml());
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
  }

  destroyTinyMCE() {
    const editor = tinymce.EditorManager.get(TINYMCE_ID);
    if (editor) editor.destroy();
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

  handleToggleFreeEditMode(freeMode) {
    const { survey, runtime, changePageAttribute } = this.props;
    const page = runtime.findCurrentPage(survey);
    if (freeMode) {
      changePageAttribute(page.getId(), 'freeMode', true);
      changePageAttribute(page.getId(), 'html', this.getFreeEditHtml());
    } else if (confirm('フリー編集モードで編集した内容は失われますが本当によろしいですか？')) {
      changePageAttribute(page.getId(), 'freeMode', false);
      changePageAttribute(page.getId(), 'html', null);
    }
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
            <style>${photoSwipeCss}</style>
            <style>${photoSwipeDefaultSkinCSS}</style>
          </head>
          <body class="m3-enquete__user-agent-group--PC" style="overflow: hidden;">
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
      <div id={TINYMCE_ID}>
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
    const node = runtime.findCurrentNode(survey);
    if (!node.isPage()) {
      return (
        <div key="previewPane" className={classNames('preview-pane', node.getType(), { hidden: this.state.dragging })}>
          { this.renderPreview() }
        </div>
      );
    }

    const page = runtime.findCurrentPage(survey);
    return (
      <div key="previewPane" className={classNames('preview-pane', node.getType(), { hidden: this.state.dragging })}>
        <div className="preview-pane-header">
          <label>
            <input type="checkbox" onChange={e => this.handleToggleFreeEditMode(e.target.checked)} checked={page.isFreeMode()} />フリー編集モード
          </label>
          {page.isFreeMode() ? <span className="text-danger">この画面で設定したページが実際に表示されます。デザインビューの変更は画面に反映されません</span> : null}
        </div>
        { page.isFreeMode() ? this.renderFreeEditor() : this.renderPreview() }
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
