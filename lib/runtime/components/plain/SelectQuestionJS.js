import $ from 'jquery';
import QuestionWithItemBaseJS from './QuestionWithItemBaseJS';
import { findElementsByOutputDefinitions } from '../../../utils';
import * as ItemVisibility from '../../../constants/ItemVisibility';

/**
 * SelectQuestionのためのJS
 */
export default class SelectQuestionJS extends QuestionWithItemBaseJS {
  constructor(el, survey, page, runtime) {
    super(el, survey, page, runtime, 'Select');
  }

  /**
   * itemに対応する要素を取得する
   *
   * @param {Question} question 対象の設問
   * @param {ItemDefinition} item 対象のItem
   */
  findItemElement(question, item) {
    const outputDefinition = question.getOutputDefinitions().get(0);
    return findElementsByOutputDefinitions(outputDefinition).find(`option[value="${item.getValue()}"]`);
  }

  /**
   * 項目の表示・非表示の制御を行う
   *
   * @param {BaseQuestionDefinition} question 対象の設問
   */
  applyItemVisibility(question) {
    question
      .getItems()
      .forEach((item) => {
        const $option = this.findItemElement(question, item);
        if ($option.length === 0) return; // option要素がない場合はスキップ
        const className = item.calcVisibilityClassName(this.survey, this.runtime.getAnswers());
        if (className === ItemVisibility.CLASS_NAME_HIDDEN) {
          // RadioやCheckboxはclass=hiddenとしているが、selectの場合要素を消さないと選択を外すことができない
          // したがってCLASS_NAME_HIDDENの場合には要素を削除する
          $option.remove();
        }
      });
  }

  /** 設問を任意入力にする */
  optionalize(question) {
    if (!question.isOptional()) return;
    const outputDefinition = question.getOutputDefinitions().get(0);
    findElementsByOutputDefinitions(outputDefinition).removeAttr('data-parsley-required');
  }

  initialize() {
    this.findQuestions().forEach((question) => {
      this.optionalize(question);
      this.applyItemVisibility(question);
    });
  }

  deInitialize() {
  }
}
