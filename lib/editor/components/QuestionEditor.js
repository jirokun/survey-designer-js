import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { findQuestionEditorClass } from './question_editor/QuestionEditors';

class QuestionEditor extends Component {
  findEditorComponent(name) {
    const { page, question } = this.props;
    const Editor = findQuestionEditorClass(`${name}Editor`);
    if (!Editor) return <div>undefined component type: {name}</div>;
    return <Editor page={page} question={question} />;
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
