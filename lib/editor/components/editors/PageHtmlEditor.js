/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeMirror from 'codemirror';
import debounce from 'throttle-debounce/debounce';
import $ from 'jquery';
import * as EditorActions from '../../actions';
import { prettyPrint } from 'html';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import Help from '../Help';
import outputDefinitionHintFactory from '../../codemirror_plugins/outputDefinitionHintFactory';

const PAGE_HTML_CODEMIRROR = 'page-html-codemirror';

/** エディタの領域を描画する */
class PageHtmlEditor extends Component {
  constructor(props) {
    super(props);

    this.debouncedUpdateHtml = debounce(500, cm => this.updatePageHtml(cm));
    this.outputDefinitionHint = outputDefinitionHintFactory();
  }

  componentDidMount() {
    const { survey, page } = this.props;

    this.editor = CodeMirror(document.getElementById(PAGE_HTML_CODEMIRROR), {
      lineNumbers: true,
      mode: 'text/html',
      autoCloseTags: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Shift-Ctrl-F': this.formatCode.bind(this),
      },
      hintOptions: {
        hint: this.outputDefinitionHint.bind(this, survey),
      },
    });
    this.editor.on('change', this.handleOnChange.bind(this)); this.editor.on('focusChange', this.updatePageHtml.bind(this));

    const code = page.getHtml() || '';
    const replacer = survey.getReplacer();
    this.editor.setValue(replacer.id2No(code));
  }

  componentWillReceiveProps(props) {
    // オートコンプリートが更新されるようにhintOptionを更新する
    this.editor.setOption('hintOptions', { hint: this.outputDefinitionHint.bind(this, props.survey) });

    // surveyがこのエディタの外で更新された場合、再掲を更新する
    if (props.survey === this.props.survey || $(this.editor.display.wrapper).hasClass('CodeMirror-focused')) return;
    const replacer = props.survey.getReplacer();
    const replacedCode = replacer.id2No(props.page.getHtml());
    this.editor.setValue(replacedCode);
  }

  formatCode(cm) {
    const formattedHtml = prettyPrint(cm.getValue(), {
      indent_size: 2,
    });
    cm.setValue(formattedHtml);
  }

  handleOnChange(cm) {
    this.debouncedUpdateHtml(cm);
  }

  updatePageHtml(cm) {
    const { page, changePageAttribute } = this.props;
    changePageAttribute(page.getId(), 'html', cm.getValue());
  }

  render() {
    return (
      <div className="source-editor-container">
        <div id={PAGE_HTML_CODEMIRROR} className="source-editor" />
        <Help messageId="pageHtmlEditor" placement="bottom" />
      </div>);
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
)(PageHtmlEditor);
