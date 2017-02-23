import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { DND_NODE } from '../../../constants/constants';
import * as Actions from '../../actions';

class NodeInGraphOrig extends Component {
  onFinisherSelect(node) {
    const { selectNode } = this.props;
    selectNode(node.getId());
  }

  handleRemoveNode(e) {
    const { removeNode, node } = this.props;
    e.stopPropagation();
    removeNode(node.getId());
  }

  render() {
    const { state, node, nodeLabel } = this.props;
    const { connectDragPreview, connectDragSource, connectDropTarget } = this.props;
    const deletable = state.getNodes().size > 1;
    const itemControllerStyle = {
      display: deletable ? '' : 'none',
    };
    return connectDragPreview(connectDropTarget(
      <div className={node.getType()} onClick={() => this.onFinisherSelect(node)}>
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

const conditionSource = {
  beginDrag(props) {
    return {
      nodeId: props.node.getId(),
    };
  },
};

const conditionTarget = {
  hover(props, monitor, component) {
    const { state, node } = props;
    const dragNodeId = monitor.getItem().nodeId;
    const hoverNodeId = node.getId();

    // 自分自身の場合には何もしない
    if (dragNodeId === hoverNodeId) {
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

    // Dragging downwards
    const dragNodeIndex = state.findNodeIndex(dragNodeId);
    const hoverNodeIndex = state.findNodeIndex(hoverNodeId);
    if (dragNodeIndex < hoverNodeIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragNodeIndex > hoverNodeIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
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
export default connect(
  stateToProps,
  actionsToProps,
)(NodeInGraph);
