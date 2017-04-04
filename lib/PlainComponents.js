import $ from 'jquery';

/**
 * Reactを利用しないJavaScriptのコンポーネント
 * 
 * classを使用することで有効となるコンポーネントを格納する
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
export function defineSumRows(el) {
  $(el).on('change keyup', 'table.sdj-sum-rows input[type="number"]', (e) => {
    const $tr = $(e.target).parents('tr');
    const sumValue = $tr.find('input[type="number"]')
      .toArray()
      .reduce((prev, curr) => prev + (parseInt(curr.value, 10) || 0), 0);
    const $sumEl = $tr.find('.sdj-sum');
    $sumEl.val(sumValue);
  });
}

/** tableの列合計クラスを定義 */
export function defineSumCols(el) {
  $(el).on('change keyup', 'table.sdj-sum-columns input[type="number"]', (e) => {
    const $target = $(e.target);
    const $targetTd = $target.parents('td');
    const $targetTr = $target.parents('tr');
    const $targetTbody = $target.parents('tbody');
    const index = $targetTr.find('td').index($targetTd);
    const sumValue = $targetTbody.find(`tr td:nth-child(${index + 1}) input[type="number"]`)
      .toArray()
      .reduce((prev, curr) => prev + (parseInt(curr.value, 10) || 0), 0);
    const sumEl = $targetTbody.find('tr:last-child .sdj-sum')[index - 1];
    $(sumEl).val(sumValue);
  });
}

export function defineMatrixAdditionalInput(el) {
  function disabled($el, bool) {
    if (bool) {
      $el.parents('td').find('input.additional-input').addClass('disabled').attr('disabled', bool);
    } else {
      $el.parents('td').find('input.additional-input').removeClass('disabled').attr('disabled', bool);
    }
  }
  $(el).on('change', 'table.sdj-matrix input.matrix-value', (e) => {
    const $target = $(e.target);
    const $targetTable = $target.parents('table');
    disabled($targetTable.find('input.additional-input'), true);
    // チェックされている要素を活性化
    disabled($targetTable.find('.matrix-value:checked'), false);
  });
}
