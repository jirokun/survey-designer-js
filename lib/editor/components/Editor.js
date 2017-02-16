import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as EditorActions from '../actions';
import QuestionEditor from './QuestionEditor';
import BranchEditor from './BranchEditor';
import FinisherEditor from './FinisherEditor';

class Editor extends Component {
  getEditor() {
    const { state } = this.props;
    const node = state.findCurrentNode();
    if (node.isPage()) {
      const page = state.findCurrentPage();
      const questionEditors = page.questions.map(question => <div className="question-editor" key={`${page.getId()}_${question.getId()}`}><QuestionEditor question={question} page={page} /></div>);
      return questionEditors;
    } else if (node.isBranch()) {
      const branch = state.findCurrentBranch();
      return <BranchEditor branch={branch} />;
    } else if (node.isFinisher()) {
      const finisher = state.findCurrentFinisher();
      return <FinisherEditor finisher={finisher} />;
    }
    throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
  }

  render() {
    return <div className="editor-pane">{this.getEditor()}</div>;
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Editor);
