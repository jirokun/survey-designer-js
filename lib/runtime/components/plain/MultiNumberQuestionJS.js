import S from 'string';
import $ from 'jquery';
import QuestionWithItemBaseJS from './QuestionWithItemBaseJS';
import { parseInteger, createQueryForOutputDefinition, findElementsByOutputDefinitions } from '../../../utils';

/**
 * MultiNumberQuestionのためのJS
 */
export default class MultiNumberQuestionJS extends QuestionWithItemBaseJS {
  constructor(el, survey, page, runtime) {
    super(el, survey, page, runtime, 'MultiNumber', 'multiNumberLine');
    this.observers = []; // MutationObserverのインスタンスを格納する配列
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
      .map(item => question.getOutputDefinitionFromItem(item)) // Itemに対応するOutputDefinitionを取得
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
    $(this.el).on('change', query, this.update.bind(this, question));

    // 数値が自動的に保管されたときのことを考えて、changeイベントだけではなくMutationObserverを使用する
    const additionalOutputDefinitions = question.getOutputDefinitionsOfAdditionlInput();
    additionalOutputDefinitions.map(od => findElementsByOutputDefinitions(od)[0]).forEach((el) => {
      const mutationObserver = new MutationObserver(this.update.bind(this, question));
      mutationObserver.observe(el, { attributes: true });
      this.observers.push(mutationObserver);
    });
  }

  /** 数値の活性非活性を追加入力の値によって切り替える */
  updateNumberInputByAdditionalInput(question) {
    question
      .getItems()
      .filter(item => item.hasAdditionalInput())
      .forEach((item) => {
        const itemOutputDefinition = question.getOutputDefinitionFromItem(item);
        const additionalOutputDefinition = question.getOutputDefinitionOfAdditionalInputFromItem(item);
        const disabled = S(findElementsByOutputDefinitions(additionalOutputDefinition).val()).isEmpty();
        findElementsByOutputDefinitions(itemOutputDefinition).disable(disabled);
      });
  }

  additionalInputControl(question) {
    this.updateNumberInputByAdditionalInput(question);
    const additionalOutputDefinitions = question.getOutputDefinitionsOfAdditionlInput();

    const query = additionalOutputDefinitions
      .map(od => createQueryForOutputDefinition(od))
      .join(',');
    $(this.el).on('change', query, this.update.bind(this, question));
    // 数値が自動的に保管されたときのことを考えて、changeイベントだけではなくMutationObserverを使用する
    additionalOutputDefinitions.map(od => findElementsByOutputDefinitions(od)[0]).forEach((el) => {
      const mutationObserver = new MutationObserver(this.update.bind(this, question));
      mutationObserver.observe(el, { attributes: true });
      this.observers.push(mutationObserver);
    });
  }

  /** ランダム固定の表示 */
  showRandomFixed(question) {
    question
      .getItems()
      .filter(item => item.isRandomFixed())
      .forEach((item) => {
        findElementsByOutputDefinitions(question.getOutputDefinitionFromItem(item).get(0)).after('<span class="detail-function">ランダム固定</span>');
      });
  }

  /** 表示の変更はすべてここで行う */
  update(question) {
    this.updateNumberInputByAdditionalInput(question);
    this.calcTotal(question);
  }

  initialize() {
    this.findQuestions().forEach((question) => {
      this.summarize(question);
      this.randomize(question);
      this.applyItemVisibility(question);
      this.additionalInputControl(question);      // 追加入力の制御
      this.update(question);
    });
  }

  initForDetail() {
    this.survey.getPages()
      .flatMap(page => page.getQuestions())
      .filter(question => question.getDataType() === 'MultiNumber')
      .forEach((question) => {
        this.showRandomFixed(question);                       // ランダム固定の表示
      });
  }

  deInitialize() {
    // MutationObserverの後処理
    this.observers.forEach(observer => observer.disconnect());
  }
}
