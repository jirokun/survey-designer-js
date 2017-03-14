import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { DND_NODE } from '../../../constants/dnd';
import * as Actions from '../../actions';

/**
 * Flowの中に描画される各Node。XxxxInFlowで使われる
 * このコンポーネントを使うことでdndで移動させることが可能となる
 */
class NodeInFlowOrig extends Component {
  /** nodeを選択したときの処理 */
  onNodeSelect(node) {
    const { selectNode } = this.props;
    selectNode(node.getId());
  }

  /** nodeを削除したときの処理 */
  handleRemoveNode(e) {
    const { removeNode, node } = this.props;
    e.stopPropagation();
    removeNode(node.getId());
  }

  /** 描画 */
  render() {
    const { survey, node, nodeLabel, dragging } = this.props;
    const { connectDragPreview, connectDragSource, connectDropTarget } = this.props;
    const deletable = (node.isFinisher() && survey.getFinishers().size > 1)
                        || node.isPage()
                        || node.isBranch(); // 最後のfinisher以外は削除可能
    return connectDragPreview(connectDropTarget(
      <div className={classNames(node.getType(), { invisible: dragging }, "enq-page")} onClick={() => this.onNodeSelect(node)}>
        {connectDragSource(<i className="fa fa-bars drag-handler" />)}
        &nbsp;
        {nodeLabel}
        {this.props.children}
        <div className={classNames('item-controller enq-item-controller', { invisible: !deletable })}>
          <i className="fa fa-trash delete-button" onClick={e => this.handleRemoveNode(e)} />
        </div>
      </div>,
    ));
  }
}

/** dndの設定に必要なオブジェクト */
const conditionSource = {
  beginDrag(props) {
    props.changeNodeDragging(true);

    return {
      nodeId: props.node.getId(),
    };
  },
  endDrag(props) {
    props.changeNodeDragging(false);
  },
};

/** dndの設定に必要なオブジェクト */
const conditionTarget = {
  hover(props, monitor, component) {
    const { survey, node } = props;
    const dragNodeId = monitor.getItem().nodeId;
    const hoverNodeId = node.getId();

    // 自分自身の場合には何もしない
    if (dragNodeId === hoverNodeId) {
      return;
    }

    // 半分以上を超えたときに処理を発火させる
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const fireThresholdY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    const dragNodeIndex = survey.findNodeIndex(dragNodeId);
    const hoverNodeIndex = survey.findNodeIndex(hoverNodeId);

    // 下向きのドラッグ処理
    if (dragNodeIndex < hoverNodeIndex && hoverClientY < fireThresholdY) {
      return;
    }

    // 上向きのドラッグ処理
    if (dragNodeIndex > hoverNodeIndex && hoverClientY > fireThresholdY) {
      return;
    }

    // 実際に入れ替えを行う
    props.swapNode(dragNodeId, hoverNodeId);
  },
};

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});

const actionsToProps = dispatch => ({
  changeNodeDragging: dragging => dispatch(Actions.changeNodeDragging(dragging)),
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
  removeNode: nodeId => dispatch(Actions.removeNode(nodeId)),
  swapNode: (srcNodeId, destNodeId) => dispatch(Actions.swapNode(srcNodeId, destNodeId)),
});

// dndのためのHOC
const DropTargetNodeInFlow = DropTarget(
  DND_NODE,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(NodeInFlowOrig);
const DragSourceNodeInFlow = DragSource(
  DND_NODE,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    dragging: monitor.isDragging(),
  }),
)(DropTargetNodeInFlow);

const NodeInFlow = connect(stateToProps, actionsToProps)(DragSourceNodeInFlow);
export default NodeInFlow;
