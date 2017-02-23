import React from 'react';
import { connect } from 'react-redux';
import NodeInGraph from './NodeInGraph';

/** Graphの中に描画するFinisher */
function FinisherInGraph(props) {
  const { state, node } = props;
  const nodeLabel = state.calcNodeLabel(node.getId());
  return <NodeInGraph node={node} nodeLabel={nodeLabel} />;
}

const stateToProps = state => ({
  state,
});

export default connect(
  stateToProps,
)(FinisherInGraph);
