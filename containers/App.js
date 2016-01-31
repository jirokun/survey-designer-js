import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions'
import Page from '../components/Page'
import { findPage, findFlow } from '../utils'

class App extends Component {
  render() {
    const { dispatch, state } = this.props;
    var currentFlow = findFlow(state, state.currentFlowId);
    var currentPage = findPage(state, currentFlow.pageId);
    var { pageTitle, questions } = currentPage;
    return (
      <div>
        <Page pageTitle={pageTitle} questions={questions} state={state}/>
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired
}

function select(state) {
  return {state};
}

export default connect(select)(App)
