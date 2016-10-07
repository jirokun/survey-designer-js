import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import CheckboxEditor from './question_editor/CheckboxEditor';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

class QuestionEditor extends Component {
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
  renderRadio() {
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
  findEditorComponent(name) {
    const { question } = this.props;
    switch (name) {
      case 'Radio':
        return <CheckboxEditor question={question}/>;
      case 'Checkbox':
        return <CheckboxEditor question={question}/>;
      default:
        throw 'undefined editor: ' + name;
    }
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
        {this.findEditorComponent(this.state.type)}
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
)(QuestionEditor);
