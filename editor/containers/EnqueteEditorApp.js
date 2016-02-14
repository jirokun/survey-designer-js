import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SplitPane from 'react-split-pane'
import Frame from 'react-frame-component'
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp'
import PagesHotEditorTab from '../components/PagesHotEditorTab'
import FlowsHotEditorTab from '../components/FlowsHotEditorTab'
import ConditionsHotEditorTab from '../components/ConditionsHotEditorTab'
import QuestionsHotEditorTab from '../components/QuestionsHotEditorTab'
import ItemsHotEditorTab from '../components/ItemsHotEditorTab'
import ChoicesHotEditorTab from '../components/ChoicesHotEditorTab'
import Graph from '../components/Graph'
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'

export default class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {tab: 'FlowsTab'};
  }
  componentDidMount() {
    const { state, actions } = this.props;
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
    // previewPaneも更新する
    const previewHeight = this.refs.preview.parentNode.getBoundingClientRect().height;
    this.refs.preview.style.height = previewHeight + 'px';
  }
  renderTab() {
    const tab = this.state.tab;
    const { state, actions } = this.props;
    switch (tab) {
      case 'FlowsTab':
        return <FlowsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'ConditionsTab':
        return <ConditionsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'PagesTab':
        return <PagesHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'QuestionsTab':
        return <QuestionsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'ItemsTab':
        return <ItemsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'ChoicesTab':
        return <ChoicesHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
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
          <Graph state={state} actions={actions} />
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
            <div ref="preview" className="preview-pane">
              <Frame>
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
  console.log(MergedActions);
  return {
    actions: bindActionCreators(MergedActions, dispatch)
  }
}

export default connect(
  select,
  mapDispatchToProps
)(EnqueteEditorApp)
