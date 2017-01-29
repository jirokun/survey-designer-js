import React, { Component } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { connect } from 'react-redux';
import { Col, FormGroup, ControlLabel, Radio, Checkbox, FormControl } from 'react-bootstrap';
import ChoiceEditor from './ChoiceEditor';
import QuestionHtmlEditor from './QuestionHtmlEditor';
import * as EditorActions from '../../actions';

class CheckboxEditor extends Component {
  handleDirectionChange(e) {
    const { page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), 'direction', e.target.value);
  }

  handleRandomChange(e) {
    const { page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), 'random', e.target.checked);
  }

  handleCheckMinCountChange(e) {
    const { page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), 'checkMinCount', e.target.value);
  }

  handleCheckMaxCountChange(e) {
    const { page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), 'checkMaxCount', e.target.value);
  }

  render() {
    const { page, question, plainText } = this.props;

    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>並び方向</Col>
          <Col md={10}>
            <Radio
              inputRef={(ref) => { this.directionVertical = ref; }}
              name="direction"
              onChange={e => this.handleDirectionChange(e)}
              checked={question.getDirection() === 'vertical'}
              value="vertical"
              inline
            >Vertical</Radio>
            <Radio
              inputRef={(ref) => { this.directionHorizontal = ref; }}
              name="direction"
              onChange={e => this.handleDirectionChange(e)}
              checked={question.getDirection() === 'horizontal'}
              value="horizontal"
              inline
            >Horizontal</Radio>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>質問タイトル</Col>
          <Col md={10}><QuestionHtmlEditor page={page} question={question} attributeName="title" /></Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>補足</Col>
          <Col md={10}><QuestionHtmlEditor page={page} question={question} attributeName="beforeNote" /></Col>
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

        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>ランダム制御</Col>
          <Col md={10}>
            <Checkbox checked={question.isRandom()} onChange={e => this.handleRandomChange(e)}>選択肢の表示順をランダム表示</Checkbox>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>チェック数制限</Col>
          <Col md={10}>
            <div className="form-inline">
              <label htmlFor="dummy">最小</label>
              <FormControl componentClass="select" value={question.getCheckMinCount()} onChange={e => this.handleCheckMinCountChange(e)}>
                {question.getChoices().map((c, i) => {
                  const key = `${page.getId()}-${question.getId()}-checkMinCount-${i}`;
                  if (i === 0) {
                    return <option key={key} value="0">制限なし</option>;
                  }
                  return <option key={key} value={i}>{i}</option>;
                })}
              </FormControl>
              <label htmlFor="dummy">最大</label>
              <FormControl componentClass="select" value={question.getCheckMaxCount()} onChange={e => this.handleCheckMaxCountChange(e)}>
                {question.getChoices().map((c, i) => {
                  const key = `${page.getId()}-${question.getId()}-checkMaxCount-${i}`;
                  if (i === 0) {
                    return <option key={key} value={i}>制限なし</option>;
                  }
                  return <option key={key} value={i}>{i}</option>;
                })}
              </FormControl>
            </div>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

ReactMixin(CheckboxEditor.prototype, LinkedStateMixin);

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
)(CheckboxEditor);
