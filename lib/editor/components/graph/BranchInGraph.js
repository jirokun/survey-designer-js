import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import * as Actions from '../../actions';

class BranchInGraph extends Component {
  handleBranchSelect() {
    const { selectNode, node } = this.props;
    selectNode(node.getId());
  }

  handleRemoveBranch() {
    const { removeNode, node } = this.props;
    removeNode(node.getId());
  }

  render() {
    return (
      <div className="branch" onClick={() => this.handleBranchSelect()}>
        <Glyphicon className="text-danger delete-button" glyph="minus-sign" onClick={() => this.handleRemoveBranch()}/>
        <span>分岐</span>
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
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
  removeNode: nodeId => dispatch(Actions.removeNode(nodeId)),
  addPageNode: (x, y) => dispatch(Actions.addPageNode(x, y)),
  addBranchNode: (x, y) => dispatch(Actions.addBranchNode(x, y)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BranchInGraph);
