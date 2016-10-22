import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import CheckboxEditor from './question_editor/CheckboxEditor';
import { HelpBlock, InputGroup, Col, Form, FormGroup, ControlLabel, FormControl, Radio, Checkbox } from 'react-bootstrap';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'
import * as Validator from '../validator'

class QuestionEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: props.question.id
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      questionId: nextProps.question.id
    });
  }

  onQuestionIdChanged(e) {
    const { page, changeQuestionId, question } = this.props;
    const questionId = ReactDOM.findDOMNode(this.refs.questionId).value;
    const hasError = !Validator.validateQuestionId(page, question.id, questionId);
    const validationState = hasError ? 'error' : '';

    this.setState({
      validationState,
      questionId
    });

    // 成功時のみ更新する
    if (!hasError) {
      changeQuestionId(page.id, question.id, questionId);
    }
  }

  findEditorComponent(name) {
    const { page, question } = this.props;
    switch (name) {
      case 'radio':
      case 'checkbox':
        return <CheckboxEditor page={page} question={question} plainText={false}/>;
      case 'select':
        return <CheckboxEditor page={page} question={question} plainText={true}/>;
      default:
        throw 'undefined editor: ' + name;
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
              <FormControl ref="questionId" type="text" value={this.state.questionId} onChange={this.onQuestionIdChanged.bind(this)}/>
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
  changeQuestionId: (pageId, oldQuestionId, newQuestionId) => dispatch(EditorActions.changeQuestionId(pageId, oldQuestionId, newQuestionId))
});

export default connect(
  stateToProps,
  actionsToProps
)(QuestionEditor);
