/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import ChoiceDefinition from '../../../runtime/models/ChoiceDefinition';
import * as EditorActions from '../../actions';

class ChoiceEditor extends Component {
  static getTinyMCEEditorFromEl(el) {
    return tinymce.editors.find(editor => document.getElementById(editor.id) === el);
  }

  constructor(props) {
    super(props);
    this.destroyed = false;
  }

  shouldComponentUpdate() {
    const el = document.activeElement;
    // tinymceからのイベントの場合は更新しない
    return !el.classList.contains('choice-editor-tinymce');
  }

  componentWillUnmount() {
    // unmountする時はtinymceのインスタンスをdetroyする
    // this.rootElを参照したいがなぜかnullになってしまうことが有る
    const rootEl = ReactDOM.findDOMNode(this);
    const editorEls = rootEl.querySelectorAll('.choice-editor-tinymce');
    this.destroyed = true;
    return Array.prototype.map.call(editorEls, el => ChoiceEditor.getTinyMCEEditorFromEl(el).destroy());
  }

  getChoiceValue() {
    // this.rootElを参照したいがなぜかnullになってしまうことが有る
    const rootEl = ReactDOM.findDOMNode(this);
    if (this.props.plainText) {
      const editorEls = rootEl.querySelectorAll('.plain-text-choice');
      return Array.prototype.map.call(editorEls, el => el.value);
    }
    const editorEls = rootEl.querySelectorAll('.choice-editor-tinymce');
    const randomFixedEls = rootEl.querySelectorAll('input.random-fixed');
    const freeInputEls = rootEl.querySelectorAll('input.free-input');
    const freeInputRequiredEls = rootEl.querySelectorAll('input.free-input-required');
    const exclusionEls = rootEl.querySelectorAll('input.exclusion');
    return Immutable.List(Array.prototype.map.call(editorEls, (el, i) => new ChoiceDefinition({
      label: ChoiceEditor.getTinyMCEEditorFromEl(el).getContent(),
      plainLabel: ChoiceEditor.getTinyMCEEditorFromEl(el).getContent({ format: 'text' }),
      randomFixed: randomFixedEls[i].checked,
      freeInput: freeInputEls[i].checked,
      freeInputRequired: freeInputRequiredEls[i].checked,
      exclusion: exclusionEls[i].checked,
    })));
  }
  handleChangeQuestionChoices() {
    const { page, question, changeQuestionAttribute } = this.props;
    if (this.destroyed) {
      // destroy後にtinymceにフォーカスが当たっているとchangeイベントが発火することがあるためthis.destroyedで判定
      return;
    }
    const choiceValue = this.getChoiceValue();
    if (question.getChoices().size !== choiceValue.size) {
      // TinyMCEのバグ？行削除時に勝手にchangeイベントが発動することがある
      return;
    }
    changeQuestionAttribute(page.getId(), question.getId(), 'choices', choiceValue);
  }
  handleClickAddButton(index) {
    const { page, question, changeQuestionAttribute } = this.props;
    const choiceValue = this.getChoiceValue().insert(index + 1, new ChoiceDefinition());
    changeQuestionAttribute(page.getId(), question.getId(), 'choices', choiceValue);
  }
  handleClickMinusButton(index) {
    const { page, question, changeQuestionAttribute } = this.props;
    const choiceValue = this.getChoiceValue().delete(index);
    changeQuestionAttribute(page.getId(), question.getId(), 'choices', choiceValue);
  }
  handleChangeOption() {
    const { page, question, changeQuestionAttribute } = this.props;
    const choiceValue = this.getChoiceValue();
    changeQuestionAttribute(page.getId(), question.getId(), 'choices', choiceValue);
  }
  renderChoiceEditorRow(choice, index, choices) {
    const { question, plainText } = this.props;
    const content = choice.getLabel();
    const controllerMinusStyle = {
      visibility: choices.size === 1 ? 'hidden' : '',
    };
    const editor = plainText ? (<input
      type="text" className="form-control plain-text-choice"
      onKeyup={() => this.handleChangeQuestionChoices()}
      onChange={() => this.handleChangeQuestionChoices()}
      value={content}
    />)
        : (<TinyMCE
          className="choice-editor-tinymce"
          config={{
            menubar: '',
            toolbar: 'bold italic underline strikethrough backcolor forecolor anchor removeformat',
            plugins: 'contextmenu textcolor paste link',
            forced_root_block: false,
            inline: true,
            statusbar: false,
          }}
          onKeyup={(e, editorInstance) => this.handleChangeQuestionChoices(e, editorInstance)}
          onChange={(e, editorInstance) => this.handleChangeQuestionChoices(e, editorInstance)}
          content={content}
        />);

    const randomFixed = question.isRandom() ?
      <td className="option"><input type="checkbox" className="random-fixed" onChange={() => this.handleChangeOption()} checked={choice.isRandomFixed()} /></td> : null;

    return (
      <tr className="choice-editor-row" key={`choice-editor-row-${index}`}>
        <td className="choice-editor-tinymce-container">{editor}</td>
        {randomFixed}
        <td className="option"><input type="checkbox" className="free-input" onChange={() => this.handleChangeOption()} checked={choice.isFreeInput()} /></td>
        <td className="option"><input type="checkbox" className="free-input-required" onChange={() => this.handleChangeOption()} checked={choice.isFreeInputRequired()} /></td>
        <td className="option"><input type="checkbox" className="exclusion" onChange={() => this.handleChangeOption()} checked={choice.isExclusion()} /></td>
        <td className="buttons">
          <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={() => this.handleClickAddButton(index)} />
          <Glyphicon className="clickable icon-button text-danger" glyph="minus-sign" onClick={() => this.handleClickMinusButton(index)} style={controllerMinusStyle} />
        </td>
      </tr>
    );
  }
  render() {
    const { question } = this.props;
    const choices = question.getChoices();
    const randomFixed = question.isRandom() ? <th>固定</th> : null;
    return (
      <div ref={(el) => { this.rootEl = el; }} className="choice-editor">
        <table className="choice-editor-table">
          <thead>
            <tr>
              <th />
              {randomFixed}
              <th>自由<br />記入</th>
              <th>自由<br />記入<br />必須</th>
              <th>排他</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {choices.map((choice, index, arr) => this.renderChoiceEditorRow(choice, index, arr))}
          </tbody>
        </table>
      </div>
    );
  }
}

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
)(ChoiceEditor);
