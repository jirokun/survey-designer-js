import React, { Component, PropTypes } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TinyMCE from 'react-tinymce';
import ChoiceEditor from '../ChoiceEditor';
import { HelpBlock, InputGroup, Row, Col, Form, FormGroup, ControlLabel, FormControl, Radio, Checkbox } from 'react-bootstrap';
import * as EditorActions from '../../actions';
import * as RuntimeActions from '../../../runtime/actions';
import * as Utils from '../../../utils';
import uuid from 'node-uuid';

class CheckboxEditor extends Component {
  constructor(props) {
    super(props);
    const { question } = props;
    this.uuid = uuid.v4();
    this.state = {
      title: question.title,
      beforeNote: question.beroreNote === undefined ? '' : question.beforeNote,
      choices: question.choices,
    };
  }

  static getDefaultDefinition() {
    return {
      title: '複数選択肢',
      beforeNote: '',
      type: 'checkbox',
      vertical: true,
      choices: [
        '選択肢1',
        '選択肢2',
      ],
      random: false,
      randomFixLast: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
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

  handleCheckboxEditorChange(e) {
    const { page, question, changeQuestion } = this.props;
    const title = this.state.title;
    const beforeNote = this.state.beforeNote;
    const vertical = this.directionVertical.checked;
    const choices = this.state.choices;
    const questionDef = {
      title, beforeNote, vertical, choices,
    };
    changeQuestion(page.id, question.id, questionDef);
  }

  handleChoiceChange(choices) {
    this.setState({ choices }, this.handleCheckboxEditorChange.bind(this));
  }

  handleTinyMCEChange(prop, event, editor) {
    const state = {};
    state[prop] = editor.getContent();
    this.setState(state, this.handleCheckboxEditorChange.bind(this, event));
  }

  render() {
    const { page, question, plainText } = this.props;
    const choices = question.getChoices();

    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>並び方向</Col>
          <Col md={10}>
            <Radio inputRef={(ref) => { this.directionVertical = ref; }} name="direction" onChange={this.handleCheckboxEditorChange.bind(this)} checked={question.vertical} inline>Vertical</Radio>
            <Radio inputRef={(ref) => { this.directionHorizontal = ref; }} name="direction" onChange={this.handleCheckboxEditorChange.bind(this)} checked={!question.vertical} inline>Horizontal</Radio>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>質問タイトル</Col>
          <Col md={10}>
            <TinyMCE
              id={`${this.uuid}-questionTitleEditor`}
              config={{
                menubar: '',
                toolbar: 'styleselect fontselect fontsizeselect bullist numlist outdent indent blockquote removeformat link unlink image visualchars fullscreen table forecolor backcolor',
                plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                inline: false,
                height: 40,
                statusbar: false,
              }}
              onKeyup={this.handleTinyMCEChange.bind(this, 'title')}
              onChange={this.handleTinyMCEChange.bind(this, 'title')}
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
                toolbar: 'styleselect fontselect fontsizeselect bullist numlist outdent indent blockquote removeformat link unlink image visualchars fullscreen table forecolor backcolor',
                plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                inline: false,
                height: 40,
                statusbar: false,
              }}
              onKeyup={this.handleTinyMCEChange.bind(this, 'beforeNote')}
              onChange={this.handleTinyMCEChange.bind(this, 'beforeNote')}
              content={question.beforeNote}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>選択肢</Col>
          <Col md={10}>
            <ChoiceEditor page={page} question={question} choices={choices} plainText={plainText} handleChoiceChange={this.handleChoiceChange.bind(this)} />
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
