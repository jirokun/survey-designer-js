/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import debounce from 'throttle-debounce/debounce';
import { js_beautify } from 'js-beautify';
import Help from '../Help';
import outputDefinitionHint from '../../codemirror_plugins/outputDefinitionHint';
import * as EditorActions from '../../actions';

const PAGE_JAVASCRIPTL_CODEMIRROR = 'page-javascript-codemirror';

/** エディタの領域を描画する */
class JavaScriptEditor extends Component {
  constructor(props) {
    super(props);

    this.debouncedUpdatePageJavaScript = debounce(500, cm => this.updatePageJavaScript(cm));
  }

  componentDidMount() {
    const { survey } = this.props;

    this.editor = CodeMirror(document.getElementById(PAGE_JAVASCRIPTL_CODEMIRROR), {
      lineNumbers: true,
      mode: 'javascript',
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Shift-Ctrl-F': this.formatCode.bind(this),
      },
      hintOptions: {
        hint: outputDefinitionHint.bind(this, survey),
      },
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
    });
    this.editor.on('change', this.debouncedUpdatePageJavaScript.bind(this));

    const { page } = this.props;
    const code = page.getJavaScriptCode() || '';
    this.editor.setValue(code);
  }

  componentWillReceiveProps(props) {
    // オートコンプリートが更新されるようにhintOptionを更新する
    this.editor.setOption('hintOptions', { hint: outputDefinitionHint.bind(this, props.survey) });
  }

  componentWillUnmount() {
    this.updatePageJavaScript(this.editor);
  }

  formatCode(cm) {
    const formattedJs = js_beautify(cm.getValue(), {
      indent_size: 2,
    });
    cm.setValue(formattedJs);
  }

  updatePageJavaScript(cm) {
    const { runtime, survey, changePageAttribute } = this.props;
    const page = runtime.findCurrentPage(survey);
    changePageAttribute(page.getId(), 'javaScriptCode', cm.getValue());
  }

  render() {
    return (
      <div className="source-editor-container">
        <div id={PAGE_JAVASCRIPTL_CODEMIRROR} className="source-editor" />
        <Help messageId="sourceEditor" placement="bottom" />
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
)(JavaScriptEditor);
