import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Graph extends Component {
  render() {
    const { state } = this.props;
    return (
      <div ref="graph">
      </div>
    );
  }
}

Graph.propTypes = {
};

const stateToProps = state => ({
  state,
  defs: state.defs,
});

const actionsToProps = dispatch => ({
  selectFlow: flowId => dispatch(selectFlow(flowId)),
  removeEdge: (sourceFlowId, targetFlowId) => dispatch(removeEdge(sourceFlowId, targetFlowId)),
  removeFlow: flowId => dispatch(removeFlow(flowId)),
  addPageFlow: (x, y) => dispatch(addPageFlow(x, y)),
  addBranchFlow: (x, y) => dispatch(addBranchFlow(x, y)),
  clonePage: (flowId, x, y) => dispatch(clonePage(flowId, x, y)),
  connectFlow: (sourceFlowId, targetFlowId) => dispatch(connectFlow(sourceFlowId, targetFlowId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Graph);

