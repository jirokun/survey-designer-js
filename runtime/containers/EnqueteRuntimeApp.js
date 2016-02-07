import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions'
import Page from '../components/Page'
import { findPage, findFlow } from '../../utils'
import * as EnqueteActions from '../actions'

class EnqueteRuntuimeApp extends Component {
  componentDidMount() {
    // iframe用の処理
    if (window) {
      window.addEventListener('message', this.changeDefs.bind(this), false);
    }
  }
  changeDefs(e) {
    const { state, actions } = this.props;
    const { defsName, defs } = JSON.parse(e.data);
    actions.changeDefs(defsName, defs);
  }
  render() {
    const { state, actions } = this.props;
    const currentFlow = findFlow(state, state.values.currentFlowId);
    const currentPage = findPage(state, currentFlow.pageId);
    return (
      <div>
        <Page page={currentPage} state={state} actions={actions}/>
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
