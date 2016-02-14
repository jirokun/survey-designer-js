import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions'
import Page from '../components/Page'
import { findPage, findFlow } from '../../utils'
import * as EnqueteActions from '../actions'

class EnqueteRuntimeApp extends Component {
  render() {
    const { state, actions } = this.props;
    const currentFlow = findFlow(state, state.values.currentFlowId);
    if (!currentFlow) {
      return <div>undefined flow</div>;
    }
    const currentPage = findPage(state, currentFlow.pageId);
    if (!currentPage) {
      return <div>undefined page</div>;
    }
    return (
      <div>
        <Page page={currentPage} state={state} actions={actions}/>
      </div>
    )
  }
}

EnqueteRuntimeApp.propTypes = {
  state: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
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
)(EnqueteRuntimeApp)
