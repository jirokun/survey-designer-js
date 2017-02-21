import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import * as Actions from '../../actions';
import { DND_CONDITION } from '../../../constants';

class ConditionInGraphOrig extends Component {
  handleRemoveCondition(conditionId) {
    const { state, removeCondition, node } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    removeCondition(branch.getId(), conditionId);
  }

  render() {
    const { state, condition, connectDragPreview, connectDragSource, connectDropTarget } = this.props;
    const nodeLabel = state.calcNodeLabel(condition.getNextNodeId());

    return connectDragPreview(connectDropTarget(
      <li className="condition">
        {connectDragSource(<i className="fa fa-bars drag-handler" />)}
        &nbsp;
        条件によって{nodeLabel} に遷移
        <div className="item-controller">
          <i
            className="fa fa-trash text-danger delete-button"
            onClick={() => this.handleRemoveCondition(condition.getId())}
          />
        </div>
      </li>,
    ));
  }
}

const conditionSource = {
  beginDrag(props) {
    return {
      nodeId: props.node.getId(),
      branchId: props.branch.getId(),
      conditionId: props.condition.getId(),
    };
  },
};

const conditionTarget = {
  hover(props, monitor, component) {
    const { state, node, branch, condition } = props;
    const dragNodeId = monitor.getItem().nodeId;
    const dragBranchId = monitor.getItem().branchId;
    const dragConditionId = monitor.getItem().conditionId;
    const hoverNodeId = node.getId();
    const hoverBranchId = branch.getId();
    const hoverConditionId = condition.getId();

    // 自分自身の場合には何もしない
    if (dragConditionId === hoverConditionId) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    const dragConditionIndex = state.findConditionIndex(dragBranchId, dragConditionId);
    const hoverConditionIndex = state.findConditionIndex(hoverBranchId, hoverConditionId);

    // 異なるnodeでは移動不可
    if (dragNodeId !== hoverNodeId) return;

    // Dragging downwards
    if (dragConditionIndex < hoverConditionIndex && hoverClientY < hoverMiddleY) return;

    // Dragging upwards
    if (dragConditionIndex > hoverConditionIndex && hoverClientY > hoverMiddleY) return;

    // Time to actually perform the action
    props.swapCondition(dragNodeId, dragConditionId, hoverConditionId);
  },
};

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  removeCondition: (branchId, conditionId) => dispatch(Actions.removeCondition(branchId, conditionId)),
  swapCondition: (nodeId, srcConditionId, destConditionId) =>
    dispatch(Actions.swapCondition(nodeId, srcConditionId, destConditionId)),
});

const DropTargetConditionInGraph = DropTarget(
  DND_CONDITION,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(ConditionInGraphOrig);
const DragSourceConditionInGraph = DragSource(
  DND_CONDITION,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DropTargetConditionInGraph);
const ConditionInGraph = connect(stateToProps, actionsToProps)(DragSourceConditionInGraph);
export default ConditionInGraph;
