import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions'
import Page from '../components/Page'
import { findPage, findFlow } from '../../utils'
import * as EnqueteActions from '../actions'

class EnqueteRuntimeApp extends Component {
  render() {
    const { state, currentFlowId } = this.props;
    const currentFlow = findFlow(state, currentFlowId);
    if (!currentFlow) {
      return <div>undefined flow</div>;
    }
    const currentPage = findPage(state, currentFlow.refId);
    if (!currentPage) {
      return <div>undefined page</div>;
    }
    return (
      <div>
        <Page page={currentPage}/>
      </div>
    )
  }
}

EnqueteRuntimeApp.propTypes = {
}

const stateToProps = state => ({
  state: state,
  currentFlowId: state.values.currentFlowId
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(EnqueteRuntimeApp)
