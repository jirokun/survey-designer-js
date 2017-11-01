import { swapNodes, findElementsByOutputDefinitions } from '../../../utils';

/**
 * itemを利用する下記の設問のベースクラスJS
 *
 *  * CheckboxQuestion
 *  * RadioQuestion
 *  * MultiNumberQuestion
 */
export default class QuestionWithItemBaseJS {
  constructor(el, survey, page, runtime, dataType, itemClass) {
    this.el = el;
    this.survey = survey;
    this.page = page;
    this.runtime = runtime;
    this.dataType = dataType;
    this.itemClass = itemClass;
  }

  /** pageに含まれる対象のQuestionのみを取得する */
  findQuestions() {
    return this.page.getQuestions().filter(question => question.getDataType() === this.dataType);
  }

  /**
   * itemはitemClassで一つ一つくるまれている必要がある
   * @param {BaseQuestionDefinition} question 対象の設問
   */
  randomize(question) {
    if (!question.isRandom()) return;
    // 見えているliのエレメントをかき集める
    const visibleItemElements = question
      .getItems()
      .filter(item => !item.isRandomFixed()) // 固定は除く
      .map(item => this.findItemElement(question, item))
      .filter($el => $el.length > 0)         // 要素が見つからないものは除く
      .filter($el => $el.is(':visible'));    // 見えていないものも除く

    // ランダムに入れ替える
    visibleItemElements
      .forEach(($itemEl) => {
        const $referenceElement = visibleItemElements.get(Math.floor(Math.random() * visibleItemElements.size));
        swapNodes($itemEl[0], $referenceElement[0]);
      });
  }

  /**
   * itemに対応する要素を取得する
   *
   * @param {BaseQuestionDefinition} question 対象の設問
   * @param {ItemDefinition} item 対象のItem
   */
  findItemElement(question, item) {
    const outputDefinition = question.getOutputDefinitionsFromItem(item).get(0);
    return findElementsByOutputDefinitions(outputDefinition).parents(`.${this.itemClass}`);
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
        const $li = this.findItemElement(question, item);
        if ($li.length === 0) return; // li要素がない場合はスキップ
        const className = item.calcVisibilityClassName(this.survey, this.runtime.getAnswers());
        $li.addClass(className);
      });
  }
}
