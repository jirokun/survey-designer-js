import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import * as Actions from '../../actions';
import { DND_QUESTION } from '../../../constants';

class QuestionInGraphOrig extends Component {
  handleRemoveQuestion(questionId) {
    const { state, removeQuestion, node } = this.props;
    const page = state.findPageFromNode(node.getId());
    removeQuestion(page.getId(), questionId);
  }

  render() {
    const { state, page, question, connectDragPreview, connectDragSource, connectDropTarget } = this.props;
    const questionNo = state.calcQuestionNo(page.getId(), question.getId());
    const title = `${questionNo}. ${question.getPlainTitle()}`;
    return connectDragPreview(connectDropTarget(
      <li className="question">
        {connectDragSource(<i className="fa fa-bars drag-handler" />)}
        &nbsp;
        {title}
        <div className="item-controller">
          <i
            className="fa fa-trash text-danger delete-button"
            onClick={() => this.handleRemoveQuestion(question.getId())}
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
      pageId: props.page.getId(),
      questionId: props.question.getId(),
    };
  },
};

const conditionTarget = {
  hover(props, monitor, component) {
    const { state, node, page, question } = props;
    const dragNodeId = monitor.getItem().nodeId;
    const dragPageId = monitor.getItem().pageId;
    const dragQuestionId = monitor.getItem().questionId;
    const hoverNodeId = node.getId();
    const hoverPageId = page.getId();
    const hoverQuestionId = question.getId();

    // 自分自身の場合には何もしない
    if (dragQuestionId === hoverQuestionId) {
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

    const dragQuestionIndex = state.findQuestionIndex(dragPageId, dragQuestionId);
    const hoverQuestionIndex = state.findQuestionIndex(hoverPageId, hoverQuestionId);

    // Dragging downwards
    if (dragNodeId === hoverNodeId) {
      if (dragQuestionIndex < hoverQuestionIndex && hoverClientY < hoverMiddleY) {
        return;
      }
    }

    // Dragging upwards
    if (dragNodeId === hoverNodeId) {
      if (dragQuestionIndex > hoverQuestionIndex && hoverClientY > hoverMiddleY) {
        return;
      }
    }

    // Time to actually perform the action
    // console.log(dragIndex, hoverIndex);
    props.swapQuestion(dragNodeId, dragQuestionId, hoverNodeId, hoverQuestionId);
  },
};

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  removeQuestion: (pageId, questionId) => dispatch(Actions.removeQuestion(pageId, questionId)),
  swapQuestion: (srcNodeId, srcQuestionId, destNodeId, destQuestionId) =>
    dispatch(Actions.swapQuestion(srcNodeId, srcQuestionId, destNodeId, destQuestionId)),
});

const DropTargetQuestionInGraph = DropTarget(
  DND_QUESTION,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(QuestionInGraphOrig);
const DragSourceQuestionInGraph = DragSource(
  DND_QUESTION,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DropTargetQuestionInGraph);
const QuestionInGraph = connect(stateToProps, actionsToProps)(DragSourceQuestionInGraph);
export default QuestionInGraph;
