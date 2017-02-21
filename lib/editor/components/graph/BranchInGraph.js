import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import { DragSource, DropTarget } from 'react-dnd';
import ConditionInGraph from './ConditionInGraph';
import * as Actions from '../../actions';
import { DND_NODE } from '../../../constants';

class BranchInGraphOrig extends Component {
  handleBranchSelect() {
    const { selectNode, node } = this.props;
    selectNode(node.getId());
  }

  handleAddCondition(index) {
    const { state, node, addCondition } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    addCondition(branch.getId(), index);
  }

  handleRemoveCondition(conditionId) {
    const { state, node, removeCondition } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    removeCondition(branch.getId(), conditionId);
  }

  handleRemoveBranch(e) {
    const { removeNode, node } = this.props;
    e.stopPropagation();
    removeNode(node.getId());
  }

  createInsertElement(key, index) {
    return (
      <li key={key} className="insert-item-box">
        <div><i className="glyphicon glyphicon-plus-sign" onClick={() => this.handleAddCondition(index)} /></div>
      </li>
    );
  }

  render() {
    const { state, node } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    const conditions = branch.getConditions();
    const conditionEls = [];
    if (conditions.size === 0) {
      const sizeZeroKey = `${this.constructor.name}_${branch.getId()}__0}`;
      conditionEls.push(this.createInsertElement(`${sizeZeroKey}_insert_0`, 0));
    }
    conditions.forEach((condition, i) => {
      const key = `${this.constructor.name}-${condition.getId()}`;

      if (i === 0) {
        conditionEls.push(this.createInsertElement(`${key}_insert_${i}`, i));
      }
      conditionEls.push(<ConditionInGraph key={key} node={node} branch={branch} condition={condition} />);
      conditionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });

    let elseLabel;
    try {
      const page = state.findPageFromNode(node.getNextNodeId());
      elseLabel = state.calcPageLabel(page.getId());
    } catch (e) {
      elseLabel = '未設定';
    }
    const { connectDragPreview, connectDragSource, connectDropTarget } = this.props;
    return connectDragPreview(connectDropTarget(
      <div className="branch" onClick={() => this.handleBranchSelect()}>
        {connectDragSource(<i className="fa fa-bars drag-handler" />)}
        &nbsp;
        <span>分岐</span>
        <div className="item-controller">
          <i className="fa fa-trash text-danger delete-button" onClick={e => this.handleRemoveBranch(e)} />
        </div>
        <ul className="conditions">
          {conditionEls}
          <li className="condition">
            <i
              className="fa fa-bars drag-handler"
              style={{ visibility: 'hidden' }}
            />
            &nbsp;
            上記条件以外は{elseLabel}に遷移</li>
        </ul>
      </div>,
    ));
  }
}

const conditionSource = {
  beginDrag(props) {
    return {
      nodeId: props.node.getId(),
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
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
  removeNode: nodeId => dispatch(Actions.removeNode(nodeId)),
  addCondition: (branchId, index) => dispatch(Actions.addCondition(branchId, index)),
  removeCondition: (branchId, conditionId) => dispatch(Actions.removeCondition(branchId, conditionId)),
  swapNode: (srcNodeId, destNodeId) => dispatch(Actions.swapNode(srcNodeId, destNodeId)),
});

const DropTargetBranchInGraph = DropTarget(
  DND_NODE,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(BranchInGraphOrig);
const DragSourceBranchInGraph = DragSource(
  DND_NODE,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DropTargetBranchInGraph);
const BranchInGraph = connect(stateToProps, actionsToProps)(DragSourceBranchInGraph);
export default connect(
  stateToProps,
  actionsToProps,
)(BranchInGraph);
