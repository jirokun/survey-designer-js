/* eslint-env browser */
import React, { Component } from 'react';
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
    return html;
  }

  initTinyMCE() {
    const { survey, runtime, question, changeQuestionAttribute } = this.props;
    const node = runtime.findCurrentNode(survey);
    if (!node.isPage()) return;

    const page = runtime.findCurrentPage(survey);

    const toolbar = `free_mode_save free_mode_cancel | bold italic underline strikethrough forecolor backcolor removeformat table ' +
      'link unlink | alignleft aligncenter alignright alignjustify ${isDevelopment() ? ' | code' : ''}`;

    const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/);
    tinymce.init({
      selector: `#${TINYMCE_ID}`,
      menubar: '',
      toolbar,
      plugins: 'table contextmenu textcolor paste fullscreen link reference_answer code free_mode',
      contextmenu: 'link inserttable | cell row column deletetable',
      body_class: 'm3-enquete__user-agent-group--PC',
      content_css: cssLinks,
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
        });
      },
    });
  }

  render() {
    const { survey } = this.props;
    const replacer = survey.getReplacer();
    return (
      <div className="matrix-table-editor-part">
        <div className="matrix-table-editor-part__backdrop" />
        <div id={TINYMCE_ID} className="matrix-table-editor-part__tinymce">
          <div className="questionsBox" style={{ margin: '10px' }}>
            <div className="questionBox">
              <MatrixQuestion showOnlyTable replacer={replacer} {...this.props} />
            </div>
          </div>
        </div>
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
