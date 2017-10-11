import $ from 'jquery';
import QuestionWithItemBaseJS from './QuestionWithItemBaseJS';
import { createQueryForOutputDefinition, findElementsByOutputDefinitions } from '../../../utils';

/**
 * RadioQuestionのためのJS
 */
export default class RadioQuestionJS extends QuestionWithItemBaseJS {
  constructor(el, survey, page, runtime) {
    super(el, survey, page, runtime, 'Radio', 'question-form-list');
  }

  /**
   * itemに対応する要素を取得する
   *
   * @param {Question} question 対象の設問
   * @param {ItemDefinition} item 対象のItem
   */
  findItemElement(question, item) {
    const outputDefinition = question.getOutputDefinitions().get(0);
    return findElementsByOutputDefinitions(outputDefinition).filter(`[value="${item.getValue()}"]`).parents(`.${this.itemClass}`);
  }

  /**
   * 追加入力のdisabledを切り替える
   *
   * @param {RadioQuestionDefinition} question 対象の設問
   * @param {Event} e イベント
   */
  toggleAdditionalInputStates(question, e) {
    const checkedValue = e.target.value;
    const selectedItem = question.getItems().find(item => item.getValue() === checkedValue);
    question
      .getItems()
      .forEach((item) => {
        if (!item.hasAdditionalInput()) return;
        const outputDefinition = question.getOutputDefinitionOfAdditionalInput(item);
        findElementsByOutputDefinitions(outputDefinition).disable(item !== selectedItem);
      });
  }

  /**
   * 追加入力のためのイベントの割当を行う
   */
  additionalInput(question) {
    const $el = $(this.el);
    const outputDefinition = question.getOutputDefinitions().get(0);
    const query = createQueryForOutputDefinition(outputDefinition);
    $el.on('change', query, this.toggleAdditionalInputStates.bind(this, question));
  }

  /**
   * checkbox、追加入力、checkboxを含むliエレメントをdisabledにする
   */
  disableItem(question, item, disabled) {
    const itemOutputDefinitions = question.getOutputDefinitionsFromItem(item);
    const $checkbox = findElementsByOutputDefinitions(itemOutputDefinitions.get(0));
    if (item.hasAdditionalInput() && disabled === false && !$checkbox.prop('checked')) {
      $checkbox.disable(disabled);
    } else {
      findElementsByOutputDefinitions(...itemOutputDefinitions).disable(disabled);
    }

    // li要素のdiabledを設定
    if (disabled) {
      this.findItemElement(question, item).addClass('disabled');
    } else {
      this.findItemElement(question, item).removeClass('disabled');
    }
  }

  /** 排他のチェックボックスがチェックされた場合の処理 */
  handleExclusive(question, targetItem, e) {
    const checked = e.target.checked;
    question
      .getItems()
      .filter(item => item !== targetItem)
      .forEach(item => this.disableItem(question, item, checked));
  }

  /** 排他のイベントを割り当てる */
  toExclusive(question) {
    const $el = $(this.el);
    question
      .getItems()
      .filter(item => item.isExclusive())
      .forEach((item) => {
        const outputDefinitions = question.getOutputDefinitionsFromItem(item);
        const checkboxOutputDefinition = outputDefinitions.get(0);
        $el.on('change', `[name="${checkboxOutputDefinition.getName()}"]`, this.handleExclusive.bind(this, question, item));
      });
  }

  initialize() {
    this.findQuestions().forEach((question) => {
      this.randomize(question);
      this.additionalInput(question);
      this.applyItemVisibility(question);
    });
  }

  deInitialize() {
  }
}
