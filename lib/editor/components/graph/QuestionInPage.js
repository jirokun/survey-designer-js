import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import * as Actions from '../../actions';

class QuestionInPageOrig extends Component {
  handleRemoveQuestion(questionId) {
    const { state, removeQuestion, node } = this.props;
    const page = state.findPageFromNode(node.getId());
    removeQuestion(page.getId(), questionId);
  }

  render() {
    const { state, page, question, connectDragSource, connectDragPreview, connectDropTarget } = this.props;
    const questionNo = state.calcQuestionNo(page.getId(), question.getId());
    const title = `${questionNo}. ${question.getPlainTitle()}`;
    const key = `${this.constructor.name}_${page.getId()}_${question.getId()}`;
    return connectDragPreview(connectDropTarget(
      <li
        key={key}
        className="question"
      >
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
    console.log(props);
    return {
      id: props.nextNodeId,
      index: props.index,
    };
  },
};

const conditionTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
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
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    // console.log(dragIndex, hoverIndex);
    props.handleSwapCondition(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    const item = monitor.getItem();
    item.index = hoverIndex;
  },
};

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
});

const DropTargetQuestionInPage = DropTarget(
  QuestionInPageOrig.name,
  conditionTarget,
  dndConnect => ({
    connectDropTarget: dndConnect.dropTarget(),
  }),
)(QuestionInPageOrig);
const DragSourceQuestionInPage = DragSource(
  QuestionInPageOrig.name,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DropTargetQuestionInPage);
const QuestionInPage = connect(stateToProps, actionsToProps)(DragSourceQuestionInPage);
export default QuestionInPage;
