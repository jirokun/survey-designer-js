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

/** tableの行合計クラスを定義 */
export function defineSumCols(el) {
  $(el).on('change keyup', 'table.sdj-sum-cols', (e) => {
    const $tr = $(e.target).parents('tr');
    const sumValue = $tr.find('input[type="number"]')
      .toArray()
      .reduce((prev, curr) => prev + (parseInt(curr.value, 10) || 0), 0);
    const $sumEl = $tr.find('span.sdj-sum');
    $sumEl.text(sumValue);
    $sumEl.parents('td').find('input[type="hidden"]').val(sumValue);
  });
}

/** tableの列合計クラスを定義 */
export function defineSumRows(el) {
  $(el).on('change keyup', 'table.sdj-sum-rows', (e) => {
    const $target = $(e.target);
    const $targetTd = $target.parents('td');
    const $targetTr = $target.parents('tr');
    const $targetTbody = $target.parents('tbody');
    const index = $targetTr.find('td').index($targetTd);
    const sumValue = $targetTbody.find(`tr td:nth-child(${index + 1}) input[type="number"]`)
      .toArray()
      .reduce((prev, curr) => prev + (parseInt(curr.value, 10) || 0), 0);
    const sumEl = $targetTbody.find('tr:last-child span.sdj-sum')[index - 1];
    $(sumEl).text(sumValue);
    $(sumEl).parents('td').find('input[type="hidden"]').val(sumValue);
  });
}

