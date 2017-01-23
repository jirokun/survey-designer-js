import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import * as Actions from '../../actions';

class BranchInGraph extends Component {
  handleBranchSelect() {
    const { selectFlow, flow } = this.props;
    selectFlow(flow.getId());
  }

  handleRemoveBranch(e) {
    const { removeFlow, flow } = this.props;
    e.stopPropagation();
    removeFlow(flow.getId());
  }

  render() {
    const { state, flow } = this.props;
    return (
      <div className="branch" onClick={() => this.handleBranchSelect()}>
        <div className="delete-button">
          <Glyphicon className="text-danger" glyph="minus-sign" onClick={(e) => this.handleRemoveBranch(e)}/>
        </div>
        <div className="title">
          <span>分岐</span>
        </div>
      </div>
    );
  }
}

BranchInGraph.propTypes = {
  state: PropTypes.object.isRequired,
};

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  selectFlow: flowId => dispatch(Actions.selectFlow(flowId)),
  removeFlow: flowId => dispatch(Actions.removeFlow(flowId)),
  addPageFlow: (x, y) => dispatch(Actions.addPageFlow(x, y)),
  addBranchFlow: (x, y) => dispatch(Actions.addBranchFlow(x, y)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BranchInGraph);
