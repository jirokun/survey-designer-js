import React, { Component } from 'react';
import { connect } from 'react-redux';
import NodeInGraph from './NodeInGraph';

class FinisherInGraph extends Component {
  render() {
    const { state, node } = this.props;
    const nodeLabel = state.calcNodeLabel(node.getId());
    return <NodeInGraph node={node} nodeLabel={nodeLabel} />;
  }
}

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps,
)(FinisherInGraph);
