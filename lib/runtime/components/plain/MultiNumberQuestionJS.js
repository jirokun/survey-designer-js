import $ from 'jquery';
import QuestionWithItemBaseJS from './QuestionWithItemBaseJS';
import { parseInteger, createQueryForOutputDefinition, findElementsByOutputDefinitions } from '../../../utils';

/**
 * MultiNumberQuestionのためのJS
 */
export default class MultiNumberQuestionJS extends QuestionWithItemBaseJS {
  constructor(el, survey, page, runtime) {
    super(el, survey, page, runtime, 'MultiNumber', 'multiNumberLine');
  }

  /**
   * 合計値を計算し設定する
   *
   * @param {MultiNumberQuestion} question MultiNumberQuestion
   */
  calcTotal(question) {
    const totalOutputDefinition = question.getOutputDefinitionOfTotal();
    const $totalEl = findElementsByOutputDefinitions(totalOutputDefinition);
    const total = question
      .getItems()
      .flatMap(item => question.getOutputDefinitionsFromItem(item)) // Itemに対応するOutputDefinitionを取得
      .map(od => findElementsByOutputDefinitions(od))               // OutputDefinitionから対応するinputを取得
      .filter($el => $el.isEnabled())                               // 有効な要素のみに絞る
      .reduce((sum, $el) => sum + parseInteger($el.val(), 0), 0);   // 合計する
    $totalEl.val(total);
  }

  /**
   * 合計値を計算できるようにイベントを割りあてる
   *
   * @param {MultiNumberQuestion} question MultiNumberQuestion
   */
  summarize(question) {
    if (!question.isShowTotal()) return;
    const query = question.getOutputDefinitions().map(od => createQueryForOutputDefinition(od)).join(',');
    $(this.el).on('change', query, this.calcTotal.bind(this, question));
    // 初回実行
    this.calcTotal(question);
  }

  initialize() {
    this.findQuestions().forEach((question) => {
      this.summarize(question);
      this.randomize(question);
      this.applyItemVisibility(question);
    });
  }

  deInitialize() {
  }
}
