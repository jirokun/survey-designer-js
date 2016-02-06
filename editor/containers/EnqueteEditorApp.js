import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PagesTab from '../components/PagesTab'
import FlowsTab from '../components/FlowsTab'

export default class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {tab: 'FlowsTab'};
  }
  renderTab() {
    const tab = this.state.tab;
    const { state } = this.props;
    switch (tab) {
      case 'FlowsTab':
        return <FlowsTab state={state}/>
      case 'PagesTab':
        return <PagesTab state={state}/>
      default:
        throw 'undfined tab: ' + tab;
    }
  }
  showTab(tabName) {
    this.setState({tab: tabName});
  }
  render() {
    const _this = this;
    return (
      <div>
        <div className="left" ref="left">cytoscape.jsを動かす</div>
        <div className="right" ref="right">
          <ul className="nav nav-tabs">
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
      </div>
    )
  }
}
function select(state) {
  return {state};
}

export default connect(
  select
)(EnqueteEditorApp)
