import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Checkbox, Glyphicon } from 'react-bootstrap';
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../actions';
import * as RuntimeActions from '../../runtime/actions';
import * as Utils from '../../utils';

class ChoiceEditor extends Component {
  constructor(props) {
    super(props);
    this.destroyed = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const el = document.activeElement;
    // tinymceからのイベントの場合は更新しない
    return !el.classList.contains('choice-editor-tinymce');
  }
  componentDidUpdate(prevProps, prevState) {
  }
  componentWillUnmount() {
    // unmountする時はtinymceのインスタンスをdetroyする
    const editorEls = this.refs.root.querySelectorAll('.choice-editor-tinymce');
    this.destroyed = true;
    return Array.prototype.map.call(editorEls, el => this.getTinyMCEEditorFromEl(el).destroy());
  }
  getTinyMCEEditorFromEl(el) {
    return tinymce.editors.find(editor => document.getElementById(editor.id) === el);
  }
  getChoiceValue() {
    if (this.props.plainText) {
      const editorEls = this.refs.root.querySelectorAll('.plain-text-choice');
      return Array.prototype.map.call(editorEls, el => el.value);
    } else {
      const editorEls = this.refs.root.querySelectorAll('.choice-editor-tinymce');
      const freeInputEls = this.refs.root.querySelectorAll('.free-input input');
      const freeInputRequiredEls = this.refs.root.querySelectorAll('.free-input-required input');
      const exclusionEls = this.refs.root.querySelectorAll('.exclusion input');
      return Immutable.List(Array.prototype.map.call(editorEls, (el, i) => {
        const label = this.getTinyMCEEditorFromEl(el).getContent();
        const obj = {};
        let optionSpecified = false;
        if (freeInputEls[i].checked) {
          obj.freeInput = true;
          optionSpecified = true;
        }
        if (freeInputRequiredEls[i].checked) {
          obj.freeInputRequired = true;
          optionSpecified = true;
        }
        if (exclusionEls[i].checked) {
          obj.exclustion = true;
          optionSpecified = true;
        }
        if (!optionSpecified) {
          // optionが指定されていない時は単純にlabelを返す
          return label;
        }
        obj.label = label;
        return new ChoiceDefinition(obj);
      }));
    }
  }
  handleChangeQuestionChoices(choiceIndex, e) {
    const { page, question } = this.props;
    if (this.destroyed) {
      // destroy後にtinymceにフォーカスが当たっているとchangeイベントが発火することがあるためthis.destroyedで判定
      return;
    }
    const choiceValue = this.getChoiceValue();
    if (this.props.choices.length != choiceValue.length) {
      // TinyMCEのバグ？行削除時に勝手にchangeイベントが発動することがある
      return;
    }
    this.props.handleChoiceChange(choiceValue);
  }
  handleClickAddButton(index, e) {
    const { page, question } = this.props;
    const choiceValue = this.getChoiceValue();
    choiceValue.splice(index + 1, 0, '');
    this.props.handleChoiceChange(choiceValue);
  }
  handleClickMinusButton(index, e) {
    const { page, question } = this.props;
    const choiceValue = this.getChoiceValue();
    choiceValue.splice(index, 1);
    this.props.handleChoiceChange(choiceValue);
  }
  handleChangeOption(index, e) {
    const { page, question } = this.props;
    const choiceValue = this.getChoiceValue();
    console.log(choiceValue);
    this.props.handleChoiceChange(choiceValue);
  }
  renderChoiceEditorRow(choice, index, choices) {
    const content = choice.label ? choice.label : choice;
    const controllerMinusStyle = {
      visibility: choices.length == 1 ? 'hidden' : '',
    };
    const { plainText } = this.props;
    const editor = plainText ? (<input
      type="text" className="form-control plain-text-choice"
      onKeyup={this.handleChangeQuestionChoices.bind(this, index)}
      onChange={this.handleChangeQuestionChoices.bind(this, index)}
      value={content}
    />)
        : (<TinyMCE
          className="choice-editor-tinymce"
          config={{
            menubar: '',
            toolbar: 'fontselect fontsizeselect bold italic underline strikethrough backcolor forecolor subscript superscript anchor code  media removeformat | fullscreen',
            plugins: 'table contextmenu textcolor paste fullscreen lists image link',
            forced_root_block: false,
            inline: true,
            statusbar: false,
          }}
          onKeyup={this.handleChangeQuestionChoices.bind(this, index)}
          onChange={this.handleChangeQuestionChoices.bind(this, index)}
          content={content}
        />);

    return (
      <div className="choice-editor-row" key={`choice-editor-row-${index}`}>
        <div className="choice-editor-tinymce-container">
          {editor}
        </div>
        <div className="choice-editor-controller">
          <Checkbox className="option free-input" onChange={this.handleChangeOption.bind(this, index)} inline>自由記入</Checkbox>
          <Checkbox className="option free-input-required" onChange={this.handleChangeOption.bind(this, index)} inline>自由記入必須</Checkbox>
          <Checkbox className="option exclusion" onChange={this.handleChangeOption.bind(this, index)} inline>排他</Checkbox>
          <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={this.handleClickAddButton.bind(this, index)} />
          <Glyphicon className="clickable icon-button text-danger" glyph="minus-sign" onClick={this.handleClickMinusButton.bind(this, index)} />
        </div>
      </div>
    );
  }
  render() {
    const { choices } = this.props;

    return (
      <div ref="root" className="choice-editor">
        {choices.map(this.renderChoiceEditorRow.bind(this))}
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
