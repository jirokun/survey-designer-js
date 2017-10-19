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

/** questionのitemsを編集する際に使用するeditor */
export default class PersonalInfoItemEditor extends Component {
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
        <td>
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
