/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import * as EditorActions from '../../actions';
import BaseItemEditor from './BaseItemEditor';

/** 個人情報設問のitemsを編集する際に使用するeditor */
export default class PersonalInfoItemEditor extends BaseItemEditor {
  getDisplayTypes(item) {
    return item.getPersonalItemDisplayTypeCandidates().map(displayType => <span
      key={`${item.getId()}_${displayType.getId()}_span`}
      className="personal-item-editor-display-type"
    >
      <input
        type="radio"
        key={`${item.getId()}_${displayType.getId()}`}
        id={`${item.getId()}_${displayType.getId()}`}
        checked={item.getDisplayTypeId() === displayType.getId()}
        onChange={() => this.handleChangeOption('displayTypeId', displayType.getId())}
      />
      <span>{displayType.getLabel()}</span>
    </span>);
  }

  /** 描画 */
  render() {
    const {
      runtime,
      survey,
      plainText,
      item,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      dragging,
    } = this.props;
    const content = item.getLabel() || '';
    const replacer = survey.getReplacer(runtime.getAnswers().toJS());

    const editor = plainText ? (<input
      type="text"
      className="form-control plain-text-item"
      onChange={e => this.handleChangeItem(e.target.value)}
      value={replacer.id2No(content)}
    />) : this.createValueElement(content, replacer);

    return connectDragPreview(connectDropTarget(
      <tr className={classNames('item-editor-row', { invisible: dragging })}>
        <td className="item-editor-dnd">{connectDragSource(<i className="fa fa-bars drag-handler" />)}</td>
        <td className="personal-item-editor-tinymce-container">
          {editor}
          <input type="hidden" className="item-id" value={item.getId()} />
        </td>
        <td className="personal-item-editor-optional-checkbox-td">
          <input type="checkbox" onChange={e => this.handleChangeOption('isOptional', e.target.checked)} checked={item.isOptional()} />
        </td>
        <td>
          {this.getDisplayTypes(item)}
        </td>
      </tr>,
    ));
  }
}

export const conditionSource = {
  beginDrag(props) {
    return {
      itemId: props.item.getId(),
    };
  },
};

export const conditionTarget = {
  hover(props, monitor, component) {
    const { survey, page, question, item, subItem } = props;
    const dragItemId = monitor.getItem().itemId;
    const hoverItemId = item.getId();

    // 自分自身の場合には何もしない
    if (dragItemId === hoverItemId) {
      return;
    }

    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const fireThresholdY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Dragging downwards
    const dragNodeIndex = survey.findNodeIndex(dragItemId);
    const hoverNodeIndex = survey.findNodeIndex(hoverItemId);
    if (dragNodeIndex < hoverNodeIndex && hoverClientY < fireThresholdY) {
      return;
    }

    // Dragging upwards
    if (dragNodeIndex > hoverNodeIndex && hoverClientY > fireThresholdY) {
      return;
    }

    // Time to actually perform the action
    if (subItem) {
      props.swapSubItem(page.getId(), question.getId(), dragItemId, hoverItemId);
    } else {
      props.swapItem(page.getId(), question.getId(), dragItemId, hoverItemId);
    }
  },
};

export const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  options: state.getOptions(),
});
export const actionsToProps = dispatch => ({
  changeItemAttribute: (pageId, questionId, itemId, attribute, value) =>
    dispatch(EditorActions.changeItemAttribute(pageId, questionId, itemId, attribute, value)),
  changeSubItemAttribute: (pageId, questionId, itemId, attribute, value) =>
    dispatch(EditorActions.changeSubItemAttribute(pageId, questionId, itemId, attribute, value)),
  addItem: (pageId, questionId, index) =>
    dispatch(EditorActions.addItem(pageId, questionId, index)),
  addSubItem: (pageId, questionId, index) =>
    dispatch(EditorActions.addSubItem(pageId, questionId, index)),
  removeItem: (pageId, questionId, itemId) =>
    dispatch(EditorActions.removeItem(pageId, questionId, itemId)),
  removeSubItem: (pageId, questionId, itemId) =>
    dispatch(EditorActions.removeSubItem(pageId, questionId, itemId)),
  swapItem: (pageId, questionId, srcItemId, destItemId) =>
    dispatch(EditorActions.swapItem(pageId, questionId, srcItemId, destItemId)),
  swapSubItem: (pageId, questionId, srcItemId, destItemId) =>
    dispatch(EditorActions.swapSubItem(pageId, questionId, srcItemId, destItemId)),
});
