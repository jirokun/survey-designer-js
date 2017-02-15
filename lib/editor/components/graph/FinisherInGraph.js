import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { Glyphicon } from 'react-bootstrap';
import { conditionTarget, conditionSource } from './DndFunctions';
import { DND_NODE } from '../../../constants';
import * as Actions from '../../actions';

class FinisherInGraphOrig extends Component {
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
    const { connectDragPreview, connectDragSource, connectDropTarget } = this.props;
    return connectDragPreview(connectDropTarget(
      <div className="finisher" onClick={() => this.onFinisherSelect(node)}>
        {connectDragSource(<i className="fa fa-bars drag-handler" />)}
        &nbsp;
        終了 {finisherNo} {finisher.getFinishType()} {finisher.getPoint()}pt
        <div className="item-controller">
          <i className="fa fa-trash text-danger delete-button" onClick={e => this.handleRemoveFinisher(e)} />
        </div>
      </div>,
    ));
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
  swapNode: (srcNodeId, destNodeId) => dispatch(Actions.swapNode(srcNodeId, destNodeId)),
});

const DropTargetFinisherInGraph = DropTarget(
  DND_NODE,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(FinisherInGraphOrig);
const DragSourceFinisherInGraph = DragSource(
  DND_NODE,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DropTargetFinisherInGraph);
const FinisherInGraph = connect(stateToProps, actionsToProps)(DragSourceFinisherInGraph);
export default connect(
  stateToProps,
  actionsToProps,
)(FinisherInGraph);
