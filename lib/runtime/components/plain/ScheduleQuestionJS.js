import $ from 'jquery';
import { findElementsByOutputDefinitions } from '../../../utils';

/**
 * 日程の動作を定義する
 *
 * class="sdj-schedule"を定義する
 */
export default class ScheduleQuestionJS {
  constructor(el, survey, page, runtime) {
    this.el = el;
    this.survey = survey;
    this.page = page;
    this.runtime = runtime;
  }

  /** Matrix設問を取得する */
  findScheduleQuestions() {
    return this.page.getQuestions().filter(question => question.getDataType() === 'Schedule');
  }

  /**
   * itemに対応するtr要素を取得する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   * @param {ItemDefinition} item 対象となるItemDefinition
   */
  findTrElementFromItem(question, item) {
    return $(this.el).find(`#${item.getId()}`);
  }

  /**
   * subItemに対応するtd要素(0番目)のindexを取得する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   * @param {ItemDefinition} item 対象となるItemDefinition
   */
  findTdElementFromSubItem(question, subItem) {
    return $(this.el).find(`#${subItem.getId()}`);
  }

  /**
   * questionに対応する設問のtableを取得する
   *
   * @param {MatrixQuestionDefinition} question 設問のインスタンス
   */
  findTable(question) {
    return this.findTdElementFromSubItem(question, question.getSubItems().get(0)).parents('table');
  }

  applyItemVisibility(question) {
    // itemのvisibilityを適用
    question
      .getItems()
      .forEach((item) => {
        const $tr = this.findTrElementFromItem(question, item);
        if ($tr.length === 0) return; // tr要素がない場合はスキップ
        const className = item.calcVisibilityClassName(this.survey, this.runtime.getAnswers());
        $tr.addClass(className);
      });

    // 対象のtableを取得
    const $table = this.findTable(question);

    // 「上記のいずれも都合がつかない」の行のtrを取得しておく
    const $otherOutputDefinitionTr = $(this.el).find(`#${question.getId()}_other`);

    // subItemのvisibilityを適用
    question
      .getSubItems()
      .forEach((subItem) => {
        const $td = this.findTdElementFromSubItem(question, subItem);
        if ($td.length === 0) return; // td要素がない場合はスキップ
        const targetTdIndex = $td.parents('tr').find('td').index($td);
        const className = subItem.calcVisibilityClassName(this.survey, this.runtime.getAnswers());
        $table.find('>thead >tr, >tbody >tr').each((i, tr) => {
          // 「上記のいずれも都合がつかない」の行はhideしない
          if ($otherOutputDefinitionTr[0] === tr) return;
          const $tds = $(tr).find('>td');
          $($tds[targetTdIndex]).addClass(className);
        });
      });
  }

  findToggleCheckboxByOutputDefinitions(question, ...outputDefinitions) {
    return $(outputDefinitions.map(od => `#${question.getToggleCheckboxIdByOutputDefinition(od)}`).join(','));
  }

  updateFormDisabledStatus(question) {
    const outputDefinitions = question.getOutputDefinitions();
    const otherOutputDefinition = question.getOtherOutputDefinition();
    const outputDefinitionsWithoutOther = outputDefinitions.filter(od => otherOutputDefinition.getId() !== od.getId());

    const otherChecked = this.findToggleCheckboxByOutputDefinitions(question, otherOutputDefinition).prop('checked');
    if (otherChecked) {
      this.findToggleCheckboxByOutputDefinitions(question, ...outputDefinitionsWithoutOther).disable(true);   // チェックボックスはすべて押せないようにする
      findElementsByOutputDefinitions(...outputDefinitionsWithoutOther).disable(true);                // 入力値も無効にする
      findElementsByOutputDefinitions(otherOutputDefinition).disable(false);
    } else {
      this.findToggleCheckboxByOutputDefinitions(question, ...outputDefinitionsWithoutOther).disable(false);  // チェックボックスはすべて押せるようにする
      outputDefinitionsWithoutOther.forEach((od) => {
        const checkboxChecked = this.findToggleCheckboxByOutputDefinitions(question, od).prop('checked');
        findElementsByOutputDefinitions(od).disable(!checkboxChecked);
      });
      findElementsByOutputDefinitions(otherOutputDefinition).disable(true);
    }
  }

  createQueryForCheckboxesByOutputDefinitions(question, outputDefinitions) {
    return outputDefinitions.map(od => `#${question.getToggleCheckboxIdByOutputDefinition(od)}`).join(',');
  }

  applyCheckboxControl(question) {
    const $el = $(this.el);
    const outputDefinitions = question.getOutputDefinitions();
    const query = this.createQueryForCheckboxesByOutputDefinitions(question, outputDefinitions);
    $el.on('change', query, this.updateFormDisabledStatus.bind(this, question));
  }

  initialize() {
    // Matrix全て
    this.findScheduleQuestions().forEach((question) => {
      this.applyCheckboxControl(question);        // チェックボックスの制御を登録する
      this.applyItemVisibility(question);         // 項目の表示制御
    });
  }

  deInitialize() {
  }
}
