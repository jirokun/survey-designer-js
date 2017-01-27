import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionEditor from './QuestionEditor';
import BranchEditor from './BranchEditor';

export class VisualEditor extends Component {
  render() {
    const { state } = this.props;
    const flow = state.findCurrentFlow();
    if (flow.isPage()) {
      const page = state.findCurrentPage();
      const questionEditors = page.questions.map(question => <div className="question-editor" key={`${page.id}_${question.id}`}><QuestionEditor question={question} page={page} /></div>);
      return <div>{questionEditors}</div>;
    }
    return <div><BranchEditor /></div>;
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
