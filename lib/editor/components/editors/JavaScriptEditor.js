/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeMirror from 'react-codemirror';
import * as EditorActions from '../../actions';
import PageDefinition from '../../../runtime/models/survey/PageDefinition';
import 'codemirror/mode/javascript/javascript'; 
import 'codemirror/lib/codemirror.css';

/** エディタの領域を描画する */
class JavaScriptEditor extends Component {
  shouldComponentUpdate(nextProps) {
    return (nextProps.visible !== this.props.visible) ||
      nextProps.survey !== this.props.survey ||
      nextProps.page.getId() !== this.props.page.getId();
  }

  handleOnChange(code) {
    const { runtime, survey, changePageAttribute } = this.props;
    const page = runtime.findCurrentPage(survey);
    const encodedCode = PageDefinition.encodeJavaScriptCode(survey, code);
    changePageAttribute(page.getId(), 'javaScriptCode', encodedCode);
  }

  render() {
    const { runtime, survey } = this.props;
    const page = runtime.findCurrentPage(survey);
    const options = {
      lineNumbers: true,
      mode: 'javascript',
    };
    const code = page.getJavaScriptCode();
    if (!this.props.visible) {
      // visibleではないときに呼ばれるとcodemirrorのサイズが0になってしまうため、
      // visibleではないときには描画しない
      return null;
    }
    const decodedCode = PageDefinition.decodeJavaScriptCode(survey, code);
    return <CodeMirror value={decodedCode} options={options} onChange={str => this.handleOnChange(str)} />;
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
