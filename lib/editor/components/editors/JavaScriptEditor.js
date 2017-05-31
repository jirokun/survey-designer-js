/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeMirror from 'react-codemirror';
import debounce from 'throttle-debounce/debounce';
import * as EditorActions from '../../actions';
import 'codemirror/mode/javascript/javascript'; 
import 'codemirror/lib/codemirror.css';

/** エディタの領域を描画する */
class JavaScriptEditor extends Component {
  constructor(props) {
    super(props);

    const { runtime, survey } = this.props;
    const page = runtime.findCurrentPage(survey);
    const code = page.getJavaScriptCode();
    this.state = { code };
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.visible !== this.props.visible) ||
      nextProps.survey !== this.props.survey ||
      nextProps.page.getId() !== this.props.page.getId();
  }

  handleOnFocusChange() {
    const { runtime, survey, changePageAttribute } = this.props;
    const page = runtime.findCurrentPage(survey);
    changePageAttribute(page.getId(), 'javaScriptCode', this.state.code);
  }

  handleOnChange(code) {
    this.setState({ code });
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
    };
    if (!this.props.visible) {
      // visibleではないときに呼ばれるとcodemirrorのサイズが0になってしまうため、
      // visibleではないときには描画しない
      return null;
    }
    return <CodeMirror value={this.state.code} options={options} onChange={str => this.handleOnChange(str)} onFocusChange={() => this.handleOnFocusChange()} />;
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
