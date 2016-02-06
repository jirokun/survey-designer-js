import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PagesHotEditorTab from '../components/PagesHotEditorTab'
import FlowsHotEditorTab from '../components/FlowsHotEditorTab'
import * as EnqueteActions from '../actions'

export default class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {tab: 'FlowsTab'};
  }
  renderTab() {
    const tab = this.state.tab;
    const { state, actions } = this.props;
    switch (tab) {
      case 'FlowsTab':
        return <FlowsHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
      case 'PagesTab':
        return <PagesHotEditorTab state={state} onDefsChange={actions.changeDefs}/>
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
    return (
      <div>
        <div className="left" ref="left">cytoscape.jsを動かす</div>
        <div className="right" ref="right">
          <ul className="nav nav-tabs">
            {
              ['FlowsTab', 'ConditionsTab', 'PagesTab', 'QuestionsTab', 'ItemsTab', 'ChoicesTab'].map((tabName) => {
                return <li className={state.tab === tabName ? 'active' : ''}><a onClick={() => _this.showTab(tabName)}>{tabName}</a></li>
              })
            }
          </ul>
          <div className="tab-content">
            { this.renderTab() }
          </div>
        </div>
      </div>
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
