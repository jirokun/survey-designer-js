/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeMirror from 'react-codemirror';
import * as EditorActions from '../../actions';
import 'codemirror/mode/javascript/javascript'; 
import 'codemirror/lib/codemirror.css';

/** エディタの領域を描画する */
class JavaScriptEditor extends Component {
  handleOnChange(str) {
    const { state, changePageAttribute } = this.props;
    const page = state.findCurrentPage();
    changePageAttribute(page.getId(), 'javaScriptCode', str);
  }

  render() {
    const { state } = this.props;
    const page = state.findCurrentPage();
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
    return <CodeMirror value={code} options={options} onChange={str => this.handleOnChange(str)} />;
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changePageAttribute: (pageId, attributeName, value) => dispatch(EditorActions.changePageAttribute(pageId, attributeName, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(JavaScriptEditor);
