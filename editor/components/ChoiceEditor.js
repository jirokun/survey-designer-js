import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

class ChoiceEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    // choicesが増減した時だけupdateする
    return nextProps.choices.length !== this.props.choices.length;
  }
  getTinyMCEEditorFromEl(el) {
    return tinymce.editors.find(editor => document.getElementById(editor.id) === el);
  }
  handleChangeQuestionChoices(choiceIndex, e) {
    const _this = this;
    const editorEls = this.refs.root.querySelectorAll('.choice-editor-tinymce');
    const values = Array.prototype.map.call(this.refs.root.querySelectorAll('.choice-editor-tinymce'), el => {
      return _this.getTinyMCEEditorFromEl(el).getContent();
    });
    this.props.changeQuestionChoices(values);
  }
  renderChoiceEditorRow(choice, index) {
    const content = choice.label ? choice.label : choice;
    return (
      <div className="choice-editor-row">
        <div className="choice-editor-tinymce-container">
          <TinyMCE className="choice-editor-tinymce"
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
          />
        </div>
        <div className="choice-editor-controller">
          <button><i className="glyphicon glyphicon-plus"></i></button>
          <button><i className="glyphicon glyphicon-minus"></i></button>
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
  changeQuestionChoices: value => dispatch(EditorActions.changeQuestionChoices(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(ChoiceEditor);
