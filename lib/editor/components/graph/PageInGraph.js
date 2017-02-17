import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { DragSource, DropTarget } from 'react-dnd';
import * as Actions from '../../actions';
import { DND_NODE } from '../../../constants';
import { conditionTarget, conditionSource } from './DndFunctions';

class PageInGraphOrig extends Component {
  constructor() {
    super();

    this.addQuestionPopover = (
      <Popover id="popover-positioned-right" title="ページへのアイテム追加">
        <Button bsSize="small" bsStyle="info" block onClick={() => this.handleAddQuestion('Checkbox')}>複数選択肢</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('Radio')} block>単一選択肢</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('MultiNumber')} block>数値記入</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('SingleText')} block>1行テキスト</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('Text')} block>複数行テキスト</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('Description')} block>説明文</Button>
      </Popover>
    );
  }

  onPageSelect(node) {
    const { selectNode } = this.props;
    selectNode(node.getId());
  }

  handleAddQuestion(questionClassName) {
    const { state, node, addQuestion } = this.props;
    const page = state.findPageFromNode(node.getId());
    addQuestion(questionClassName, page.getId(), this.overlayIndex);
  }

  handleRemovePage(e) {
    const { removeNode, node } = this.props;
    e.stopPropagation();
    removeNode(node.getId());
  }

  handleRemoveQuestion(questionId) {
    const { state, removeQuestion, node } = this.props;
    const page = state.findPageFromNode(node.getId());
    removeQuestion(page.getId(), questionId);
  }

  createInsertElement(key, index) {
    return (
      <li key={key} className="insert-item-box">
        <div>
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={this.addQuestionPopover}
            onEnter={() => { this.overlayIndex = index; }}
            rootClose
          >
            <i className="glyphicon glyphicon-plus-sign" />
          </OverlayTrigger>
        </div>
      </li>
    );
  }

  render() {
    const { state, node } = this.props;
    const page = state.findPageFromNode(node.getId());
    const questionEls = [];
    const questions = page.getQuestions();
    if (questions.size === 0) {
      const sizeZeroKey = `${this.constructor.name}_${page.getId()}__0}`;
      questionEls.push(this.createInsertElement(`${sizeZeroKey}_insert_0`, 0));
    }
    questions.forEach((question, i) => {
      const questionNo = state.calcQuestionNo(page.getId(), question.getId());
      const title = `${questionNo}. ${question.getPlainTitle()}`;
      const key = `${this.constructor.name}_${page.getId()}_${question.getId()}`;
      if (i === 0) {
        questionEls.push(this.createInsertElement(`${key}_insert_${i}`, i));
      }
      questionEls.push(
        <li
          key={key}
          className="question"
        >
          <i className="fa fa-bars drag-handler" /> &nbsp;
          {title}
          <div className="item-controller">
            <i
              className="fa fa-trash text-danger delete-button"
              onClick={() => this.handleRemoveQuestion(question.getId())}
            />
          </div>
        </li>);
      questionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });
    const pageTitle = state.calcPageLabel(page.getId());
    const { connectDragPreview, connectDragSource, connectDropTarget } = this.props;
    return connectDragPreview(connectDropTarget(
      <div className="page" onClick={() => this.onPageSelect(node)}>
        <div className="header">
          {connectDragSource(<i className="fa fa-bars drag-handler" />)}
          &nbsp;
          {pageTitle}
          <div className="item-controller">
            <i className="fa fa-trash text-danger delete-button" onClick={e => this.handleRemovePage(e)} />
          </div>
        </div>
        <ul className="questions">{questionEls}</ul>
      </div>,
    ));
  }
}

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
  swapNode: (srcNodeId, destNodeId) => dispatch(Actions.swapNode(srcNodeId, destNodeId)),
});

const DropTargetPageInGraph = DropTarget(
  DND_NODE,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(PageInGraphOrig);
const DragSourcePageInGraph = DragSource(
  DND_NODE,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DropTargetPageInGraph);
const PageInGraph = connect(stateToProps, actionsToProps)(DragSourcePageInGraph);
export default PageInGraph;
