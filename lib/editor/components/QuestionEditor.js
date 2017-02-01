import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import CheckboxQuestionEditor from './question_editor/CheckboxQuestionEditor';

class QuestionEditor extends Component {
  findEditorComponent(name) {
    const { page, question } = this.props;
    switch (name) {
      case 'radio':
      case 'CheckboxQuestion':
        return <CheckboxQuestionEditor page={page} question={question} plainText={false} />;
      case 'select':
        return <CheckboxQuestionEditor page={page} question={question} plainText />;
      default:
        return <div>undefined component type: {name}</div>;
    }
  }

  render() {
    const { question } = this.props;
    return (
      <Form horizontal>
        {this.findEditorComponent(question.type)}
      </Form>
    );
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
)(QuestionEditor);
