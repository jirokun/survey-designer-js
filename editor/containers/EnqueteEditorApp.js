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
    this.resizeHotPane();
    this.resizeGraphPane();
  }
  resizeGraphPane(e) {
    const { actions } = this.props;
    const width = this.refs.left.getBoundingClientRect().width;
    actions.resizeGraphPane(width);
  }
  resizeHotPane(e) {
    // 一瞬おいてからじゃないとうまくいかない
    setTimeout(() => {
      const { actions } = this.props;
      const height = this.refs.top.getBoundingClientRect().height - this.refs.nav.getBoundingClientRect().height;
      actions.resizeHotPane(height);
      this.resizePreviewPane();
    }, 1);
  }
  resizePreviewPane() {
    const previewHeight = this.refs.preview.parentNode.getBoundingClientRect().height;
    this.refs.preview.style.height = previewHeight + 'px';
  }
  renderTab() {
    const tab = this.state.tab;
    const { state, actions } = this.props;
    switch (tab) {
      case 'Flows':
        return <FlowsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'Conditions':
        return <ConditionsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'Pages':
        return <PagesHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'Questions':
        return <QuestionsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'Items':
        return <ItemsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'Choices':
        return <ChoicesHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'CustomPage':
        return <CustomPageTab state={state} onDefsChange={actions.changeDefs}/>
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
                  ['Flows', 'Conditions', 'Pages', 'Questions', 'Items', 'Choices', 'CustomPage'].map((tabName) => {
                    return <li key={'tab-' + tabName} className={_this.state.tab === tabName ? 'active' : ''}><a onClick={() => _this.showTab(tabName)}>{tabName}</a></li>
                  })
                }
              </ul>
              <div className="tab-content">
                { this.renderTab() }
              </div>
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
