/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Checkbox, Glyphicon } from 'react-bootstrap';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import ChoiceDefinition from '../../runtime/models/ChoiceDefinition';

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
    const freeInputEls = rootEl.querySelectorAll('.free-input input');
    const freeInputRequiredEls = rootEl.querySelectorAll('.free-input-required input');
    const exclusionEls = rootEl.querySelectorAll('.exclusion input');
    return Immutable.List(Array.prototype.map.call(editorEls, (el, i) => new ChoiceDefinition({
      label: ChoiceEditor.getTinyMCEEditorFromEl(el).getContent(),
      plainLabel: ChoiceEditor.getTinyMCEEditorFromEl(el).getContent({ format: 'text' }),
      freeInput: freeInputEls[i].checked,
      freeInputRequired: freeInputRequiredEls[i].checked,
      exclustion: exclusionEls[i].checked,
    })));
  }
  handleChangeQuestionChoices() {
    if (this.destroyed) {
      // destroy後にtinymceにフォーカスが当たっているとchangeイベントが発火することがあるためthis.destroyedで判定
      return;
    }
    const choiceValue = this.getChoiceValue();
    if (this.props.choices.size !== choiceValue.size) {
      // TinyMCEのバグ？行削除時に勝手にchangeイベントが発動することがある
      return;
    }
    this.props.handleChoiceChange(choiceValue);
  }
  handleClickAddButton(index) {
    const choiceValue = this.getChoiceValue().insert(index + 1, new ChoiceDefinition());
    this.props.handleChoiceChange(choiceValue);
  }
  handleClickMinusButton(index) {
    const choiceValue = this.getChoiceValue().delete(index);
    this.props.handleChoiceChange(choiceValue);
  }
  handleChangeOption() {
    const choiceValue = this.getChoiceValue();
    this.props.handleChoiceChange(choiceValue);
  }
  renderChoiceEditorRow(choice, index, choices) {
    const content = choice.getLabel();
    const controllerMinusStyle = {
      visibility: choices.size === 1 ? 'hidden' : '',
    };
    const { plainText } = this.props;
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

    return (
      <div className="choice-editor-row" key={`choice-editor-row-${index}`}>
        <div className="choice-editor-tinymce-container">
          {editor}
        </div>
        <div className="choice-editor-controller">
          <Checkbox className="option free-input" onChange={() => this.handleChangeOption()} inline >自由記入</Checkbox>
          <Checkbox className="option free-input-required" onChange={() => this.handleChangeOption()} inline >自由記入必須</Checkbox>
          <Checkbox className="option exclusion" onChange={() => this.handleChangeOption()} inline>排他</Checkbox>
          <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={() => this.handleClickAddButton(index)} />
          <Glyphicon className="clickable icon-button text-danger" glyph="minus-sign" onClick={() => this.handleClickMinusButton(index)} style={controllerMinusStyle} />
        </div>
      </div>
    );
  }
  render() {
    return (
      <div ref={(el) => { this.rootEl = el; }} className="choice-editor">
        {this.props.choices.map((choice, index, choices) => this.renderChoiceEditorRow(choice, index, choices))}
      </div>
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
)(ChoiceEditor);
