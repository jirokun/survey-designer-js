import $ from 'jquery';

/**
 * Reactを利用しないユーティリティ
 */

/** 数値の全角入力を半角に変換するクラスを定義 */
export function defineNumericInput(el) {
  $(el).on('change', '.sdj-numeric', (e) => {
    const value = $(e.target).val();
    const hankakuValue = value.replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
    $(e.target).val(hankakuValue);
  });
}
