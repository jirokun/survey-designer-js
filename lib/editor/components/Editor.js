import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Codemirror from 'react-codemirror';
import CodemirrorYaml from 'codemirror/mode/yaml/yaml';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/erlang-dark.css';
import VisualEditor from './VisualEditor';
import javascript from 'codemirror/mode/javascript/javascript';
import yaml from 'js-yaml';
import * as EditorActions from '../actions';
import * as RuntimeActions from '../../runtime/actions';
import * as Utils from '../../utils';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'visual',
    };
  }
  setMode(mode) {
    this.setState({ mode });
  }
  render() {
    let code = '';
    let isYamlValid = false;
    const { state, page } = this.props;
    if (page) {
      const draft = Utils.findDraft(state, page.id);
      if (draft) {
        code = draft.yaml;
        isYamlValid = draft.valid;
      }
    }
    const codemirrorOptions = {
      lineNumbers: true,
      mode: 'yaml',
    };

    const codeMirrorStyle = {
      height: '100%',
      display: mode == 'advanced' ? '' : 'none',
    };

    const mode = this.state.mode;
    const editor = (mode == 'advanced' ?
      <Codemirror ref="codemirror" style={codeMirrorStyle} value={code} onChange={this.props.changeCodemirror} options={codemirrorOptions} /> :
      <VisualEditor />);

    const buttonClassBase = 'btn btn-default btn-sm ';
    return (
      <div ref="top" className="hot-pane">
        <div className="editor-controller btn-group">
          <button className={buttonClassBase + (mode == 'visual' ? 'active' : '')} onClick={this.setMode.bind(this, 'visual')}>Visual Mode</button>
          <button className={buttonClassBase + (mode == 'advanced' ? 'active' : '')} onClick={this.setMode.bind(this, 'advanced')}>Advanced Mode</button>
        </div>
        {editor}
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Editor);
