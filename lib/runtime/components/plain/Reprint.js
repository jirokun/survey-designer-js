import $ from 'jquery';
import 'mutationobserver-shim';
import { parseInteger, zenkakuNum2Hankaku } from '../../../utils';

/**
 * 再掲機能
 * 再掲機能の種類には2種類ある
 *
 * 1. 現在ページよりも前のページに有る回答値
 *    ページロード時に再掲のspanタグに対して値を設定する
 *
 * 2. 現在ページの回答値
 *    参照している回答の値の変更イベントを検知し、spanタグに対して値を設定する
 *
 * 再掲示のデフォルト値は下記の通り
 *    数値: 0
 *    その他: 空文字
 * 再掲の表示時の値
 *    数値: 数値が正しくない場合0、正しい場合はその数値
 *    文字列: 入力した文字列
 *    チェックボックス・ラジオ・セレクト: 選択しているチェックボックスの文字列、選択していない場合は空文字
 */
export default class Reprint {
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
  referenceElementChangeObserver($target, referenceOutputDefinition, e) {
    this.updateTargetElementForCurrentPageReference($target, e.target, referenceOutputDefinition);
  }

  /** 要素のvalueをoutputDeinitionの情報を基に正規化して返す */
  normalizeValue(el, outputDefinition) {
    const outputType = outputDefinition.getOutputType();

    if (outputType === 'checkbox') { // checkboxの場合無条件にラベルを返す
      return outputDefinition.getLabel();
    }

    // disabledの場合
    if ($(el).prop('disabled')) {
      if (outputType === 'number') return '0';
      return '';
    }

    // データの種類によってanswerを変更する
    if (outputDefinition.isOutputTypeSingleChoice()) { // radio, selectの場合
      const choices = outputDefinition.getChoices();
      const selectedChoice = choices.find(choice => choice.getValue() === el.value);
      if (selectedChoice) return selectedChoice.getLabel();
      return '';
    } else if (outputType === 'number') { // numberの場合
      const hankakuNumberStr = zenkakuNum2Hankaku(el.value);
      return `${parseInteger(hankakuNumberStr, 0)}` === hankakuNumberStr ? hankakuNumberStr : '0';
    }

    // text, textareaの場合
    return el.value;
  }

  /**
   * 参照する要素が変更された場合に実行される。
   */
  updateTargetElementForCurrentPageReference($target, referenceEl, referenceOutputDefinition) {
    const answer = this.normalizeValue(referenceEl, referenceOutputDefinition);
    this.replaceSpanText($target, answer);
  }

  /** ロジック変数が参照する要素のchangeイベントオブザーバ */
  referenceLogicalVariableChangeObserver($target, logicalVariable, e) {
    this.updateTargetElementForLogicalVariable($target, logicalVariable, e.target);
  }

  /**
   * ロジック変数が参照する要素のいずれかが変更された場合に実行される。
   * ロジック変数を評価し、評価した値をparsleyの属性に設定する。
   */
  updateTargetElementForLogicalVariable($target, logicalVariable) {
    const code = logicalVariable.createFunctionCode(this.survey, this.page);
    const func = new Function('answers', code);
    const value = func(this.runtime.getAnswers().toJS());
    $target.text(value);
  }

  /** 参照している要素へイベントを登録する */
  attachEventForReferenceElement(referenceOutputDefinition, $target) {
    const referenceName = referenceOutputDefinition.getName();
    const query = `*[name="${referenceName}"]`;

    // 値が変更されたときのイベントを割り当て
    $(this.el).on('change', query, this.referenceElementChangeObserver.bind(this, $target, referenceOutputDefinition));

    // disabled属性の変更イベントの割当
    const referenceEl = $(this.el).find(query)[0];
    const mutationObserver = new MutationObserver((mutationRecords) => {
      // disabledが変更されていなければ何もしない
      if (!mutationRecords.find(record => record.attributeName === 'disabled')) return;
      this.updateTargetElementForCurrentPageReference($target, referenceEl, referenceOutputDefinition);
    });
    mutationObserver.observe(referenceEl, { attributes: true });
    // 後処理できるようにインスタンスを保存しておく
    this.observers.push(mutationObserver);
  }

  /** ロジック変数が参照している要素へイベントを登録する */
  attachEventForLogicalVariable(logicalVariableOutputDefinition, $target) {
    // OutputDefinitionのidとLogicalVariableのIDは同一
    const logicalVariable = this.page.getLogicalVariables().find(lv => lv.getId() === logicalVariableOutputDefinition.getId());
    logicalVariable
      .getOperands()
      .filter(operand => this.isOutputDefinitionsInCurrentPage(operand)) // 現在のページにある値のoperandのみに絞込する
      .map(operand => this.outputDefinitionInPage.find(od => od.getId() === operand)) // OutputDefinitionに変換
      .forEach((od) => { // ロジック変数が参照している同じページ内にある要素が出力するOutputDefinition毎に処理
        const query = `*[name=${od.getName()}]`;
        // 値が変更されたときのイベントを割り当て
        $(this.el).on('change', query, this.referenceLogicalVariableChangeObserver.bind(this, $target, logicalVariable));

        // disabled属性の変更イベントの割当
        const referenceEl = $(this.el).find(query)[0];
        const mutationObserver = new MutationObserver((mutationRecords) => {
          // disabledが変更されていなければ何もしない
          if (!mutationRecords.find(record => record.attributeName === 'disabled')) return;
          this.updateTargetElementForLogicalVariable($target, logicalVariable, referenceEl);
        });
        mutationObserver.observe(referenceEl, { attributes: true });
        // 後処理できるようにインスタンスを保存しておく
        this.observers.push(mutationObserver);
      });
  }

  /**
   * 対象となる$targetのspanタグの内容をanswerで書き換える
   * どこで書き換えているかをわかりやすくするためにメソッド化
   */
  replaceSpanText($target, answer) {
    $target.text(answer);
  }

  /** 詳細プレビュー用の表示にspanタグの内容を書き換える */
  replaceForDetail($target) {
    const outputDefinitionId = $target.data('reprint');
    const outputDefinition = this.survey.findOutputDefinition(outputDefinitionId);
    // 静的に設定されているHTMLがあるが、自由なレイアウトでOutputNoがずれる可能性があるのでreprint属性を使って再描画
    $target.text(`再掲 ${outputDefinition.getOutputNo()}`);
  }

  /** 初期化 */
  initialize() {
    $(this.el).find('.answer-value[data-reprint]').each((i, target) => {
      const $target = $(target);
      const outputDefinitionId = $target.data('reprint');
      const outputDefinition = this.survey.findOutputDefinition(outputDefinitionId);

      if (this.isOutputDefinitionsInCurrentPage(outputDefinitionId)) {
        // 現在ページの回答値
        if (outputDefinition.isLogicalVariableOutputDefinition()) {
          // ロジック変数の場合、参照先の要素いずれかが変更されたときにバリデーションの属性を更新する処理を入れる
          this.attachEventForLogicalVariable(outputDefinition, $target);
        } else {
          // 回答値の場合、参照先の値が書き換わったときにバリデーションの属性を更新する処理を入れる
          this.attachEventForReferenceElement(outputDefinition, $target);
        }
        if (outputDefinition.getOutputType() === 'number') {
          // 数値の場合、初期描画時には0で初期化する。
          this.replaceSpanText($target, '0');
        } else if (outputDefinition.getOutputType() === 'checkbox') {
          // チェックボックスの場合、初期描画時にはラベルで初期化する。
          this.replaceSpanText($target, outputDefinition.getLabel());
        } else {
          // それ以外の場合、初期描画時には空文字で初期化する。
          this.replaceSpanText($target, '');
        }
      } else {
        // 現在ページよりも前のページに有る回答値
        const answers = this.runtime.getAnswers();
        const answer = answers.get(outputDefinition.getName());
        if (outputDefinition.isOutputTypeSingleChoice()) {
          const choice = outputDefinition.getChoices().find(c => c.getValue() === answer);
          this.replaceSpanText($target, choice ? choice.getLabel() : '');
        } else if (outputDefinition.getOutputType() === 'checkbox') {
          const label = outputDefinition.getLabel();
          this.replaceSpanText($target, label);
        } else {
          this.replaceSpanText($target, answer === undefined ? '' : answer);
        }
      }
    });
  }

  /** 後処理 */
  deInitialize() {
    // MutationObserverの後処理
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
  }

  /** 詳細プレビュー用の表示 */
  initForDetail() {
    $(this.el).find('.answer-value[data-reprint]').each((i, target) => {
      this.replaceForDetail($(target));
    });
  }
}
