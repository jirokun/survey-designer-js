import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputGroup, Col, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
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
    const { page, question } = this.props;
    return (
      <Form horizontal>
        <FormGroup validationState={this.state.validationState ? 'error' : null}>
          <Col componentClass={ControlLabel} md={2}>質問ID</Col>
          <Col sm={4}>
            <InputGroup>
              <InputGroup.Addon>{page.id}-</InputGroup.Addon>
              <FormControl
                ref={(el) => { this.questionIdEl = el; }}
                type="text"
                value={this.state.questionId}
              />
            </InputGroup>
          </Col>
        </FormGroup>

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
