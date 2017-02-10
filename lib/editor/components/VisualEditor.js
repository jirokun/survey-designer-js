import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionEditor from './QuestionEditor';
import BranchEditor from './BranchEditor';

class VisualEditor extends Component {
  render() {
    const { state } = this.props;
    const node = state.findCurrentNode();
    if (node.isPage()) {
      const page = state.findCurrentPage();
      const questionEditors = page.questions.map(question => <div className="question-editor" key={`${page.id}_${question.id}`}><QuestionEditor question={question} page={page} /></div>);
      return <div>{questionEditors}</div>;
    } else if (node.isBranch()) {
      const branch = state.findCurrentBranch();
      return <div><BranchEditor branch={branch} /></div>;
    } else if (node.isFinisher()) {
      return <div>finisher</div>;
    }
    throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps,
)(VisualEditor);
