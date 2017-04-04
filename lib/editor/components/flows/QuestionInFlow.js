import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { scroller } from 'react-scroll';
import * as Actions from '../../actions';
import { DND_QUESTION } from '../../../constants/dnd';
import BaseQuestionDefinition from '../../../runtime/models/survey/questions/internal/BaseQuestionDefinition';

/** Flowの中に描画するpageに配置するQuestion */
class QuestionInFlowOrig extends Component {
  /** questionの削除ボタンを押したときのハンドラ */
  handleRemoveQuestion(questionId) {
    const { survey, removeQuestion, node } = this.props;
    const page = survey.findPageFromNode(node.getId());
    removeQuestion(page.getId(), questionId);
  }

  /** nodeを選択したときの処理 */
  handleQuestionSelect(targetName) {
    setTimeout(() => {
      scroller.scrollTo(targetName, {
        containerId: 'PageEditor-tabs-pane-1',
        smooth: true,
        duration: 100,
      });
    }, 100);
  }

  /** 描画 */
  render() {
    const { runtime, survey, page, question, connectDragPreview, connectDragSource, connectDropTarget, dragging } = this.props;
    const questionNo = BaseQuestionDefinition.createOutputNo(
      survey.calcPageNo(page.getId()),
      survey.calcQuestionNo(page.getId(), question.getId()),
    );
    const replacer = survey.createReplacer(runtime.getAnswers().toJS());
    const title = `${questionNo}. ${replacer.id2Value(question.getPlainTitle())}`;
    return connectDragPreview(connectDropTarget(
      <li className={classNames('question', { invisible: dragging })}>
        {connectDragSource(<i className="fa fa-bars drag-handler" />)}
        &nbsp;
        <a href="javascript:void(0)" onClick={() => this.handleQuestionSelect(question.getId())}>{title}</a>
        <div className="item-controller">
          <i
            className="fa fa-trash delete-button"
            onClick={() => this.handleRemoveQuestion(question.getId())}
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
      pageId: props.page.getId(),
      questionId: props.question.getId(),
    };
  },
};

/** dndの設定に必要なオブジェクト */
const conditionTarget = {
  hover(props, monitor, component) {
    const { node, page, question } = props;
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

    // 半分以上を超えたときに処理を発火させる
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const fireThresholdY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    const dragQuestionIndex = page.findQuestionIndex(dragPageId, dragQuestionId);
    const hoverQuestionIndex = page.findQuestionIndex(hoverPageId, hoverQuestionId);

    // 異なるnodeでは移動不可
    if (dragNodeId !== hoverNodeId) return;

    // 下向きのドラッグ処理
    if (dragQuestionIndex < hoverQuestionIndex && hoverClientY < fireThresholdY) return;

    // 上向きのドラッグ処理
    if (dragQuestionIndex > hoverQuestionIndex && hoverClientY > fireThresholdY) return;

    // 実際に入れ替えを行う
    props.swapQuestion(dragNodeId, dragQuestionId, hoverQuestionId);
  },
};

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});

const actionsToProps = dispatch => ({
  removeQuestion: (pageId, questionId) => dispatch(Actions.removeQuestion(pageId, questionId)),
  swapQuestion: (nodeId, srcQuestionId, destQuestionId) =>
    dispatch(Actions.swapQuestion(nodeId, srcQuestionId, destQuestionId)),
});

// dndのためのHOC
const DropTargetQuestionInFlow = DropTarget(
  DND_QUESTION,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(QuestionInFlowOrig);
const DragSourceQuestionInFlow = DragSource(
  DND_QUESTION,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    dragging: monitor.isDragging(),
  }),
)(DropTargetQuestionInFlow);

const QuestionInFlow = connect(stateToProps, actionsToProps)(DragSourceQuestionInFlow);
export default QuestionInFlow;
