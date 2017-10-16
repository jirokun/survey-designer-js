import $ from 'jquery';
import QuestionWithItemBaseJS from './QuestionWithItemBaseJS';
import { findElementsByOutputDefinitions, createQueryForOutputDefinition } from '../../../utils';

/**
 * CheckboxQuestionのためのJS
 */
export default class CheckboxQuestionJS extends QuestionWithItemBaseJS {
  constructor(el, survey, page, runtime) {
    super(el, survey, page, runtime, 'Checkbox', 'question-form-list');
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

  /** 追加入力のチェックボックス・ラジオが変更されたときのハンドラ */
  handleChangeChoiceWithAdditionalInput($additionalInput, e) {
    const checked = e.target.checked;
    $additionalInput.disable(!checked);
  }

  /**
   * 追加入力のためのイベントの割当を行う
   */
  additionalInput(question) {
    const $el = $(this.el);
    question
      .getItems()
      .filter(item => item.hasAdditionalInput())
      .forEach((item) => {
        const outputDefinitions = question.getOutputDefinitionsFromItem(item);
        const checkboxName = createQueryForOutputDefinition(outputDefinitions.get(0));
        const $additionalInput = findElementsByOutputDefinitions(outputDefinitions.get(1));
        $el.on('change', checkboxName, this.handleChangeChoiceWithAdditionalInput.bind(this, $additionalInput));
      });
  }

  /** 排他の項目を表示 */
  showExclusiveItem(question) {
    question
      .getItems()
      .filter(item => item.isExclusive())
      .forEach((item) => {
        findElementsByOutputDefinitions(question.getOutputDefinitionsFromItem(item).get(0)).after('<span class="detail-function">排他</span>');
      });
  }

  /** ランダム固定の表示 */
  showRandomFixed(question) {
    question
      .getItems()
      .filter(item => item.isRandomFixed())
      .forEach((item) => {
        findElementsByOutputDefinitions(question.getOutputDefinitionsFromItem(item).get(0)).after('<span class="detail-function">ランダム固定</span>');
      });
  }

  initialize() {
    this.findQuestions().forEach((checkboxQuestion) => {
      this.randomize(checkboxQuestion);
      this.additionalInput(checkboxQuestion);
      this.toExclusive(checkboxQuestion);
      this.applyItemVisibility(checkboxQuestion);
    });
  }

  initForDetail() {
    this.survey.getPages()
      .flatMap(page => page.getQuestions())
      .filter(question => question.getDataType() === 'Checkbox')
      .forEach((question) => {
        this.showExclusiveItem(question);                     // 排他の項目を表示
        this.showRandomFixed(question);                       // ランダム固定の表示
      });
  }

  deInitialize() {
  }
}
