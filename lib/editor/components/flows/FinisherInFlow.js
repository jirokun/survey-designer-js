import React from 'react';
import { connect } from 'react-redux';
import NodeInFlow from './NodeInFlow';

/** Flowの中に描画するFinisher */
function FinisherInFlow(props) {
  const { survey, node } = props;
  const nodeLabel = survey.calcNodeLabel(node.getId());
  return <NodeInFlow node={node} nodeLabel={nodeLabel} />;
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});

export default connect(
  stateToProps,
)(FinisherInFlow);
