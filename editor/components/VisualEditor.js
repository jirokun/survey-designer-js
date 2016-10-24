import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce'
import QuestionEditor from './QuestionEditor'
import BranchEditor from './BranchEditor'
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

class VisualEditor extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { state } = this.props;
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    if (page) {
      const questionEditors = page.questions.map((question, i)  => <div className="question-editor" key={`question_key_${i}`}><QuestionEditor question={question} page={page}/></div>);
      return <div>{questionEditors}</div>;
    } else {
      const branch = Utils.findBranchFromFlow(state, state.values.currentFlowId);
      return <div><BranchEditor branch={branch}/></div>;
    }
  }
}

const stateToProps = state => ({
  state
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(VisualEditor);
