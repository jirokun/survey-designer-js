import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TinyMCE from 'react-tinymce';
import QuestionEditor from './QuestionEditor';
import BranchEditor from './BranchEditor';
import * as EditorActions from '../actions';
import * as RuntimeActions from '../../runtime/actions';
import * as Utils from '../../utils';

class VisualEditor extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { state } = this.props;
    const flow = state.findCurrentFlow();
    if (flow.isPage()) {
      const page = state.findCurrentPage();
      const questionEditors = page.questions.map((question, i) => <div className="question-editor" key={`${page.id}_${question.id}`}><QuestionEditor question={question} page={page} /></div>);
      return <div>{questionEditors}</div>;
    }
    return <div><BranchEditor/></div>;
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
