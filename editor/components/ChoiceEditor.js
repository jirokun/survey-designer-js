import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Checkbox, Glyphicon } from 'react-bootstrap';
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

class ChoiceEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const el = document.activeElement;
    // tinymceからのイベントの場合は更新しない
    return !el.classList.contains('choice-editor-tinymce');
  }
  componentDidUpdate(prevProps, prevState) {
  }
  getTinyMCEEditorFromEl(el) {
    return tinymce.editors.find(editor => document.getElementById(editor.id) === el);
  }
  getChoiceValue() {
    const _this = this;
    if (this.props.plainText) {
      const editorEls = this.refs.root.querySelectorAll('.plain-text-choice');
      return Array.prototype.map.call(editorEls, el => {
        return el.value;
      });
    } else {
      const editorEls = this.refs.root.querySelectorAll('.choice-editor-tinymce');
      return Array.prototype.map.call(editorEls, el => {
        return _this.getTinyMCEEditorFromEl(el).getContent();
      });
    }
  }
  handleChangeQuestionChoices(choiceIndex, e) {
    const { page, question } = this.props;
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
  renderChoiceEditorRow(choice, index, choices) {
    const content = choice.label ? choice.label : choice;
    const controllerMinusStyle = {
      visibility: choices.length == 1 ? 'hidden' : ''
    }
    const { plainText } = this.props;
    const editor = plainText ? <input type="text" className="form-control plain-text-choice"
      onKeyup={this.handleChangeQuestionChoices.bind(this, index)}
      onChange={this.handleChangeQuestionChoices.bind(this, index)}
      value={content}/>
        : <TinyMCE className="choice-editor-tinymce"
            config={
              {
                menubar: '',
                toolbar: 'fontselect fontsizeselect bold italic underline strikethrough backcolor forecolor subscript superscript anchor code  media removeformat | fullscreen',
                plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                forced_root_block : false,
                inline: true,
                statusbar: false
              }
            }
            onKeyup={this.handleChangeQuestionChoices.bind(this, index)}
            onChange={this.handleChangeQuestionChoices.bind(this, index)}
            content={content}
          />;

    return (
      <div className="choice-editor-row" key={"choice-editor-row-" + index}>
        <div className="choice-editor-tinymce-container">
          {editor}
        </div>
        <div className="choice-editor-controller">
          <Checkbox className="option" inline>自由記入</Checkbox>
          <Checkbox className="option" inline>自由記入必須</Checkbox>
          <Checkbox className="option" inline>排他</Checkbox>
          <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={this.handleClickAddButton.bind(this, index)}/>
          <Glyphicon className="clickable icon-button text-danger" glyph="minus-sign" onClick={this.handleClickMinusButton.bind(this, index)}/>
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
  state: state
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(ChoiceEditor);
