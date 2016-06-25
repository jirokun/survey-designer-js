import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Codemirror from 'react-codemirror'
import CodemirrorYaml from 'codemirror/mode/yaml/yaml'
import javascript from 'codemirror/mode/javascript/javascript'
import yaml from 'js-yaml'
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/erlang-dark.css'

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'advanced'
    };
  }
  setMode(mode) {
    this.setState({mode});
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
    const codemirrorOptions = {
      lineNumbers: true,
      mode: 'yaml'
    };

    const codeMirrorStyle = {
      height: '100%'
    }
    const mode = this.state.mode;
    const buttonClassBase = 'btn btn-default btn-sm ';
    return (
      <div ref="top" className="hot-pane">
        <div className="editor-controller btn-group">
          <button className={buttonClassBase + (mode == 'easy' ? 'active' : '')} onClick={this.setMode.bind(this, 'easy')}>簡易モード</button>
          <button className={buttonClassBase + (mode == 'advanced' ? 'active' : '')} onClick={this.setMode.bind(this, 'advanced')}>アドバンスドモード</button>
        </div>
        <Codemirror ref="codemirror" style={codeMirrorStyle} value={code} onChange={this.props.changeCodemirror} options={codemirrorOptions} />
      </div>
    );
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(Editor);
