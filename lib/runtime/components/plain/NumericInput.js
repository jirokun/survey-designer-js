import $ from 'jquery';

/**
 * 数値の全角入力を半角に変換するクラス
 *
 * 有効となる条件
 * inputにclass="sdj-numeric"
 */
export default class NumericInput {
  constructor(el) {
    this.el = el;
  }

  init() {
    $(this.el).on('change', '.sdj-numeric', (e) => {
      const value = $(e.target).val();
      const hankakuValue = value.replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
      $(e.target).val(hankakuValue);
    });
  }
}
