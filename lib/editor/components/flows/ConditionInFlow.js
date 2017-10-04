import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import * as Actions from '../../actions';
import { DND_CONDITION } from '../../../constants/dnd';

/** 分岐の中に描画する1遷移分 */
class ConditionInFlowOrig extends Component {
  /** 条件を削除したときに呼ばれる処理 */
  handleRemoveCondition(conditionId) {
    const { survey, removeCondition, node } = this.props;
    const branch = survey.findBranchFromNode(node.getId());
    removeCondition(branch.getId(), conditionId);
  }

  /** 描画 */
  render() {
    const { survey, condition, connectDragPreview, connectDragSource, connectDropTarget, dragging } = this.props;
    const nodeLabel = survey.calcNodeLabel(condition.getNextNodeId());
    return connectDragPreview(connectDropTarget(
      <li className={classNames('condition', { invisible: dragging })}>
        {connectDragSource(<i className="fa fa-bars drag-handler" />)}
        &nbsp;
        条件によって{nodeLabel} に遷移
        <div className="item-controller">
          <i
            className="fa fa-trash delete-button"
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
    const { node, branch, condition } = props;
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


    const dragConditionIndex = branch.findConditionIndex(dragBranchId, dragConditionId);
    const hoverConditionIndex = branch.findConditionIndex(hoverBranchId, hoverConditionId);

    // 異なるnodeでは移動不可
    if (dragNodeId !== hoverNodeId) return;

    // 下向きのドラッグ処理
    if (dragConditionIndex < hoverConditionIndex && hoverClientY < fireThresholdY) return;

    // 上向きのドラッグ処理
    if (dragConditionIndex > hoverConditionIndex && hoverClientY > fireThresholdY) return;

    // 実際に入れ替えを行う
    props.swapCondition(dragBranchId, dragConditionId, hoverConditionId);
  },
};

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});

const actionsToProps = dispatch => ({
  removeCondition: (branchId, conditionId) => dispatch(Actions.removeCondition(branchId, conditionId)),
  swapCondition: (branchId, srcConditionId, destConditionId) =>
    dispatch(Actions.swapCondition(branchId, srcConditionId, destConditionId)),
});

// dndのためのHOC
const DropTargetConditionInFlow = DropTarget(
  DND_CONDITION,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(ConditionInFlowOrig);
const DragSourceConditionInFlow = DragSource(
  DND_CONDITION,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    dragging: monitor.isDragging(),
  }),
)(DropTargetConditionInFlow);

const ConditionInFlow = connect(stateToProps, actionsToProps)(DragSourceConditionInFlow);
export default ConditionInFlow;
