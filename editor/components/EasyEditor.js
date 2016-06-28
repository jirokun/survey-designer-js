import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

class EasyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'Radio'
    };
  }
  setType() {
    const type = this.refs.typeSelect.value;
    this.setState({type});
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
  handleChangeQuestionChoices(e) {
    console.log(e);
    //this.props.changeQuestionChoices(e.target.value.split(/\n/));
  }
  renderRadio() {
    const { page } = this.props;
    const question = page.questions[0]; // シンプルエディタでは1ページ1質問に限定
    console.log(question);
    if (!question) {
      return;
    }
    const choices = question.choices.map(obj => obj.label ? obj.label : obj).join("\n");
    return (
      <div>
        <div className="form-group">
          <label className="col-sm-2 control-label">質問</label>
          <div className="col-sm-10">
            <TinyMCE ref="titleEditor"
              config={
                {
                  menubar: '',
                  toolbar: 'undo redo | styleselect forecolor backcolor removeformat | bullist numlist | alignleft aligncenter alignright | outdent indent fullscreen',
                  plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                  inline: true,
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
                  toolbar: 'undo redo | styleselect forecolor backcolor removeformat | bullist numlist | alignleft aligncenter alignright | outdent indent fullscreen',
                  plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                  inline: true,
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
          <label className="col-sm-2 control-label">補足2</label>
          <div className="col-sm-10">
            <TinyMCE ref="titleEditor"
              config={
                {
                  menubar: '',
                  toolbar: 'undo redo | styleselect forecolor backcolor removeformat | bullist numlist | alignleft aligncenter alignright | outdent indent fullscreen',
                  plugins: 'table contextmenu textcolor paste fullscreen lists image link',
                  inline: true,
                  statusbar: false
                }
              }
              onKeyup={this.handleChangeQuestionAfterNote.bind(this)}
              onChange={this.handleChangeQuestionAfterNote.bind(this)}
              content={question.beforeNote}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">選択肢</label>
          <div className="col-sm-10">
            <TinyMCE ref="titleEditor"
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
              content={question.beforeNote}
            />
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
      </div>
    );
  }
  renderCheckbox() {
    return (
      <div>
        <div className="form-group">
          <label className="col-sm-2 control-label">選択項目</label>
          <div className="col-sm-8">
            <textarea className="form-control"/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <div className="checkbox">
              <label>
                <input type="checkbox"/> 表示順をランダム
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
      </div>
    );
  }
  renderText() {
  }
  renderTextarea() {
  }
  render() {

    return (
      <div className="form-horizontal">
        <div className="form-group">
          <label className="col-sm-2 control-label">タイプ</label>
          <div className="col-sm-3">
            <select ref="typeSelect" className="form-control" value={this.state.type} onChange={this.setType.bind(this)}>
              <option value="Radio">単一選択</option>
              <option value="Checkbox">複数選択</option>
              <option value="Text">1行テキスト</option>
              <option value="Textarea">複数行テキスト</option>
            </select>
          </div>
        </div>
        {this['render' + this.state.type]()}
      </div>
    );
  }
}

const stateToProps = state => ({
  state: state
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
)(EasyEditor);
