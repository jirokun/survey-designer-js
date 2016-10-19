import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import CheckboxEditor from './question_editor/CheckboxEditor';
import { InputGroup, Col, Form, FormGroup, ControlLabel, FormControl, Radio, Checkbox } from 'react-bootstrap';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

class QuestionEditor extends Component {
  constructor(props) {
    super(props);
  }

  onQuestionIdChanged(e) {
    console.log(e);
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
    const { page, question } = this.props;
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>質問ID</Col>
          <Col sm={4}>
            <InputGroup>
              <InputGroup.Addon>{page.id}-</InputGroup.Addon>
              <FormControl ref="questionId" type="text" value={question.id} onChange={this.onQuestionIdChanged.bind(this)}/>
            </InputGroup>
          </Col>
        </FormGroup>

        {this.findEditorComponent(question.type)}
      </Form>
    );
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(QuestionEditor);
