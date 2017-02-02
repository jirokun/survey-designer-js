import React, { Component } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { connect } from 'react-redux';
import { Col, FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';
import ChoiceEditor from './ChoiceEditor';
import QuestionHtmlEditor from './QuestionHtmlEditor';
import * as EditorActions from '../../actions';

class RadioQuestionEditor extends Component {
  handleRandomChange(e) {
    const { page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), 'random', e.target.checked);
  }

  render() {
    const { page, question, plainText } = this.props;

    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>質問タイトル</Col>
          <Col md={10}><QuestionHtmlEditor page={page} question={question} attributeName="title" /></Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>補足</Col>
          <Col md={10}><QuestionHtmlEditor page={page} question={question} attributeName="beforeNote" /></Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>ランダム制御</Col>
          <Col md={10}>
            <Checkbox checked={question.isRandom()} onChange={e => this.handleRandomChange(e)}>選択肢の表示順をランダム表示</Checkbox>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>選択肢</Col>
          <Col md={10}>
            <ChoiceEditor
              page={page}
              question={question}
              plainText={plainText}
            />
          </Col>
        </FormGroup>
      </div>
    );
  }
}

ReactMixin(RadioQuestionEditor.prototype, LinkedStateMixin);

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeQuestionAttribute: (pageId, questionId, attribute, value) =>
    dispatch(EditorActions.changeQuestionAttribute(pageId, questionId, attribute, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(RadioQuestionEditor);
