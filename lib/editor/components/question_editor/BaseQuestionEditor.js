import React, { Component } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { connect } from 'react-redux';
import { Col, FormGroup, ControlLabel, Checkbox, FormControl, InputGroup } from 'react-bootstrap';
import ChoiceEditor from './ChoiceEditor';
import QuestionHtmlEditor from './QuestionHtmlEditor';
import * as EditorActions from '../../actions';

class BaseQuestionEditor extends Component {
  handleChangeQuestionAttribute(attribute, value) {
    const { page, question, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), attribute, value);
  }

  render() {
    const {
      page,
      question,
      plainText,
      title,
      beforeNote,
      random,
      choice,
      min,
      max,
      showTotal,
      unit,
      choiceExclusive,
      checkCount,
      totalEqualTo,
    } = this.props;

    return (
      <div>
        <h4>項目定義</h4>
        { title ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>質問タイトル</Col>
            <Col md={10}><QuestionHtmlEditor page={page} question={question} attributeName="title" /></Col>
          </FormGroup> : null }
        { beforeNote ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>補足</Col>
            <Col md={10}><QuestionHtmlEditor page={page} question={question} attributeName="beforeNote" /></Col>
          </FormGroup> : null }
        { random || showTotal ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>オプション</Col>
            <Col md={10}>
              { random ?
                <Checkbox checked={question.isRandom()} onChange={e => this.handleChangeQuestionAttribute('random', e.target.checked)}>選択肢の表示順をランダム表示</Checkbox> : null }
              { showTotal ?
                <Checkbox checked={question.isShowTotal()} onChange={e => this.handleChangeQuestionAttribute('showTotal', e.target.checked)}>入力値の合計を表示する</Checkbox> : null }
            </Col>
          </FormGroup> : null }
        { choice ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>選択肢</Col>
            <Col md={10}>
              <ChoiceEditor
                page={page}
                question={question}
                plainText={plainText}
                exclusive={choiceExclusive}
              />
            </Col>
          </FormGroup> : null }
        { unit ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>単位</Col>
            <Col md={10}>
              <FormControl componentClass="input" value={question.getUnit()} onChange={e => this.handleChangeQuestionAttribute('unit', e.target.value)} />
            </Col>
          </FormGroup> : null }
        <h4>入力値制限</h4>
        { min ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>最小値</Col>
            <Col md={10}>
              <FormControl componentClass="input" value={question.getMin()} onChange={e => this.handleChangeQuestionAttribute('min', e.target.value)} />
            </Col>
          </FormGroup> : null }
        { max ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>最大値</Col>
            <Col md={10}>
              <FormControl componentClass="input" value={question.getMax()} onChange={e => this.handleChangeQuestionAttribute('max', e.target.value)} />
            </Col>
          </FormGroup> : null }
        { totalEqualTo && question.isShowTotal() ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>合計値</Col>
            <Col md={10}>
              <FormGroup>
                <InputGroup>
                  <FormControl type="text" value={question.getTotalEqualTo()} onChange={e => this.handleChangeQuestionAttribute('totalEqualTo', e.target.value)} />
                  <InputGroup.Addon>になるように制限する</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </Col>
          </FormGroup> : null }
        { checkCount ?
          <FormGroup>
            <Col componentClass={ControlLabel} md={2}>チェック数制限</Col>
            <Col md={10}>
              <div className="form-inline">
                <label htmlFor="dummy">最小</label>
                <FormControl componentClass="select" value={question.getMinCheckCount()} onChange={e => this.handleChangeQuestionAttribute('minCheckCount', e.target.value)}>
                  {question.getChoices().map((c, i) => {
                    const key = `${page.getId()}-${question.getId()}-minCheckCount-${i}`;
                    return <option key={key} value={i}>{i === 0 ? '制限なし' : i}</option>;
                  })}
                  <option value={question.getChoices().size}>{question.getChoices().size}</option>;
                </FormControl>
                <label htmlFor="dummy">最大</label>
                <FormControl componentClass="select" value={question.getMaxCheckCount()} onChange={e => this.handleChangeQuestionAttribute('maxCheckCount', e.target.value)}>
                  {question.getChoices().map((c, i) => {
                    const key = `${page.getId()}-${question.getId()}-maxCheckCount-${i}`;
                    return <option key={key} value={i}>{i === 0 ? '制限なし' : i}</option>;
                  })}
                  <option value={question.getChoices().size}>{question.getChoices().size}</option>;
                </FormControl>
              </div>
            </Col>
          </FormGroup> : null }
      </div>
    );
  }
}

ReactMixin(BaseQuestionEditor.prototype, LinkedStateMixin);

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
)(BaseQuestionEditor);
