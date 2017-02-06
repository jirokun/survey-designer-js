import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import * as Actions from '../../actions';

class BranchInGraph extends Component {
  handleBranchSelect() {
    const { selectNode, flow } = this.props;
    selectNode(flow.getId());
  }

  handleRemoveBranch(e) {
    const { removeNode, flow } = this.props;
    e.stopPropagation();
    removeNode(flow.getId());
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
  selectNode: flowId => dispatch(Actions.selectNode(flowId)),
  removeNode: flowId => dispatch(Actions.removeNode(flowId)),
  addPageNode: (x, y) => dispatch(Actions.addPageNode(x, y)),
  addBranchNode: (x, y) => dispatch(Actions.addBranchNode(x, y)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BranchInGraph);
