import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import ChoiceEditor from '../ChoiceEditor';
import * as EditorActions from '../../actions'
import * as RuntimeActions from '../../../runtime/actions'
import * as Utils from '../../../utils'

class CheckboxEditor extends Component {
  constructor(props) {
    super(props);
  }

  handleChangeQuestionTitle(e, editor) {
    this.props.changeQuestionTitle(editor.getContent());
  }
  handleChangeQuestionBeforeNote(e, editor) {
    this.props.changeQuestionBeforeNote(editor.getContent());
  }
  handleChangeQuestionAfterNote(e, editor) {
    this.props.changeQuestionAfterNote(editor.getContent());
  }

  render() {
    const { question, plainText } = this.props;

    return (
      <div>
        <div className="form-group">
          <label className="col-sm-2 control-label">質問</label>
          <div className="col-sm-10">
            <TinyMCE ref="titleEditor"
              config={
                {
                  menubar: '',
                  toolbar: 'styleselect fontselect fontsizeselect bullist numlist outdent indent blockquote removeformat link unlink image visualchars fullscreen table forecolor backcolor',
                  plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                  inline: false,
                  statusbar: false
                }
              }
              onKeyup={this.handleChangeQuestionTitle.bind(this)}
              onChange={this.handleChangeQuestionTitle.bind(this)}
              content={question.title}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">補足1</label>
          <div className="col-sm-10">
            <TinyMCE ref="titleEditor"
              config={
                {
                  menubar: '',
                  toolbar: 'styleselect fontselect fontsizeselect bullist numlist outdent indent blockquote removeformat link unlink image visualchars fullscreen table forecolor backcolor',
                  plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                  inline: false,
                  statusbar: false
                }
              }
              onKeyup={this.handleChangeQuestionBeforeNote.bind(this)}
              onChange={this.handleChangeQuestionBeforeNote.bind(this)}
              content={question.beforeNote}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">選択肢</label>
          <div className="col-sm-10">
            <ChoiceEditor choices={question.choices} plainText={plainText}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <div className="checkbox">
              <label>
                <input type="checkbox"/> 選択肢の表示順をランダム表示
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <div className="checkbox">
              <label>
                <input type="checkbox"/> 最後の選択肢は固定
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">補足2</label>
          <div className="col-sm-10">
            <TinyMCE ref="titleEditor"
              config={
                {
                  menubar: '',
                  toolbar: 'styleselect fontselect fontsizeselect bullist numlist outdent indent blockquote removeformat link unlink image visualchars fullscreen table forecolor backcolor',
                  plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                  inline: false,
                  statusbar: false
                }
              }
              onKeyup={this.handleChangeQuestionAfterNote.bind(this)}
              onChange={this.handleChangeQuestionAfterNote.bind(this)}
              content={question.beforeNote}
            />
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
});
const actionsToProps = dispatch => ({
  changeQuestionTitle: value => dispatch(EditorActions.changeQuestionTitle(value)),
  changeQuestionBeforeNote: value => dispatch(EditorActions.changeQuestionBeforeNote(value)),
  changeQuestionAfterNote: value => dispatch(EditorActions.changeQuestionAfterNote(value)),
  changeQuestionChoices: value => dispatch(EditorActions.changeQuestionChoices(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(CheckboxEditor);
