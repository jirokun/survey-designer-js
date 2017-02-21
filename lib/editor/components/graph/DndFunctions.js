import ReactDOM from 'react-dom';

export const conditionSource = {
  beginDrag(props) {
    return {
      nodeId: props.node.getId(),
    };
  },
};

export const conditionTarget = {
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

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

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
