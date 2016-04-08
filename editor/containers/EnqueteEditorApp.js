import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SplitPane from 'react-split-pane'
import Frame from 'react-frame-component'
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp'
import CustomPageTab from '../components/CustomPageTab'
import Graph from '../components/Graph'
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'

export default class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {tab: 'Flows'};
  }
  componentDidMount() {
    this.resizeEditorPane();
    this.resizeGraphPane();
  }
  resizeGraphPane(e) {
    const { actions } = this.props;
    const width = this.refs.left.getBoundingClientRect().width;
    actions.resizeGraphPane(width);
  }
  resizeEditorPane(e) {
    // 一瞬おいてからじゃないとうまくいかない
    const { actions } = this.props;
    const height = this.refs.top.getBoundingClientRect().height;
    actions.resizeEditorPane(height);
    this.resizePreviewPane();
  }
  resizePreviewPane() {
    const previewHeight = this.refs.preview.parentNode.getBoundingClientRect().height;
    this.refs.preview.style.height = previewHeight + 'px';
  }
  render() {
    const _this = this;
    const { state, actions } = this.props;
    // TODO SplitPaneをiframeに対応する
    return (
      <SplitPane split="vertical" minSize="100" defaultSize="400" onDragFinished={this.resizeGraphPane.bind(this)}>
        <div className="left" ref="left">
          <Graph actions={actions} />
        </div>
        <div className="right" ref="right">
          <SplitPane split="horizontal" minSize="100" defaultSize="400" onDragFinished={this.resizeEditorPane.bind(this)}>
            <div ref="top" className="hot-pane">
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
function select(state) {
  return {state};
}

function mapDispatchToProps(dispatch) {
  var MergedActions = Object.assign({}, RuntimeActions, EditorActions);
  return {
    actions: bindActionCreators(MergedActions, dispatch)
  }
}

export default connect(
  select,
  mapDispatchToProps
)(EnqueteEditorApp)
