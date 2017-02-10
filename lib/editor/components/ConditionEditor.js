import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { Well, Glyphicon } from 'react-bootstrap';
import { List } from 'immutable';
import * as EditorActions from '../actions';

/**
 * 分岐設定をに表示している一つ一つのWellがこのコンポーネントに対応している
 */
class ConditionEditorOrig extends Component {
  handleClickAddButton(ccIndex) {
    const { state, addChildCondition, condition } = this.props;
    const branch = state.findCurrentBranch();
    addChildCondition(branch.getId(), condition.getId(), ccIndex + 1);
  }

  handleClickRemoveButton(childCondition) {
    const { state, removeChildCondition, condition } = this.props;
    const branch = state.findCurrentBranch();
    removeChildCondition(branch.getId(), condition.getId(), childCondition.getId());
  }

  handleChangeCondition(attr, value) {
    const { state, condition, changeConditionAttribute } = this.props;
    const branch = state.findCurrentBranch();
    changeConditionAttribute(branch.getId(), condition.getId(), attr, value);
  }

  handleChangeChildCondition(childConditionId, attr, value) {
    const { state, condition, changeChildConditionAttribute } = this.props;
    const branch = state.findCurrentBranch();
    changeChildConditionAttribute(branch.getId(), condition.getId(), childConditionId, attr, value);
  }

  renderQuestionOptions(index) {
    const { state } = this.props;
    const node = state.findCurrentNode();
    const precedingPageNodeIds = state.findPrecedingPageNodeIds(node.getId());
    const optionValues = List(precedingPageNodeIds).map((nodeId) => {
      const page = state.findPageFromNode(nodeId);
      const options = page.getQuestions().map((question) => {
        return question.getOutputDefinitions().map((od) => {
          const questionNo = state.calcQuestionNo(page.getId(), question.getId(), od.getPostfix());
          const key = `${this.props.index}_${index}_${od.id}`;
          return <option key={key} value={od.id}>{questionNo} {od.label}</option>;
        }).toList();
      }).toList();
      return options;
    }).flatten();
    return optionValues;
  }

  /** 条件の値を入力するフォームを表示する */
  renderConditionValue(childCondition) {
    // TODO 選択しているoutputIdに適したエディタを表示する
    const { state } = this.props;
    const outputId = childCondition.getOutputId();
    const allOutputDefinitionMap = state.getAllOutputDefinitionMap();
    const outputDefinition = allOutputDefinitionMap.get(outputId);
    // 未選択、または存在しないoutputIdの場合はなにも表示しない
    if (!outputDefinition) return null;

    const outputType = outputDefinition.getOutputType();
    const keyBase = `${this.constructor.name}-${childCondition.getId()}`;
    switch (outputType) {
      case 'text':
        return [
          (<span key={`${keyBase}-0`}>の入力値が</span>),
          (<input key={`${keyBase}-1`} type="text" className="form-control" value={childCondition.getValue()} onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)} />),
          (<span key={`${keyBase}-2`}>と等しい</span>),
        ];
      case 'number':
        return [
          (<span key={`${keyBase}-3`}>の入力値が</span>),
          (<input key={`${keyBase}-4`} type="number" className="form-control" value={childCondition.getValue()} size="3" onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)} />),
          (<select key={`${keyBase}-5`} className="form-control condition-ref-operator" value={childCondition.getOperator()} onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'operator', e.target.value)}>
            <option value="==">と等しい</option>
            <option value="!=">と等しくない</option>
            <option value=">=">以上</option>
            <option value="<=">以下</option>
            <option value=">">より大きい</option>
            <option value="<">より小さい</option>
          </select>),
        ];
      case 'checkbox':
        return [
          (<span key={`${keyBase}-6`}>を</span>),
          (<select key={`${keyBase}-7`} className="form-control" value={childCondition.getValue()} onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)}>
            <option value="">選択していない</option>
            <option value="on">選択している</option>
          </select>),
        ];
      case 'select':
      case 'radio':
        const questionId = outputDefinition.getQuestionId();
        const question = state.findQuestion(questionId);
        return [
          (<span key={`${keyBase}-8`}>で</span>),
          (<select key={`${keyBase}-9`} className="form-control" onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)} value={childCondition.getValue()}>
            <option value="" />
            {question.getItems().map(item => <option value={`value${item.getIndex() + 1}`}>{item.getPlainLabel()}</option>).toArray()}
          </select>),
          (<span key={`${keyBase}-10`}>を選択している</span>),
        ];
      default:
        throw new Error(`未定義のoutputTypeです。outputType: ${outputType}`);
    }
  }

  renderChildCondition(childCondition, index, childConditions) {
    const removeButtonStyle = childConditions.size === 1 ? { visibility: 'hidden' } : {};
    return (
      <div ref={(el) => { this.root = el; }} key={`child-conditions-${index}`} className="condition-editor">
        <Glyphicon
          className="clickable icon-button text-info"
          glyph="plus-sign"
          onClick={() => this.handleClickAddButton(index)}
        />
        <Glyphicon
          className="clickable icon-button text-danger"
          glyph="remove-sign"
          onClick={() => this.handleClickRemoveButton(childCondition)}
          style={removeButtonStyle}
        />
        <select className="form-control condition-ref-id" value={childCondition.getOutputId()} onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'outputId', e.target.value)}>
          <option value="" />
          {this.renderQuestionOptions(index)}
        </select>
        {this.renderConditionValue(childCondition)}
      </div>
    );
  }

  renderPageOptions() {
    const { state } = this.props;
    const node = state.findCurrentNode();
    const followingPageNodeIds = state.findFollowingPageNodeIds(node.getId());
    return followingPageNodeIds.map((nodeId) => {
      const page = state.findPageFromNode(nodeId);
      const key = `next_node_id_option_${this.props.index}_${nodeId}`;
      return <option key={key} value={nodeId}>{state.calcPageLabel(page.getId())}</option>;
    });
  }

  renderIf() {
    const { condition, isDragging } = this.props;
    const opacity = isDragging ? 0 : 1;
    return (
      <Well className="branch-editor" style={{ opacity }}>
        <div className="branch-editor-header">
          <span>以下の</span>
          <select
            ref={(el) => { this.conditionTypeEl = el; }}
            className="form-control condition-type"
            value={condition.getConditionType()}
            onChange={e => this.handleChangeCondition('conditionType', e.target.value)}
          >
            <option value="all">全て</option>
            <option value="any">いずれか</option>
          </select>
          <span>を満たす場合</span>
          <select className="form-control condition-next-node-id" onChange={e => this.handleChangeCondition('nextNodeId', e.target.value)} value={condition.getNextNodeId()}>
            <option value="" />
            {this.renderPageOptions()}
          </select>
          <span>に遷移する</span>
        </div>
        <div className="branch-editor-body">
          {condition.getChildConditions().map((cc, i, childConditions) => this.renderChildCondition(cc, i, childConditions))}
        </div>
      </Well>
    );
  }

  render() {
    const { connectDragSource, connectDropTarget } = this.props;
    return connectDragSource(connectDropTarget(<div>{this.renderIf()}</div>));
  }
}

const conditionSource = {
  beginDrag(props) {
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
  addChildCondition: (branchId, conditionId, index) =>
    dispatch(EditorActions.addChildCondition(branchId, conditionId, index)),
  removeChildCondition: (branchId, conditionId, childConditionId) =>
    dispatch(EditorActions.removeChildCondition(branchId, conditionId, childConditionId)),
  changeConditionAttribute: (branchId, conditionId, attributeName, value) =>
    dispatch(EditorActions.changeConditionAttribute(branchId, conditionId, attributeName, value)),
  changeChildConditionAttribute: (branchId, conditionId, childConditionId, attributeName, value) =>
    dispatch(EditorActions.changeChildConditionAttribute(branchId, conditionId, childConditionId, attributeName, value)),
});

const DropTargetConditionEditor = DropTarget('CONDITION', conditionTarget, dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }))(ConditionEditorOrig);
const DragSourceConditionEditor = DragSource('CONDITION', conditionSource, (dndConnect, monitor) => ({ connectDragSource: dndConnect.dragSource(), isDragging: monitor.isDragging() }))(DropTargetConditionEditor);
const ConditionEditor = connect(stateToProps, actionsToProps)(DragSourceConditionEditor);
export default ConditionEditor;
