import $ from 'jquery';
import { parseInteger } from './utils';

/**
 * Reactを利用しないJavaScriptのコンポーネント
 * 
 * classを使用することで有効となるコンポーネントを定義する
 */

/**
 * 数値の全角入力を半角に変換するクラス
 *
 * 有効となる条件
 * inputにclass="sdj-numeric"
 */
export function attachNumericInput(el) {
  $(el).on('change', '.sdj-numeric', (e) => {
    const value = $(e.target).val();
    const hankakuValue = value.replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
    $(e.target).val(hankakuValue);
  });
}

/**
 * tableの行合計クラス
 *
 * 有効となる条件
 * tableにclass="sdj-sum-rows""
 * tableの最後の行に <input type="number" class="sdj-sum" readonly />
 */
export function attachSumRows(el) {
  $(el).on('change keyup', 'table.sdj-sum-rows input[type="number"]', (e) => {
    const $tr = $(e.target).parents('tr');
    const sumValue = $tr.find('input[type="number"]:not([readonly])')
      .toArray()
      .reduce((prev, curr) => prev + parseInteger(curr.value, 0), 0);
    const $sumEl = $tr.find('.sdj-sum');
    $sumEl.val(sumValue);
  });
}

/**
 * tableの列合計クラス
 *
 * 有効となる条件
 * tableにclass="sdj-sum-columns""
 * テーブルの最後の列に <input type="number" class="sdj-sum" readonly />
 */
export function attachSumCols(el) {
  $(el).on('change keyup', 'table.sdj-sum-columns input[type="number"]', (e) => {
    const $target = $(e.target);
    const $targetTd = $target.parents('td');
    const $targetTr = $target.parents('tr');
    const $targetTbody = $target.parents('tbody');
    const index = $targetTr.find('td').index($targetTd);
    const sumValue = $targetTbody.find(`tr td:nth-child(${index + 1}) input[type="number"]:not([readonly])`)
      .toArray()
      .reduce((prev, curr) => prev + parseInteger(curr.value, 0), 0);
    const sumEl = $targetTbody.find('tr:last-child .sdj-sum')[index - 1];
    $(sumEl).val(sumValue);
  });
}

/**
 * checkbox/radioのmatrixの追加入力を定義する.
 * 
 * 有効となる条件
 * tableにclass="sdj-matrix"
 * セル内にある追加入力を切り替えるチェックボックスにはclass="marix-value"
 * セル内にある追加入力のテキストはclass="additional-inoput"
 */
export function attachMatrixAdditionalInput(el) {
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

/**
 * 日程の動作を定義する
 *
 * class="sdj-schedule"を定義する
 */
export function attachSchedule(el) {
  $(el).on('change', 'table.sdj-schedule input[type="checkbox"]', (e) => {
    const checked = e.target.checked;
    const $targetCheckbox = $(e.target);
    const $targetTable = $targetCheckbox.parents('table.sdj-schedule');
    const $allCheckboxes = $targetTable.find('input[type="checkbox"]');
    const $allInputTexts = $targetTable.find('input[type="text"]');
    const $targetInputTexts = $targetCheckbox.parents('td').find('input[type="text"]');
    // 上記のいずれも都合がつかないをクリックした場合
    if ($targetCheckbox.hasClass('exclusion')) {
      // 一度クリア
      $allCheckboxes.each((i, checkboxEl) => { checkboxEl.checked = false; });
      $targetCheckbox[0].checked = checked;

      if (checked) {
        $allCheckboxes.attr('disabled', true);
        $allInputTexts.attr('disabled', true).addClass('disabled');
        $targetCheckbox.attr('disabled', false);
        $targetInputTexts.attr('disabled', false).removeClass('disabled');
      } else {
        $targetInputTexts.attr('disabled', true).addClass('disabled');
        $allCheckboxes.attr('disabled', false);
      }
    } else {
      if (checked) {
        $targetInputTexts.attr('disabled', false).removeClass('disabled');
      } else {
        $targetInputTexts.attr('disabled', true).addClass('disabled');
      }
    }
  });
}
