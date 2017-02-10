import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import * as Actions from '../../actions';

class FinisherInGraph extends Component {
  onFinisherSelect(node) {
    const { selectNode } = this.props;
    selectNode(node.getId());
  }

  handleRemoveFinisher(e) {
    const { removeNode, node } = this.props;
    e.stopPropagation();
    removeNode(node.getId());
  }

  render() {
    const { state, node } = this.props;
    const finisher = state.findFinisherFromNode(node.getId());
    const finisherNo = state.calcFinisherNo(finisher.getId());
    return (
      <div className="finisher" onClick={() => this.onFinisherSelect(node)}>
        <Glyphicon className="text-danger delete-button" glyph="remove-sign" onClick={e => this.handleRemoveFinisher(e)} />
        終了 {finisherNo} {finisher.getFinishType()}
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
  removeNode: nodeId => dispatch(Actions.removeNode(nodeId)),
  removeQuestion: (pageId, questionId) => dispatch(Actions.removeQuestion(pageId, questionId)),
  addPageNode: (x, y) => dispatch(Actions.addPageNode(x, y)),
  addBranchNode: (x, y) => dispatch(Actions.addBranchNode(x, y)),
  addQuestion: (questionClassName, pageId, index) => dispatch(Actions.addQuestion(questionClassName, pageId, index)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(FinisherInGraph);
