import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions'
import Page from '../components/Page'
import { findPage } from '../utils'

class App extends Component {
  render() {
    const { dispatch, pageTitle, questions } = this.props;
    return (
      <div>
        <Page pageTitle={pageTitle} questions={questions}/>
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired
}

function select(state) {
  return findPage(state, state.currentPage);
}


export default connect(select)(App)
