import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import QuestionEditor from './QuestionEditor';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

class VisualEditor extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { state, page } = this.props;
    const questionEditors = page.questions.map(question => <div className="question-editor"><QuestionEditor question={question} /></div>);
    return <div>{questionEditors}</div>;
  }
}

const stateToProps = state => ({
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(VisualEditor);
