import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Codemirror from 'react-codemirror'
import CodemirrorYaml from 'codemirror/mode/yaml/yaml'
import javascript from 'codemirror/mode/javascript/javascript'
import yaml from 'js-yaml'
import * as EasyEditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/erlang-dark.css'

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
  renderRadio() {
    return (
      <div>
        <div className="form-group">
          <label className="col-sm-2 control-label">質問</label>
          <div className="col-sm-8">
            <textarea className="form-control"/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">補足</label>
          <div className="col-sm-8">
            <textarea className="form-control"/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">選択肢</label>
          <div className="col-sm-8">
            <textarea className="form-control"/>
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
    let code = '';
    let isYamlValid = false;
    const { state } = this.props;
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    if (page) {
      const draft = Utils.findDraft(state, page.id);
      if (draft) {
        code = draft.yaml;
        isYamlValid = draft.valid;
      }
    }
    let editor;
    
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
  changeCodemirror: value => dispatch(EasyEditorActions.changeCodemirror(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(EasyEditor);
