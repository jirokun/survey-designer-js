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
  handleChangeQuestionChoices(e) {
    console.log(e);
    //this.props.changeQuestionChoices(e.target.value.split(/\n/));
  }
  renderChoiceEditorRow(choice) {
    const content = choice.label ? choice.label : choice;
    return (
      <div className="choice-editor-row">
        <div className="choice-editor-tinymce">
          <TinyMCE
            config={
              {
                menubar: '',
                toolbar: 'undo redo | styleselect forecolor backcolor removeformat | fullscreen',
                plugins: 'image link',
                inline: true,
                statusbar: false
              }
            }
            onKeyup={this.handleChangeQuestionChoices.bind(this)}
            onChange={this.handleChangeQuestionChoices.bind(this)}
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
      <div className="choice-editor">
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
