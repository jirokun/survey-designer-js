import $ from 'jquery';
import 'mutationobserver-shim';
import { EXCLUDED_OPTION } from '../../../constants/parsleyConstants';

/** オペレータとparsley validatorとのマッピング */
const OPERATOR_MAP = {
  '==': 'data-parsley-eq',
  '!=': 'data-parsley-ne',
  '<=': 'data-parsley-lte',
  '>=': 'data-parsley-gte',
  '<': 'data-parsley-lt',
  '>': 'data-parsley-gt',
};

/**
 * 数値のバリデーションをNumberValidationRuleに従って割り当てる
 * バリデーションの種類には3種類ある
 *
 * 1. 固定値
 *    ページロード時にparsleyの属性をNumberValidationの定義に従って設定する
 *    NumberValidationの定義
 *    例:
 *      value = 32
 *      operator = '<='
 *    出力: data-parsley-lte="32"
 *
 * 2. 回答値（現在ページよりも前のページに有る回答値）
 *    ページロード時にparsleyの属性をNumberValidationの定義と回答値に従って設定する
 *    例:
 *      value = '{{cj6ooegda00123k68v3a3zlb2.answer}}'
 *      operator = '<='
 *    出力: data-parsley-lte="32"
 *
 * 3. 回答値（現在ページの回答値）
 *    参照している回答の値の変更イベントを検知し、parsleyの属性を書き換える
 *    例:
 *      value = '{{cj6ooegda00123k68v3a3zlb2.answer}}'
 *      operator = '<='
 *    出力: (回答値を32に変更とき) data-parsley-lte="32"
 *         (回答値を43に変更とき) data-parsley-lte="43"
 */
export default class NumberValidation {
  constructor(el, survey, page = null, runtime = null) {
    this.el = el;
    this.survey = survey;
    this.runtime = runtime;
    this.page = page;
    if (page) this.outputDefinitionInPage = page.getOutputDefinitionsFromThisPage(survey); // 現在のページにあるOutputDefinitionのリスト
    this.observers = []; // MutationObserverのインスタンスを格納する配列
  }

  /** outputDefinitionIdが現在のページに有るかどうかを検証する */
  isOutputDefinitionsInCurrentPage(outputDefinitionId) {
    return !!this.outputDefinitionInPage.find(od => od.getId() === outputDefinitionId);
  }

  /** 参照している回答の値が現在のページのものの場合、 */
  referenceElementChangeObserver(targetName, numberValidation, e) {
    this.updateTargetElementParsleyAttribute(targetName, numberValidation, e.target);
  }

  /**
   * 参照する要素が変更された場合に実行される。
   * 参照する要素の値をparsleyの属性に設定する。
   */
  updateTargetElementParsleyAttribute(targetName, numberValidation, referenceEl) {
    const value = referenceEl.value;
    const operator = numberValidation.getOperator();
    const $target = $(`*[name="${targetName}"]`);
    if ($(referenceEl).prop('disabled')) {
      const parsleyField = $target.removeAttr(OPERATOR_MAP[operator], value).parsley();
      parsleyField.validate();
    } else {
      const parsleyField = $target.attr(OPERATOR_MAP[operator], value).parsley();
      // 対象でなければvalidateしない
      if ($target.is(EXCLUDED_OPTION)) return;
      parsleyField.validate();
    }
  }

  /** ロジック変数が参照する要素のchangeイベントオブザーバ */
  referenceLogicalVariableChangeObserver(targetName, numberValidation, logicalVariable, e) {
    this.updateTargetElementParsleyAttributeForLogicalVariable(targetName, numberValidation, logicalVariable, e.target);
  }

  /**
   * ロジック変数が参照する要素のいずれかが変更された場合に実行される。
   * ロジック変数を評価し、評価した値をparsleyの属性に設定する。
   */
  updateTargetElementParsleyAttributeForLogicalVariable(targetName, numberValidation, logicalVariable) {
    const code = logicalVariable.createFunctionCode(this.survey, this.page);
    const func = new Function('answers', code);
    const value = func(this.runtime.getAnswers().toJS());
    const operator = numberValidation.getOperator();
    const $target = $(`*[name="${targetName}"]`);
    const parsleyField = $target.attr(OPERATOR_MAP[operator], value).parsley();
    // 対象でなければvalidateしない
    if ($target.is(EXCLUDED_OPTION)) return;
    parsleyField.validate();
  }

  /** 参照している要素へイベントを登録する */
  attachEventForReferenceElement(referenceOutputDefinition, targetName, numberValidation) {
    const referenceName = referenceOutputDefinition.getName();
    const query = `*[name="${referenceName}"]`;

    // 値が変更されたときのイベントを割り当て
    $(this.el).on('change', query, this.referenceElementChangeObserver.bind(this, targetName, numberValidation));

    // disabled属性の変更イベントの割当
    const referenceEl = $(this.el).find(query)[0];
    const mutationObserver = new MutationObserver((mutationRecords) => {
      // disabledが変更されていなければ何もしない
      if (!mutationRecords.find(record => record.attributeName === 'disabled')) return;
      this.updateTargetElementParsleyAttribute(targetName, numberValidation, referenceEl);
    });
    mutationObserver.observe(referenceEl, { attributes: true });
    // 後処理できるようにインスタンスを保存しておく
    this.observers.push(mutationObserver);
  }

  /** ロジック変数が参照している要素へイベントを登録する */
  attachEventForLogicalVariable(logicalVariableOutputDefinition, targetName, numberValidation) {
    // OutputDefinitionのidとLogicalVariableのIDは同一
    const logicalVariable = this.page.getLogicalVariables().find(lv => lv.getId() === logicalVariableOutputDefinition.getId());
    logicalVariable
      .getOperands()
      .filter(operand => this.isOutputDefinitionsInCurrentPage(operand)) // 現在のページにある値のoperandのみに絞込する
      .map(operand => this.outputDefinitionInPage.find(od => od.getId() === operand)) // OutputDefinitionに変換
      .forEach((od) => { // ロジック変数が参照している同じページ内にある要素が出力するOutputDefinition毎に処理
        const query = `*[name=${od.getName()}]`;
        // 値が変更されたときのイベントを割り当て
        $(this.el).on('change', query, this.referenceLogicalVariableChangeObserver.bind(this, targetName, numberValidation, logicalVariable));

        // disabled属性の変更イベントの割当
        const referenceEl = $(this.el).find(query)[0];
        const mutationObserver = new MutationObserver((mutationRecords) => {
          // disabledが変更されていなければ何もしない
          if (!mutationRecords.find(record => record.attributeName === 'disabled')) return;
          this.updateTargetElementParsleyAttributeForLogicalVariable(targetName, numberValidation, logicalVariable, referenceEl);
        });
        mutationObserver.observe(referenceEl, { attributes: true });
        // 後処理できるようにインスタンスを保存しておく
        this.observers.push(mutationObserver);
      });
  }

  /**
   * targetNameのエレメントにnumberValidationRuleで指定されているバリデータを割り当てる
   */
  attachParsleyValidator(targetName, numberValidationRule) {
    const numberValidations = numberValidationRule.getNumberValidations();
    const replacer = this.survey.getReplacer();

    // numberValition毎に処理
    numberValidations.forEach((numberValidation) => {
      let value = numberValidation.getValue();
      const operator = numberValidation.getOperator();
      if (replacer.containsReferenceIdIn(value)) {
        // 回答値の場合
        const referenceValues = replacer.findReferenceOutputDefinitionsIn(value);
        if (referenceValues.length === 0) return; // 万が一参照先の値がなければ何もしない

        const referenceOutputDefinition = referenceValues[0];
        if (this.isOutputDefinitionsInCurrentPage(referenceOutputDefinition.getId())) {
          // 現在のページのOutputDefinitionの場合
          if (referenceOutputDefinition.isLogicalVariableOutputDefinition()) {
            // ロジック変数の場合、参照先の要素いずれかが変更されたときにバリデーションの属性を更新する処理を入れる
            this.attachEventForLogicalVariable(referenceOutputDefinition, targetName, numberValidation);
          } else {
            // 回答値の場合、参照先の値が書き換わったときにバリデーションの属性を更新する処理を入れる
            this.attachEventForReferenceElement(referenceOutputDefinition, targetName, numberValidation);
          }
        }
        // 過去ページの回答値の場合は回答データから値を取得してバリデーションの属性を付与する
        value = this.runtime.getAnswers().get(referenceOutputDefinition.getName());
        $(`*[name="${targetName}"]`).attr(OPERATOR_MAP[operator], value);
      } else {
        // 固定値の場合は単純にバリデーションの属性を付与する
        $(`*[name="${targetName}"]`).attr(OPERATOR_MAP[operator], value);
      }
    });
  }

  /** 詳細表示用に数値制限タイプのspanタグを表示する */
  showValidationType(outputDefinition, numberValidationRule) {
    const name = outputDefinition.getName();
    $('<span/>').addClass('number-validation-type').text(`数値制限${numberValidationRule.getValidationTypeInQuestion()}`).insertAfter(`*[name="${name}"]`);
  }

  /** 初期化 */
  initialize() {
    // Pageに含まれているQuestionのNumberValidationDefinitionRuleごとにループ
    this.page.getQuestions().forEach((question) => {
      const nvrm = question.getNumberValidationRuleMap();
      const outputDefinitions = question.getOutputDefinitions();
      nvrm.keySeq().forEach((outputDefinitionId) => {
        const outputDefinition = outputDefinitions.find(od => od.getId() === outputDefinitionId);
        this.attachParsleyValidator(outputDefinition.getName(), nvrm.get(outputDefinitionId).get(0));
      });
    });
  }

  /** 後処理 */
  deInitialize() {
    // MutationObserverの後処理
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
  }

  initForDetail() {
    // surveyに定義されているNumberValidationDefinitionRuleごとにループ */
    this.survey.getPages().flatMap(page => page.getQuestions()).forEach((question) => {
      const nvrm = question.getNumberValidationRuleMap();
      const outputDefinitions = question.getOutputDefinitions();
      nvrm.keySeq().forEach((outputDefinitionId) => {
        const outputDefinition = outputDefinitions.find(od => od.getId() === outputDefinitionId);
        this.showValidationType(outputDefinition, nvrm.get(outputDefinitionId).get(0));
      });
    });
  }
}
