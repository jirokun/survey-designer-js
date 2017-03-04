import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import * as Actions from '../../actions';
import { DND_CONDITION } from '../../../constants/dnd';

/** 分岐の中に描画する1遷移分 */
class ConditionInGraphOrig extends Component {
  /** 条件を削除したときに呼ばれる処理 */
  handleRemoveCondition(conditionId) {
    const { state, removeCondition, node } = this.props;
    const branch = state.findBranchFromNode(node.getId());
    removeCondition(branch.getId(), conditionId);
  }

  /** 描画 */
  render() {
    const { state, condition, connectDragPreview, connectDragSource, connectDropTarget, dragging } = this.props;
    const nodeLabel = state.calcNodeLabel(condition.getNextNodeId());
    return connectDragPreview(connectDropTarget(
      <li className={classNames('condition', { invisible: dragging })}>
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

/** dndの設定に必要なオブジェクト */
const conditionSource = {
  beginDrag(props) {
    return {
      nodeId: props.node.getId(),
      branchId: props.branch.getId(),
      conditionId: props.condition.getId(),
    };
  },
};

/** dndの設定に必要なオブジェクト */
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

    // 半分以上を超えたときに処理を発火させる
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const fireThresholdY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    const dragConditionIndex = state.findConditionIndex(dragBranchId, dragConditionId);
    const hoverConditionIndex = state.findConditionIndex(hoverBranchId, hoverConditionId);

    // 異なるnodeでは移動不可
    if (dragNodeId !== hoverNodeId) return;

    // 下向きのドラッグ処理
    if (dragConditionIndex < hoverConditionIndex && hoverClientY < fireThresholdY) return;

    // 上向きのドラッグ処理
    if (dragConditionIndex > hoverConditionIndex && hoverClientY > fireThresholdY) return;

    // 実際に入れ替えを行う
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

// dndのためのHOC
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
    dragging: monitor.isDragging(),
  }),
)(DropTargetConditionInGraph);

const ConditionInGraph = connect(stateToProps, actionsToProps)(DragSourceConditionInGraph);
export default ConditionInGraph;
