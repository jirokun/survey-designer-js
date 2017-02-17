/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import { DragSource, DropTarget } from 'react-dnd';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import ItemDefinition from '../../../runtime/models/definitions/questions/ItemDefinition';
import * as EditorActions from '../../actions';
import { DND_ITEM } from '../../../constants';

class ItemEditorOrig extends Component {
  static getTinyMCEEditorFromEl(el) {
    return tinymce.editors.find(editor => document.getElementById(editor.id) === el);
  }

  constructor(props) {
    super(props);
    this.destroyed = false;
  }

  shouldComponentUpdate() {
    const el = document.activeElement;
    // tinymceからのイベントの場合は更新しない
    return !el.classList.contains('item-editor-tinymce');
  }

  componentWillUnmount() {
    // unmountする時はtinymceのインスタンスをdetroyする
    // this.rootElを参照したいがなぜかnullになってしまうことが有る
    const rootEl = ReactDOM.findDOMNode(this);
    const editorEls = rootEl.querySelectorAll('.item-editor-tinymce');
    this.destroyed = true;
    return Array.prototype.map.call(editorEls, el => ItemEditorOrig.getTinyMCEEditorFromEl(el).destroy());
  }

  getItemValue() {
    // this.rootElを参照したいがなぜかnullになってしまうことが有る
    const rootEl = ReactDOM.findDOMNode(this);
    if (this.props.plainText) {
      const editorEls = rootEl.querySelectorAll('.plain-text-item');
      return Array.prototype.map.call(editorEls, el => el.value);
    }
    const idEls = rootEl.querySelectorAll('.item-id');
    const editorEls = rootEl.querySelectorAll('.item-editor-tinymce');
    const randomFixedEls = rootEl.querySelectorAll('input.random-fixed');
    const exclusiveEls = rootEl.querySelectorAll('input.exclusive');
    return Immutable.List(Array.prototype.map.call(editorEls, (el, i) => new ItemDefinition({
      _id: idEls[i].value,
      index: i,
      label: ItemEditorOrig.getTinyMCEEditorFromEl(el).getContent(),
      plainLabel: ItemEditorOrig.getTinyMCEEditorFromEl(el).getContent({ format: 'text' }),
      randomFixed: randomFixedEls[i] ? randomFixedEls[i].checked : false,
      exclusive: exclusiveEls[i] ? exclusiveEls[i].checked : false,
    })));
  }

  handleChangeQuestionItems() {
    const { page, question, changeQuestionAttribute } = this.props;
    if (this.destroyed) {
      // destroy後にtinymceにフォーカスが当たっているとchangeイベントが発火することがあるためthis.destroyedで判定
      return;
    }
    const itemValue = this.getItemValue();
    if (question.getItems().size !== itemValue.size) {
      // TinyMCEのバグ？行削除時に勝手にchangeイベントが発動することがある
      return;
    }
    changeQuestionAttribute(page.getId(), question.getId(), 'items', itemValue);
  }
  handleClickAddButton(index) {
    const { page, question, changeQuestionAttribute } = this.props;
    const itemValue = this.getItemValue().insert(index + 1, ItemDefinition.create());
    changeQuestionAttribute(page.getId(), question.getId(), 'items', itemValue);
  }
  handleClickRemoveButton(index) {
    const { page, question, changeQuestionAttribute } = this.props;
    const itemValue = this.getItemValue().delete(index);
    changeQuestionAttribute(page.getId(), question.getId(), 'items', itemValue);
  }
  handleChangeOption() {
    const { page, question, changeQuestionAttribute } = this.props;
    const itemValue = this.getItemValue();
    changeQuestionAttribute(page.getId(), question.getId(), 'items', itemValue);
  }
  renderItemEditorRow(item, index, items) {
    const {
      question,
      plainText,
      exclusive,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
    } = this.props;
    const content = item.getLabel() || "";
    const controllerRemoveStyle = {
      visibility: items.size === 1 ? 'hidden' : '',
    };
    const editor = plainText ? (<input
      type="text" className="form-control plain-text-item"
      onKeyup={() => this.handleChangeQuestionItems()}
      onChange={() => this.handleChangeQuestionItems()}
      value={content}
    />)
        : (<TinyMCE
          className="item-editor-tinymce"
          config={{
            menubar: '',
            toolbar: 'bold italic underline strikethrough backcolor forecolor anchor removeformat',
            plugins: 'contextmenu textcolor paste link',
            forced_root_block: false,
            inline: true,
            statusbar: false,
          }}
          onKeyup={(e, editorInstance) => this.handleChangeQuestionItems(e, editorInstance)}
          onChange={(e, editorInstance) => this.handleChangeQuestionItems(e, editorInstance)}
          content={content}
        />);

    const randomFixed = question.isRandom() ?
      <td className="option"><input type="checkbox" className="random-fixed" onChange={() => this.handleChangeOption()} checked={item.isRandomFixed()} /></td> : null;
    const exclusiveEl = exclusive ?
      <td className="option"><input type="checkbox" className="exclusive" onChange={() => this.handleChangeOption()} checked={item.isExclusive()} /></td> : null;

    return connectDragPreview(connectDropTarget(
      <tr className="item-editor-row" key={`item-editor-row-${index}`}>
        <td className="item-editor-dnd">{connectDragSource(<i className="fa fa-bars drag-handler" />)}</td>
        <td className="item-editor-tinymce-container">
          {editor}
          <input type="hidden" className="item-id" value={item.getId()} />
        </td>
        {randomFixed}
        {exclusiveEl}
        <td className="buttons">
          <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={() => this.handleClickAddButton(index)} />
          <Glyphicon className="clickable icon-button text-danger" glyph="remove-sign" onClick={() => this.handleClickRemoveButton(index)} style={controllerRemoveStyle} />
        </td>
      </tr>
    ));
  }
  render() {
    const { question, exclusive } = this.props;
    const items = question.getItems();
    const randomFixed = question.isRandom() ? <th>固定</th> : null;
    const exclusiveHeader = exclusive ? <th>排他</th> : null;
    return (
      <div ref={(el) => { this.rootEl = el; }} className="item-editor">
        <table className="item-editor-table">
          <thead>
            <tr>
              <th />
              {randomFixed}
              {exclusiveHeader}
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index, arr) => this.renderItemEditorRow(item, index, arr))}
          </tbody>
        </table>
      </div>
    );
  }
}

const conditionSource = {
  beginDrag(props, monitor, component) {
    // TODO react-dndでやるためにはItemEditorをItemEditorContainerとItemEditorに分けて実装する必要がありそう
    return {
      itemId: props.node.getId(),
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

    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
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
  changeQuestionAttribute: (pageId, questionId, attribute, value) =>
    dispatch(EditorActions.changeQuestionAttribute(pageId, questionId, attribute, value)),
});

const DropTargetItemEditor = DropTarget(
  DND_ITEM,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(ItemEditorOrig);
const DragSourceItemEditor = DragSource(
  DND_ITEM,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(DropTargetItemEditor);
export default connect(stateToProps, actionsToProps)(DragSourceItemEditor);
