/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../../actions';
import { DND_ITEM } from '../../../constants/dnd';

/** questionのitemsを編集する際に使用するeditor */
class ItemEditor extends Component {
  /** tinymceのエディタをelementから取得する */
  static getTinyMCEEditorFromEl(el) {
    return tinymce.editors.find(editor => document.getElementById(editor.id) === el);
  }

  /** コンストラクタ */
  constructor(props) {
    super(props);
    this.destroyed = false;
  }

  /** Reactのライフサイクルメソッド */
  shouldComponentUpdate() {
    const el = document.activeElement;
    // tinymceからのイベントの場合は更新しない
    return !el.classList.contains('item-editor-tinymce');
  }

  /** Reactのライフサイクルメソッド */
  componentWillUnmount() {
    // unmountする時はtinymceのインスタンスをdetroyする
    // this.rootElを参照したいがなぜかnullになってしまうことが有る
    const rootEl = ReactDOM.findDOMNode(this);
    const editorEls = rootEl.querySelectorAll('.item-editor-tinymce');
    this.destroyed = true;
    return Array.prototype.map.call(editorEls, el => ItemEditor.getTinyMCEEditorFromEl(el).destroy());
  }

  /** itemの値が変更されたときのハンドラ */
  handleChangeItem(plainText, html) {
    const { page, question, item, changeItemAttribute } = this.props;
    if (this.destroyed) {
      // destroy後にtinymceにフォーカスが当たっているとchangeイベントが発火することがあるためthis.destroyedで判定
      return;
    }
    if (html) {
      changeItemAttribute(page.getId(), question.getId(), item.getId(), 'plainLabel', plainText);
      changeItemAttribute(page.getId(), question.getId(), item.getId(), 'label', html);
    } else {
      changeItemAttribute(page.getId(), question.getId(), item.getId(), 'plainLabel', plainText);
      changeItemAttribute(page.getId(), question.getId(), item.getId(), 'label', plainText);
    }
  }

  /** 追加ボタンのクリックハンドラ */
  handleClickAddButton() {
    const { page, question, index, addItem } = this.props;
    addItem(page.getId(), question.getId(), index + 1);
  }

  /** 削除タンのクリックハンドラ */
  handleClickRemoveButton() {
    const { page, question, item, removeItem } = this.props;
    removeItem(page.getId(), question.getId(), item.getId());
  }

  /** オプションの値が変更されたときハンドラ */
  handleChangeOption(attr, value) {
    const { page, question, item, changeItemAttribute } = this.props;
    changeItemAttribute(page.getId(), question.getId(), item.getId(), attr, value);
  }

  /** 追加入力の入力項目をレンダリングする */
  createAdditionlInput() {
    const { item } = this.props;
    if (!this.props.additionalInput) {
      // additionalInputが指定されていない場合は空のtdを描画
      return [1, 2, 3].map(num => <td key={`${item.getId()}_empty${num}`} />);
    }
    const additionalInput = item.hasAdditionalInput();
    const elements = [];
    const baseKey = `${this.constructor.name}_${item.getId()}`;
    if (additionalInput) {
      elements.push(
        <td key={`${baseKey}_1`} className="option" value={item.getAdditionalInputType()} onChange={e => this.handleChangeOption('additionalInputType', e.target.value)}>
          <select>
            <option value="text">文字</option>
            <option value="number">数値</option>
          </select>
        </td>,
      );
      elements.push(<td key={`${baseKey}_2`} className="option"><input className="item-editor-unit" value={item.getUnit()} onChange={e => this.handleChangeOption('unit', e.target.value)} /></td>);
      elements.push(
        <td key={`${baseKey}_3`} className="option">
          <input type="checkbox" className="additional-input" onChange={e => this.handleChangeOption('additionalInput', e.target.checked)} checked={item.hasAdditionalInput()} />
        </td>,
      );
      return elements;
    }
    elements.push(<td key={`${baseKey}_1`} />);
    elements.push(<td key={`${baseKey}_2`} />);
    elements.push(
      <td key={`${baseKey}_3`} className="option" style={{ whiteSpace: 'nowrap' }}>
        <input type="checkbox" className="additional-input" onChange={e => this.handleChangeOption('additionalInput', e.target.checked)} checked={item.hasAdditionalInput()} />
      </td>,
    );
    return elements;
  }

  /** 描画 */
  render() {
    const {
      question,
      plainText,
      exclusive,
      item,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      dragging,
    } = this.props;
    const content = item.getLabel() || '';
    const items = question.getItems();
    const editor = plainText ? (<input
      type="text" className="form-control plain-text-item"
      onKeyUp={e => this.handleChangeItem(e.target.value)}
      onChange={e => this.handleChangeItem(e.target.value)}
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
          onKeyup={(e, editorInstance) => this.handleChangeItem(editorInstance.getContent({ format: 'text' }), editorInstance.getContent())}
          onChange={(e, editorInstance) => this.handleChangeItem(editorInstance.getContent({ format: 'text' }), editorInstance.getContent())}
          content={content}
        />);

    const randomFixedEl = question.isRandom() ?
      <td className="option"><input type="checkbox" className="random-fixed" onChange={e => this.handleChangeOption('randomFixed', e.target.checked)} checked={item.isRandomFixed()} /></td> : null;
    const exclusiveEl = exclusive ?
      <td className="option"><input type="checkbox" className="exclusive" onChange={e => this.handleChangeOption('exclusive', e.target.checked)} checked={item.isExclusive()} /></td> : null;

    return connectDragPreview(connectDropTarget(
      <tr className={classNames('item-editor-row', { invisible: dragging })}>
        <td className="item-editor-dnd">{connectDragSource(<i className="fa fa-bars drag-handler" />)}</td>
        <td className="item-editor-tinymce-container">
          {editor}
          <input type="hidden" className="item-id" value={item.getId()} />
        </td>
        {this.createAdditionlInput()}
        {randomFixedEl}
        {exclusiveEl}
        <td className="buttons">
          <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={() => this.handleClickAddButton()} />
          <Glyphicon
            className={classNames('clickable icon-button text-danger', { invisible: items.size === 1 })}
            glyph="remove-sign"
            onClick={() => this.handleClickRemoveButton()}
          />
        </td>
      </tr>,
    ));
  }
}

const conditionSource = {
  beginDrag(props) {
    return {
      itemId: props.item.getId(),
    };
  },
};

const conditionTarget = {
  hover(props, monitor, component) {
    const { state, page, question, item } = props;
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
    const dragNodeIndex = state.findNodeIndex(dragItemId);
    const hoverNodeIndex = state.findNodeIndex(hoverItemId);
    if (dragNodeIndex < hoverNodeIndex && hoverClientY < fireThresholdY) {
      return;
    }

    // Dragging upwards
    if (dragNodeIndex > hoverNodeIndex && hoverClientY > fireThresholdY) {
      return;
    }

    // Time to actually perform the action
    props.swapItem(page.getId(), question.getId(), dragItemId, hoverItemId);
  },
};

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeItemAttribute: (pageId, questionId, itemId, attribute, value) =>
    dispatch(EditorActions.changeItemAttribute(pageId, questionId, itemId, attribute, value)),
  addItem: (pageId, questionId, index) =>
    dispatch(EditorActions.addItem(pageId, questionId, index)),
  removeItem: (pageId, questionId, itemId) =>
    dispatch(EditorActions.removeItem(pageId, questionId, itemId)),
  swapItem: (pageId, questionId, srcItemId, destItemId) =>
    dispatch(EditorActions.swapItem(pageId, questionId, srcItemId, destItemId)),
});

const DropTargetItemEditor = DropTarget(
  DND_ITEM,
  conditionTarget,
  dndConnect => ({ connectDropTarget: dndConnect.dropTarget() }),
)(ItemEditor);
const DragSourceItemEditor = DragSource(
  DND_ITEM,
  conditionSource,
  (dndConnect, monitor) => ({
    connectDragSource: dndConnect.dragSource(),
    connectDragPreview: dndConnect.dragPreview(),
    dragging: monitor.isDragging(),
  }),
)(DropTargetItemEditor);
export default connect(stateToProps, actionsToProps)(DragSourceItemEditor);
