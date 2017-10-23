/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import tinymce from 'tinymce';
import '../../../tinymce_plugins/freeMode';
import $ from 'jquery';
import '../../../../constants/tinymce_ja';
import MatrixQuestion from '../../../../runtime/components/questions/MatrixQuestion';
import { isDevelopment } from '../../../../utils';
import * as EditorActions from '../../../actions';
import runtimeCss from '!css-loader!sass-loader!../../../../runtime/css/runtime.scss';
import detailCss from '!css-loader!sass-loader!../../../../preview/css/detail.scss';

const TINYMCE_ID = 'matrix-table-editor';

/**
 * 表形式のテーブル部分のエディタ
 */
class MatrixTableEditorPart extends Component {
  componentDidMount() {
    this.initTinyMCE();
  }

  componentWillUnmount() {
    this.destroyTinyMCE();
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

  destroyTinyMCE() {
    const editor = tinymce.EditorManager.get(TINYMCE_ID);
    if (editor) editor.destroy();
  }

  getMatrixHtmlFromTinyMCE() {
    const editor = tinymce.EditorManager.get(TINYMCE_ID);
    const html = $(editor.getContent()).find('.question').html();
    const $html = $(html);
    // 入力要素にフォーカスが当たった状態で行の追加が行われるとTinyMCEのバグでエラーが発生するため、disabledにして選択できないようにているため、
    // disabledをfalseに変更する
    $html.find('input,select,textarea').disable(false);
    return $html.prop('outerHTML');
  }


  handleTinyMCEInit(editor) {
    const { survey, runtime } = this.props;
    this.editor = editor;
    this.editor.focus();
    // pluginで使うため下記の設定をsettingsに格納しておく
    this.editor.settings.survey = survey;
    this.editor.settings.outputDefinitions = survey.findPrecedingOutputDefinition(runtime.getCurrentNodeId(), true);
  }

  initTinyMCE() {
    const { survey, runtime, options, question, changeQuestionAttribute } = this.props;
    const node = runtime.findCurrentNode(survey);
    if (!node.isPage()) return;

    const page = runtime.findCurrentPage(survey);

    const toolbar = `free_mode_save free_mode_cancel | bold italic underline strikethrough forecolor backcolor removeformat table ' +
      'link unlink | alignleft aligncenter alignright alignjustify ${isDevelopment() ? ' | code' : ''} reference_answer image_manager`;

    const cssLinks = survey.getCssRuntimeUrls().concat(survey.getCssPreviewUrls()).toArray();
    tinymce.init({
      selector: `#${TINYMCE_ID}`,
      menubar: '',
      toolbar,
      plugins: `free_mode table contextmenu textcolor paste fullscreen link ${isDevelopment() ? 'code' : ''} reference_answer image_manager`,
      contextmenu: 'link inserttable | cell row column deletetable',
      body_class: 'm3-enquete__user-agent-group--PC',
      body_id: 'content',
      verify_html: false, // trueだと要素や属性が削除されることがある
      content_css: cssLinks,
      imageManagerUrl: options.getImageManagerUrl(),
      init_instance_callback: this.handleTinyMCEInit.bind(this),
      freeModeSaveCallback: () => {
        changeQuestionAttribute(page.getId(), question.getId(), 'matrixHtml', this.getMatrixHtmlFromTinyMCE());
        this.props.onHide();
      },
      freeModeCancelCallback: () => {
        this.props.onHide();
      },
      setup: (editor) => {
        editor.on('init', () => {
          // formのpluginで使うため下記の設定をsettingsに格納しておく
          editor.settings.survey = survey;
          editor.settings.runtime = runtime;

          // runtimeのCSSとdetailのCSSを追加する
          editor.contentDocument.head.appendChild(this.createStyle(runtimeCss));
          editor.contentDocument.head.appendChild(this.createStyle(detailCss));

          const replacer = survey.getReplacer();
          const pageHtml = `
<div class="questionsEditBox">
  <div class="questionsBox">
    <div class="questionBox">
      ${ReactDOMServer.renderToStaticMarkup(<MatrixQuestion showOnlyTable useId2No replacer={replacer} {...this.props} />)}
    </div>
  </div>
</div>`;
          const $pageHtml = $(pageHtml);
          // 入力要素にフォーカスが当たった状態で行の追加が行われるとTinyMCEのバグでエラーが発生するため、disabledにして選択できないようにする
          $pageHtml.find('input,select,textarea').disable(true);
          editor.setContent($pageHtml.prop('outerHTML'));
        });
      },
    });
  }

  render() {
    const { survey } = this.props;
    return (
      <div className="matrix-table-editor-part">
        <div className="matrix-table-editor-part__backdrop" />
        <div id={TINYMCE_ID} className="matrix-table-editor-part__tinymce" />
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  options: state.getOptions(),
});

const actionsToProps = dispatch => ({
  changeQuestionAttribute: (pageId, questionId, attribute, value) =>
    dispatch(EditorActions.changeQuestionAttribute(pageId, questionId, attribute, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(MatrixTableEditorPart);
