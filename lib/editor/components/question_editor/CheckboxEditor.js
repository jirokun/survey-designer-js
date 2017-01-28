import React, { Component } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { connect } from 'react-redux';
import uuid from 'node-uuid';
import { Col, FormGroup, ControlLabel, Radio, Checkbox, FormControl } from 'react-bootstrap';
import ChoiceEditor from '../ChoiceEditor';
import QuestionHtmlEditor from './QuestionHtmlEditor';
import * as EditorActions from '../../actions';

class CheckboxEditor extends Component {
  constructor(props) {
    super(props);
    const { question } = props;
    this.uuid = uuid.v4();
    this.state = {
      title: question.getTitle(),
      plainTitle: question.getPlainTitle(),
      beforeNote: question.getBeforeNote(),
      choices: question.getChoices(),
    };
  }

  handleCheckboxEditorChange() {
    const { page, question, changeQuestion } = this.props;
    const newQuestion = question
      .set('vertical', this.directionVertical.checked)
      .set('choices', this.state.choices);
    changeQuestion(page.getId(), question.getId(), newQuestion);
  }

  handleChoiceChange(choices) {
    this.setState({ choices }, this.handleCheckboxEditorChange.bind(this));
  }

  handleRandomChange(e) {
    const { page, question, changeQuestion } = this.props;
    const newQuestion = question
      .set('random', e.target.checked);
    changeQuestion(page.getId(), question.getId(), newQuestion);
  }

  handleTinyMCEChange(prop, event, editor) {
    const state = {};
    state[prop] = editor.getContent();
    if (prop === 'title') {
      state.plainTitle = editor.getContent({ format: 'text' });
    }
    state[prop] = editor.getContent();
    this.setState(state, this.handleCheckboxEditorChange.bind(this));
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
              onChange={() => this.handleCheckboxEditorChange()}
              checked={question.isVertical()}
              inline
            >Vertical</Radio>
            <Radio
              inputRef={(ref) => { this.directionHorizontal = ref; }}
              name="direction"
              onChange={() => this.handleCheckboxEditorChange()}
              checked={!question.isVertical()}
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
              handleChoiceChange={v => this.handleChoiceChange(v)}
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
              <FormControl componentClass="select" placeholder="">
                <option value="0">制限なし</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </FormControl>
              <label htmlFor="dummy">最大</label>
              <FormControl componentClass="select" placeholder="">
                <option value="0">制限なし</option>
                <option value="1">1</option>
                <option value="2">2</option>
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
  changeQuestion: (pageId, questionId, value) => dispatch(EditorActions.changeQuestion(pageId, questionId, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(CheckboxEditor);
