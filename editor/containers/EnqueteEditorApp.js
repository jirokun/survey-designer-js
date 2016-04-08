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
    this.resizeEditorPane();
    this.resizeGraphPane();
  }
  resizeGraphPane(e) {
    const { resizeGraphPane } = this.props;
    const width = this.refs.left.getBoundingClientRect().width;
    resizeGraphPane(width);
  }
  resizeEditorPane(e) {
    // 一瞬おいてからじゃないとうまくいかない
    const { resizeEditorPane } = this.props;
    const height = this.refs.top.getBoundingClientRect().height;
    resizeEditorPane(height);
    this.resizePreviewPane();
  }
  resizePreviewPane() {
    const previewHeight = this.refs.preview.parentNode.getBoundingClientRect().height;
    this.refs.preview.style.height = previewHeight + 'px';
  }
  render() {
    const _this = this;
    const { state, actions } = this.props;
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    const draft = Utils.findDraft(state, page.id);
    const code = draft.yaml;
    const codemirrorOptions = {
      lineNumbers: true,
      mode: 'yaml'
    };
    // TODO SplitPaneをiframeに対応する
    return (
      <SplitPane split="vertical" minSize="100" defaultSize="400" onDragFinished={this.resizeGraphPane.bind(this)}>
        <div className="left" ref="left">
          <Graph actions={actions} />
        </div>
        <div className="right" ref="right">
          <SplitPane split="horizontal" minSize="100" defaultSize="400" onDragFinished={this.resizeEditorPane.bind(this)}>
            <div ref="top" className="hot-pane">
              <Codemirror ref="codemirror" value={code} onChange={this.props.changeCodemirror} options={codemirrorOptions} />
            </div>
            <div ref="preview" className="preview-pane">
              <Frame head={
                <link rel="stylesheet" href="/css/runtime.css"/>
              }>
                <EnqueteRuntimeApp />
              </Frame>
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
)(EnqueteEditorApp)
