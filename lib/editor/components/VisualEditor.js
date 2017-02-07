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
    }
    const branch = state.findCurrentBranch();
    return <div><BranchEditor branch={branch} /></div>;
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
