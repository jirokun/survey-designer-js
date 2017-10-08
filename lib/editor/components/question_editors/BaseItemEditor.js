/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Glyphicon } from 'react-bootstrap';
import classNames from 'classnames';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import debounce from 'throttle-debounce/debounce';
import S from 'string';
import * as EditorActions from '../../actions';
import { isDevelopment } from '../../../utils';
import '../../../constants/tinymce_ja';

/** questionのitemsを編集する際に使用するeditor */
export default class BaseItemEditor extends Component {
  /** tinymceのエディタをelementから取得する */
  static getTinyMCEEditorFromEl(el) {
    return tinymce.editors.find(editor => document.getElementById(editor.id) === el);
  }

  /** コンストラクタ */
  constructor(props) {
    super(props);

    this.destroyed = false;
    this.debouncedHandleChangeItem = debounce(200, (plainText, html) => this.handleChangeItem(plainText, html));
    this.state = {
      tinymceVisible: false,
    };
  }

  /** Reactのライフサイクルメソッド */
  shouldComponentUpdate() {
    const el = document.activeElement;
    // tinymceからのイベントの場合は更新しない
    return !el || !el.classList.contains('item-editor-tinymce');
  }

  /** Reactのライフサイクルメソッド */
  componentWillUnmount() {
    // unmountする時はtinymceのインスタンスをdetroyする
    // this.rootElを参照したいがなぜかnullになってしまうことが有る
    const rootEl = ReactDOM.findDOMNode(this);
    const editorEls = rootEl.querySelectorAll('.item-editor-tinymce');
    this.destroyed = true;
    return Array.prototype.map.call(editorEls, el => BaseItemEditor.getTinyMCEEditorFromEl(el).destroy());
  }

  /** itemの値が変更されたときのハンドラ */
  handleChangeItem(plainText, html) {
    const { page, question, item, changeItemAttribute, changeSubItemAttribute, subItem } = this.props;
    if (this.destroyed) {
      // destroy後にtinymceにフォーカスが当たっているとchangeイベントが発火することがあるためthis.destroyedで判定
      return;
    }
    const changeFunc = subItem ? changeSubItemAttribute : changeItemAttribute;
    if (html) {
      changeFunc(page.getId(), question.getId(), item.getId(), 'plainLabel', S(plainText).trim().s);
      changeFunc(page.getId(), question.getId(), item.getId(), 'label', S(html).trim().s);
    } else {
      changeFunc(page.getId(), question.getId(), item.getId(), 'plainLabel', plainText);
      changeFunc(page.getId(), question.getId(), item.getId(), 'label', plainText);
    }
  }

  /** 追加ボタンのクリックハンドラ */
  handleClickAddButton() {
    const { page, question, index, addItem, addSubItem, subItem } = this.props;
    if (subItem) {
      addSubItem(page.getId(), question.getId(), index + 1);
    } else {
      addItem(page.getId(), question.getId(), index + 1);
    }
  }

  /** 削除ボタンのクリックハンドラ */
  handleClickRemoveButton() {
    const { page, question, item, removeItem, removeSubItem, subItem } = this.props;
    if (subItem) {
      removeSubItem(page.getId(), question.getId(), item.getId());
    } else {
      removeItem(page.getId(), question.getId(), item.getId());
    }
  }

  /** オプションの値が変更されたときハンドラ */
  handleChangeOption(attr, value) {
    const { page, question, item, changeItemAttribute, changeSubItemAttribute, subItem } = this.props;
    if (subItem) {
      changeSubItemAttribute(page.getId(), question.getId(), item.getId(), attr, value);
    } else {
      changeItemAttribute(page.getId(), question.getId(), item.getId(), attr, value);
    }
  }

  /** tinymceの表示を切り替える */
  handleTinyMCEVisibleChange(bool) {
    // すぐにvisible falseにするとonChangeが走ったときにインスタンスが存在しなくなっておりエラーとなるため、nextTickにする
    setTimeout(() => {
      if (!bool) {
        // tinymceが非表示になるときはdebounceせずにすぐに更新する
        this.handleChangeItem(this.editor.getContent({ format: 'text' }), this.editor.getContent());
      }
      this.setState({ tinymceVisible: bool });
    }, 1);
  }

  handleTinyMCEInit(e, editor) {
    const { survey, runtime } = this.props;
    this.editor = editor;
    this.editor.focus();
    // pluginで使うため下記の設定をsettingsに格納しておく
    this.editor.settings.survey = survey;
    this.editor.settings.outputDefinitions = survey.findPrecedingOutputDefinition(runtime.getCurrentNodeId(), true);
  }

  /** 追加入力の入力項目をレンダリングする */
  createAdditionalInput() {
    const { item, question } = this.props;
    if (!this.props.additionalInput) {
      // additionalInputが指定されていない場合は空のtdを描画
      return [1, 2, 3].map(num => <td key={`${item.getId()}_empty${num}`} />);
    }
    const additionalInput = item.hasAdditionalInput();
    const elements = [];
    const baseKey = `BaseItemEditor_${item.getId()}`;

    if (additionalInput) {
      if (!question.getMatrixType()) {
        elements.push(
          <td key={`${baseKey}_1`} className="option">
            <select value={item.getAdditionalInputType()} onChange={e => this.handleChangeOption('additionalInputType', e.target.value)}>
              <option value="text">文字</option>
              <option value="number">数値</option>
            </select>
          </td>,
        );
        elements.push(<td key={`${baseKey}_2`} className="option"><input className="item-editor-unit" value={item.getUnit()} onChange={e => this.handleChangeOption('unit', e.target.value)} /></td>);
      }
      elements.push(
        <td key={`${baseKey}_3`} className="option">
          <input type="checkbox" className="additional-input" onChange={e => this.handleChangeOption('additionalInput', e.target.checked)} checked={item.hasAdditionalInput()} />
        </td>,
      );
      return elements;
    }
    if (!question.getMatrixType()) {
      elements.push(<td key={`${baseKey}_1`} />);
      elements.push(<td key={`${baseKey}_2`} />);
    }
    elements.push(
      <td key={`${baseKey}_3`} className="option" style={{ whiteSpace: 'nowrap' }}>
        <input type="checkbox" className="additional-input" onChange={e => this.handleChangeOption('additionalInput', e.target.checked)} checked={item.hasAdditionalInput()} />
      </td>,
    );
    return elements;
  }

  /** 数値項目の単位をレンダリングする */
  createUnitLabel() {
    const { item, createsUnitLabel } = this.props;
    if (!createsUnitLabel)  return null;
    
    const elements = [];
    const baseKey = `BaseItemEditor_${item.getId()}`;
    
    elements.push(<td key={`${baseKey}_1`} className="option"><input className="item-editor-unit" value={item.getUnit()} onChange={e => this.handleChangeOption('unit', e.target.value)} /></td>);
    return elements;
  }
  
  createValueElement(content, replacer) {
    const { options } = this.props;
    if (this.state.tinymceVisible) {
      return (
        <TinyMCE
          className="item-editor-tinymce"
          config={{
            menubar: '',
            toolbar: `bold italic underline strikethrough backcolor forecolor anchor removeformat ${isDevelopment() ? 'code' : ''} reference_answer image_manager`,
            plugins: `contextmenu textcolor paste link ${isDevelopment() ? 'code' : ''} reference_answer image_manager`,
            forced_root_block: false,
            inline: true,
            statusbar: false,
            target_list: false,
            default_link_target: '_blank',
            imageManagerUrl: options.getImageManagerUrl(),
          }}
          onKeyup={(e, editorInstance) => this.debouncedHandleChangeItem(editorInstance.getContent({ format: 'text' }), editorInstance.getContent())}
          onChange={(e, editorInstance) => this.debouncedHandleChangeItem(editorInstance.getContent({ format: 'text' }), editorInstance.getContent())}
          onBlur={() => this.handleTinyMCEVisibleChange(false)}
          onInit={(e, editor) => this.handleTinyMCEInit(e, editor)}
          content={replacer.id2No(content)}
        />
      );
    }
    return (
      <div
        className="html-editor"
        onClick={() => this.handleTinyMCEVisibleChange(true)}
        dangerouslySetInnerHTML={{ __html: replacer.id2No(content) }}
      />
    );
  }

  /** 描画 */
  render() {
    const {
      runtime,
      survey,
      question,
      plainText,
      exclusive,
      item,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      dragging,
      subItem,
    } = this.props;
    const content = item.getLabel() || '';
    const items = subItem ? question.getSubItems() : question.getItems();
    const replacer = survey.getReplacer(runtime.getAnswers().toJS());

    const editor = plainText ? (<input
      type="text"
      className="form-control plain-text-item"
      onChange={e => this.handleChangeItem(e.target.value)}
      value={replacer.id2No(content)}
    />) : this.createValueElement(content, replacer);

    const randomFixedEl = (question.isRandom() && !subItem) || (question.isSubItemsRandom() && subItem) ?
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
        {this.createUnitLabel()}
        {this.createAdditionalInput()}
        {randomFixedEl}
        {exclusiveEl}
        <td className="buttons">
          <Glyphicon className="clickable icon-button" glyph="plus-sign" onClick={() => this.handleClickAddButton()} />
          <Glyphicon
            className={classNames('clickable icon-button', { invisible: items.size === 1 })}
            glyph="remove-sign"
            onClick={() => this.handleClickRemoveButton()}
          />
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
