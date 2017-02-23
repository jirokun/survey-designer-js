import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { DND_NODE } from '../../../constants/dnd';
import * as Actions from '../../actions';

/**
 * Graphの中に描画される各Node。XxxxInGraphで使われる
 * このコンポーネントを使うことでdndで移動させることが可能となる
 */
class NodeInGraphOrig extends Component {
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
    const { state, node, nodeLabel } = this.props;
    const { connectDragPreview, connectDragSource, connectDropTarget } = this.props;
    const deletable = state.getNodes().size > 1;
    const itemControllerStyle = {
      display: deletable ? '' : 'none',
    };
    return connectDragPreview(connectDropTarget(
      <div className={node.getType()} onClick={() => this.onNodeSelect(node)}>
        {connectDragSource(<i className="fa fa-bars drag-handler" />)}
        &nbsp;
        {nodeLabel}
        {this.props.children}
        <div className="item-controller" style={itemControllerStyle}>
          <i className="fa fa-trash text-danger delete-button" onClick={e => this.handleRemoveNode(e)} />
        </div>
      </div>,
    ));
  }
}

/** dndの設定に必要なオブジェクト */
const conditionSource = {
  beginDrag(props) {
    return {
      nodeId: props.node.getId(),
    };
  },
};

/** dndの設定に必要なオブジェクト */
const conditionTarget = {
  hover(props, monitor, component) {
    const { state, node } = props;
    const dragNodeId = monitor.getItem().nodeId;
    const hoverNodeId = node.getId();

    // 自分自身の場合には何もしない
    if (dragNodeId === hoverNodeId) {
      return;
    }

    // 半分以上を超えたときに処理を発火させる
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    const dragNodeIndex = state.findNodeIndex(dragNodeId);
    const hoverNodeIndex = state.findNodeIndex(hoverNodeId);

    // 下向きのドラッグ処理
    if (dragNodeIndex < hoverNodeIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // 上向きのドラッグ処理
    if (dragNodeIndex > hoverNodeIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // 実際に入れ替えを行う
    props.swapNode(dragNodeId, hoverNodeId);
  },
};

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
  removeNode: nodeId => dispatch(Actions.removeNode(nodeId)),
  swapNode: (srcNodeId, destNodeId) => dispatch(Actions.swapNode(srcNodeId, destNodeId)),
});

// dndのためのHOC
const DropTargetNodeInGraph = DropTarget(
  DND_NODE,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(NodeInGraphOrig);
const DragSourceNodeInGraph = DragSource(
  DND_NODE,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DropTargetNodeInGraph);

const NodeInGraph = connect(stateToProps, actionsToProps)(DragSourceNodeInGraph);
export default NodeInGraph;
