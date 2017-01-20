import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions';
import Page from '../components/Page';
import * as EnqueteActions from '../actions';

class EnqueteRuntimeApp extends Component {
  render() {
    const { state } = this.props;
    const currentPage = state.findCurrentPage();
    if (!currentPage) {
      return <div>undefined page</div>;
    }
    return (
      <div>
        <Page page={currentPage} />
      </div>
    );
  }
}

EnqueteRuntimeApp.propTypes = {
};

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnqueteRuntimeApp);
