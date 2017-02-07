import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { Well, Glyphicon } from 'react-bootstrap';
import * as Utils from '../../utils';

class ConditionEditorOrig extends Component {
  getCondition() {
    const root = this.root;
    const type = this.conditionTypeEl.value;
    const nextNodeId = this.conditionNextNodeIdEl.value;
    const refIdElements = root.querySelectorAll('.condition-ref-id');
    const refValueElements = root.querySelectorAll('.condition-ref-value');
    const refOperatorElements = root.querySelectorAll('.condition-ref-operator');
    const childConditions = Array.prototype.slice.apply(refIdElements).map((el, i) => ({
      refQuestionId: refIdElements[i].value,
      operator: refOperatorElements[i].value,
      value: refValueElements[i].value,
    }));
    const condition = { type, nextNodeId, childConditions };
    return condition;
  }

  handleClickAddButton(ccIndex) {
    const { handleChangeBranch } = this.props;
    const condition = this.getCondition();
    condition.childConditions.splice(ccIndex, 0, {
      refQuestionId: '',
      operator: '==',
      value: '',
    });

    handleChangeBranch(index, condition);
  }

  handleClickMinusButton(ccIndex) {
    const { handleChangeBranch, index } = this.props;
    const condition = this.getCondition();
    condition.childConditions.splice(ccIndex, 1);
    handleChangeBranch(index, condition);
  }

  handleChange() {
    const { handleChangeBranch, index } = this.props;
    handleChangeBranch(index, this.getCondition());
  }

  renderChildCondition(childCondition, index, childConditions) {
    return (
      <div ref={node => this.root = node} key={`child-conditions-${index}`} className="condition-editor">
        <input type="text" className="form-control condition-ref-id" placeholder="質問ID" value={childCondition.refQuestionId} onChange={this.handleChange.bind(this)} />
        <span>の値が</span>
        <input type="text" className="form-control condition-ref-value" placeholder="値" value={childCondition.value} onChange={this.handleChange.bind(this)} />
        <select className="form-control condition-ref-operator" value={childCondition.operator} onChange={this.handleChange.bind(this)}>
          <option value=">=">以上</option>
          <option value="==">と等しい</option>
          <option value="<=">以下</option>
          <option value=">">より大きい</option>
          <option value="<">より小さい</option>
          <option value="includes">の選択肢を選択している</option>
          <option value="notIncludes">の選択肢を選択していない</option>
        </select>
        <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={() => this.handleClickAddButton(index)} />
        { childConditions.length === 1 ? null : <Glyphicon className="clickable icon-button text-danger" glyph="minus-sign" onClick={this.handleClickMinusButton.bind(this, index)} /> }
      </div>
    );
  }

  renderIf() {
    const { condition, isDragging } = this.props;
    const opacity = isDragging ? 0 : 1;

    const nextNodeId = condition.getNextNodeId();
    const page = state.findPageFromNode(nextNodeId);
    const pageLabel = state.calcPageLabel(page.getId());

    return (
      <Well className="branch-editor" style={{ opacity }}>
        <div className="branch-editor-header">
          <span>以下の</span>
          <select ref={node => this.conditionTypeEl = node} className="form-control condition-type" value={condition.type} onChange={this.handleChange.bind(this)}>
            <option value="all">全て</option>
            <option value="any">いずれか</option>
          </select>
          <span>を満たす場合</span>
          <select className="forom-control condition-next-node-id">
          </select>
          <input ref={node => this.conditionNextNodeIdEl = node} type="text" className="form-control condition-next-node-id" value={condition.nextNodeId} readOnly />
          <span>に遷移する</span>
        </div>
        <div className="branch-editor-body">
          {condition.childConditions.map((cc, i, childConditions) => this.renderChildCondition(cc, i, childConditions))}
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
const actionsToProps = () => ({
});

const DropTargetConditionEditor = DropTarget('CONDITION', conditionTarget, dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }))(ConditionEditorOrig);
const DragSourceConditionEditor = DragSource('CONDITION', conditionSource, (dndConnect, monitor) => ({ connectDragSource: dndConnect.dragSource(), isDragging: monitor.isDragging() }))(DropTargetConditionEditor);
const ConditionEditor = connect(stateToProps, actionsToProps)(DragSourceConditionEditor);
export default ConditionEditor;
