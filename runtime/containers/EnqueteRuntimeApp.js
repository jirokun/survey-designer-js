import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions'
import Page from '../components/Page'
import { findPage, findFlow } from '../../utils'
import * as EnqueteActions from '../actions'

class EnqueteRuntuimeApp extends Component {
  render() {
    const { state, actions } = this.props;
    var currentFlow = findFlow(state, state.values.currentFlowId);
    var currentPage = findPage(state, currentFlow.pageId);
    var { pageTitle, questionIds } = currentPage;
    return (
      <div>
        <Page pageTitle={pageTitle} questionIds={questionIds} state={state} actions={actions}/>
      </div>
    )
  }
}

EnqueteRuntuimeApp.propTypes = {
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
)(EnqueteRuntuimeApp)
