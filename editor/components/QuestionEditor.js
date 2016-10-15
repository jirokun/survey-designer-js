import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import CheckboxEditor from './question_editor/CheckboxEditor';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

class QuestionEditor extends Component {
  constructor(props) {
    super(props);
  }
  setType(e) {
    const type = e.target.value;
    const { changeQuestionType } = this.props;
    changeQuestionType(type);
  }
  findEditorComponent(name) {
    const { question } = this.props;
    switch (name) {
      case 'radio':
      case 'checkbox':
        return <CheckboxEditor question={question} plainText={false}/>;
      case 'select':
        return <CheckboxEditor question={question} plainText={true}/>;
      default:
        throw 'undefined editor: ' + name;
    }
  }
  render() {
    const { question } = this.props;
    return (
      <div className="form-horizontal">
        {this.findEditorComponent(question.type)}
      </div>
    );
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  changeQuestionType: value => dispatch(EditorActions.changeQuestionType(value)),
  changeQuestionTitle: value => dispatch(EditorActions.changeQuestionTitle(value)),
  changeQuestionBeforeNote: value => dispatch(EditorActions.changeQuestionBeforeNote(value)),
  changeQuestionAfterNote: value => dispatch(EditorActions.changeQuestionAfterNote(value)),
  changeQuestionChoices: value => dispatch(EditorActions.changeQuestionChoices(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(QuestionEditor);
