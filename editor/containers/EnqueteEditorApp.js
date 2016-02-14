import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SplitPane from 'react-split-pane'
import PagesHotEditorTab from '../components/PagesHotEditorTab'
import FlowsHotEditorTab from '../components/FlowsHotEditorTab'
import ConditionsHotEditorTab from '../components/ConditionsHotEditorTab'
import QuestionsHotEditorTab from '../components/QuestionsHotEditorTab'
import ItemsHotEditorTab from '../components/ItemsHotEditorTab'
import ChoicesHotEditorTab from '../components/ChoicesHotEditorTab'
import Graph from '../components/Graph'
import * as EnqueteActions from '../actions'

export default class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {tab: 'FlowsTab'};
  }
  componentDidMount() {
    const previewWindow = this.refs.previewWindow;
    const { state, actions } = this.props;
    previewWindow.addEventListener('load', (e) => {
      actions.initializeDefs(state.defs, previewWindow);
    }, false);
    // hotHeightを調整しておく
    const height = this.props.state.viewSettings.hotHeight - this.refs.nav.getBoundingClientRect().height;
    actions.resizeHotPane(height);
  }
  resizeGraphPane(e) {
    const { actions } = this.props;
    const width = this.refs.left.getBoundingClientRect().width;
    actions.resizeGraphPane(width);
  }
  resizeHotPane(e) {
    const { actions } = this.props;
    const height = this.refs.top.getBoundingClientRect().height - this.refs.nav.getBoundingClientRect().height;
    actions.resizeHotPane(height);
  }
  getPreviewWindow() {
    return this.refs.previewWindow;
  }
  renderTab() {
    const tab = this.state.tab;
    const { state, actions } = this.props;
    switch (tab) {
      case 'FlowsTab':
        return <FlowsHotEditorTab state={state} getPreviewWindow={this.getPreviewWindow.bind(this)} onDefsChange={actions.changeDefs}/>
      case 'ConditionsTab':
        return <ConditionsHotEditorTab state={state} getPreviewWindow={this.getPreviewWindow.bind(this)} onDefsChange={actions.changeDefs}/>
      case 'PagesTab':
        return <PagesHotEditorTab state={state} getPreviewWindow={this.getPreviewWindow.bind(this)} onDefsChange={actions.changeDefs}/>
      case 'QuestionsTab':
        return <QuestionsHotEditorTab state={state} getPreviewWindow={this.getPreviewWindow.bind(this)} onDefsChange={actions.changeDefs}/>
      case 'ItemsTab':
        return <ItemsHotEditorTab state={state} getPreviewWindow={this.getPreviewWindow.bind(this)} onDefsChange={actions.changeDefs}/>
      case 'ChoicesTab':
        return <ChoicesHotEditorTab state={state} getPreviewWindow={this.getPreviewWindow.bind(this)} onDefsChange={actions.changeDefs}/>
      default:
        throw 'undfined tab: ' + tab;
    }
  }
  showTab(tabName) {
    this.setState({tab: tabName});
  }
  render() {
    const _this = this;
    const { state, actions } = this.props;
    // TODO SplitPaneをiframeに対応する
    return (
      <SplitPane split="vertical" minSize="100" defaultSize="400" onDragFinished={this.resizeGraphPane.bind(this)}>
        <div className="left" ref="left">
          <Graph state={state} getPreviewWindow={this.getPreviewWindow.bind(this)} actions={actions} />
        </div>
        <div className="right" ref="right">
          <SplitPane split="horizontal" minSize="100" defaultSize="400" onDragFinished={this.resizeHotPane.bind(this)}>
            <div ref="top" className="hot-pane">
              <ul ref="nav"className="nav nav-tabs">
                {
                  ['FlowsTab', 'ConditionsTab', 'PagesTab', 'QuestionsTab', 'ItemsTab', 'ChoicesTab'].map((tabName) => {
                    return <li className={_this.state.tab === tabName ? 'active' : ''}><a onClick={() => _this.showTab(tabName)}>{tabName}</a></li>
                  })
                }
              </ul>
              <div className="tab-content">
                { this.renderTab() }
              </div>
            </div>
            <div className="preview-pane">
              <iframe ref="previewWindow" src="runtime.html"></iframe>
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
  return {
    actions: bindActionCreators(EnqueteActions, dispatch)
  }
}

export default connect(
  select,
  mapDispatchToProps
)(EnqueteEditorApp)
