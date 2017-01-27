import React, { Component } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { connect } from 'react-redux';
import uuid from 'node-uuid';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import { Col, FormGroup, ControlLabel, Radio, Checkbox } from 'react-bootstrap';
import ChoiceEditor from '../ChoiceEditor';
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

  componentDidUpdate(prevProps) {
    const oldPage = prevProps.page;
    const page = this.props.page;
    if (oldPage.id === page.id) {
      return;
    }
    const { question } = this.props;
    const questionTitleEditor = tinymce.EditorManager.get(`${this.uuid}-questionTitleEditor`);
    const questionBeforeNoteEditor = tinymce.EditorManager.get(`${this.uuid}-questionBeforeNoteEditor`);
    questionTitleEditor.setContent(question.title);
    questionBeforeNoteEditor.setContent(question.beforeNote);
  }

  handleCheckboxEditorChange() {
    const { page, question, changeQuestion } = this.props;
    const newQuestion = question
      .set('title', this.state.title)
      .set('plainTitle', this.state.plainTitle)
      .set('beforeNote', this.state.beforeNote)
      .set('vertical', this.directionVertical.checked)
      .set('choices', this.state.choices);
    changeQuestion(page.getId(), question.getId(), newQuestion);
  }

  handleChoiceChange(choices) {
    this.setState({ choices }, this.handleCheckboxEditorChange.bind(this));
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
    const choices = question.getChoices();

    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>並び方向</Col>
          <Col md={10}>
            <Radio
              inputRef={(ref) => { this.directionVertical = ref; }}
              name="direction"
              onChange={() => this.handleCheckboxEditorChange()}
              checked={question.vertical}
              inline
            >Vertical</Radio>
            <Radio
              inputRef={(ref) => { this.directionHorizontal = ref; }}
              name="direction"
              onChange={() => this.handleCheckboxEditorChange()}
              checked={!question.vertical}
              inline
            >Horizontal</Radio>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>質問タイトル</Col>
          <Col md={10}>
            <TinyMCE
              id={`${this.uuid}-questionTitleEditor`}
              config={{
                menubar: '',
                toolbar: 'bold italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen',
                plugins: 'table contextmenu textcolor paste fullscreen link',
                inline: false,
                height: 40,
                statusbar: false,
              }}
              onKeyup={(e, editor) => this.handleTinyMCEChange('title', e, editor)}
              onChange={(e, editor) => this.handleTinyMCEChange('title', e, editor)}
              content={question.title}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>補足</Col>
          <Col md={10}>
            <TinyMCE
              id={`${this.uuid}-questionBeforeNoteEditor`}
              config={{
                menubar: '',
                toolbar: 'bold italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen',
                plugins: 'table contextmenu textcolor paste fullscreen link',
                inline: false,
                height: 40,
                statusbar: false,
              }}
              onKeyup={(e, editor) => this.handleTinyMCEChange('beforeNote', e, editor)}
              onChange={(e, editor) => this.handleTinyMCEChange('beforeNote', e, editor)}
              content={question.beforeNote}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>選択肢</Col>
          <Col md={10}>
            <ChoiceEditor
              page={page}
              question={question}
              choices={choices}
              plainText={plainText}
              handleChoiceChange={v => this.handleChoiceChange(v)}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>ランダム制御</Col>
          <Col md={10}>
            <Checkbox>選択肢の表示順をランダム表示</Checkbox>
            <Checkbox>最後の選択肢は固定</Checkbox>
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
