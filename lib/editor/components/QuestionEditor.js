import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import CheckboxEditor from './question_editor/CheckboxEditor';

class QuestionEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: props.question.id,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      questionId: nextProps.question.id,
    });
  }

  findEditorComponent(name) {
    const { page, question } = this.props;
    switch (name) {
      case 'radio':
      case 'checkbox':
        return <CheckboxEditor page={page} question={question} plainText={false} />;
      case 'select':
        return <CheckboxEditor page={page} question={question} plainText />;
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
