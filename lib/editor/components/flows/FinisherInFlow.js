import React from 'react';
import { connect } from 'react-redux';
import NodeInFlow from './NodeInFlow';

/** Flowの中に描画するFinisher */
function FinisherInFlow(props) {
  const { state, node } = props;
  const nodeLabel = state.calcNodeLabel(node.getId());
  return <NodeInFlow node={node} nodeLabel={nodeLabel} />;
}

const stateToProps = state => ({
  state,
});

export default connect(
  stateToProps,
)(FinisherInFlow);
