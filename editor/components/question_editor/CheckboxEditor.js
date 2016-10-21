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

  static getDefaultDefinition() {
    return {
      title: '複数選択肢',
      type: 'checkbox',
      choices: [
        '選択肢1',
        '選択肢2'
      ]
    };
  }

  handleChangeQuestionTitle(e, editor) {
    const { page, question } = this.props;
    this.props.changeQuestionTitle(page.id, question.id, editor.getContent());
  }
  handleChangeQuestionBeforeNote(e, editor) {
    const { page, question } = this.props;
    this.props.changeQuestionBeforeNote(page.id, question.id, editor.getContent());
  }
  handleChangeQuestionAfterNote(e, editor) {
    const { page, question } = this.props;
    this.props.changeQuestionAfterNote(page.id, question.id, editor.getContent());
  }

  render() {
    const { page, question, plainText } = this.props;

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
            <ChoiceEditor page={page} question={question} choices={question.choices} plainText={plainText}/>
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
  changeQuestionTitle: (pageId, questionId, value) => dispatch(EditorActions.changeQuestionTitle(pageId, questionId, value)),
  changeQuestionBeforeNote: (pageId, questionId, value) => dispatch(EditorActions.changeQuestionBeforeNote(pageId, questionId, value)),
  changeQuestionAfterNote: (pageId, questionId, value) => dispatch(EditorActions.changeQuestionAfterNote(pageId, questionId, value))
});

export default connect(
  stateToProps,
  actionsToProps
)(CheckboxEditor);
