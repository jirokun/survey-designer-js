import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SplitPane from 'react-split-pane'
import Frame from 'react-frame-component'
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp'
import CustomPageTab from '../components/CustomPageTab'
import Graph from '../components/Graph'
import Codemirror from 'react-codemirror'
import CodemirrorYaml from 'codemirror/mode/yaml/yaml'
import javascript from 'codemirror/mode/javascript/javascript'
import yaml from 'js-yaml'
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/erlang-dark.css'

export default class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    };
  }
  componentDidMount() {
    this.resizeGraphPane();
  }
  resizeGraphPane(e) {
    const { resizeGraphPane } = this.props;
    const width = this.refs.left.getBoundingClientRect().width;
    resizeGraphPane(width);
    this.onDragEnd();
  }
  onDragStarted() {
    this.overlay = document.createElement('div');
    this.overlay.style.width = window.innerWidth + 'px';
    this.overlay.style.height = window.innerHeight + 'px';
    this.overlay.style.position = 'absolute';
    this.overlay.style.top = '0px';
    this.overlay.style.left = '0px';
    document.body.appendChild(this.overlay);
  }
  onDragEnd() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      delete this.overlay;
    }
  }
  render() {
    const _this = this;
    const { state, actions } = this.props;
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    let code = '';
    let isYamlValid = false;
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
    const splitPaneSize = {
      minSize: 100,
      defaultSize: 400
    };
    const codeMirrorStyle = {
      height: '100%'
    }
    // TODO SplitPaneをiframeに対応する
    return (
      <SplitPane ref="root" split="vertical" {...splitPaneSize} onDragFinished={this.resizeGraphPane.bind(this)} onDragStarted={this.onDragStarted.bind(this)}>
        <div className="left" ref="left">
          <Graph actions={actions} />
        </div>
        <div className="right" ref="right">
          <SplitPane split="horizontal" {...splitPaneSize} onDragFinished={this.onDragEnd.bind(this)} onDragStarted={this.onDragStarted.bind(this)}>
            <div ref="top" className="hot-pane">
              <Codemirror ref="codemirror" style={codeMirrorStyle} value={code} onChange={this.props.changeCodemirror} options={codemirrorOptions} />
            </div>
            <div ref="preview" className="preview-pane">
              <Frame className={isYamlValid ? "" : "hidden"} head={
                <link rel="stylesheet" href="/css/runtime.css"/>
              }>
                <EnqueteRuntimeApp />
              </Frame>
              <div className={isYamlValid ? "hidden" : "alert alert-danger error"}>
                <span className="glyphicon glyphicon-exclamation-sign"></span>
                <span className="sr-only">Error:</span>
                データが正しくありません
              </div>
            </div>
          </SplitPane>
        </div>
      </SplitPane>
    )
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  resizeGraphPane: width => dispatch(EditorActions.resizeGraphPane(width)),
  resizeEditorPane: height => dispatch(EditorActions.resizeEditorPane(height)),
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(EnqueteEditorApp);
