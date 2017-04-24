import $ from 'jquery';
import './jquery.plugins';
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
function attachNumericInput(el) {
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
 * tableの最後の行に <input type="text" class="sdj-sum" readonly />
 */
function attachMatrixSumRows(el) {
  $(el).on('change keyup', 'table.sdj-sum-rows input.sdj-numeric', (e) => {
    console.log(e);
    const $tr = $(e.target).parents('tr');
    const sumValue = $tr.find('input.sdj-numeric:not([readonly])')
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
 * テーブルの最後の列に <input type="text" class="sdj-sum" readonly />
 */
function attachMatrixSumCols(el) {
  $(el).on('change keyup', 'table.sdj-sum-columns input.sdj-numeric', (e) => {
    const $target = $(e.target);
    const $targetTd = $target.parents('td');
    const $targetTr = $target.parents('tr');
    const $targetTbody = $target.parents('tbody');
    const index = $targetTr.find('td').index($targetTd);
    const sumValue = $targetTbody.find(`tr td:nth-child(${index + 1}) input.sdj-numeric:not([readonly])`)
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
function attachMatrixAdditionalInput(el) {
  function updateDisabled($el, disabled) {
    if (disabled) {
      $el.parents('td').find('input.additional-input').disable(true);
    } else {
      $el.parents('td').find('input.additional-input').disable(false);
    }
  }
  $(el).on('change', 'table.sdj-matrix input.matrix-value', (e) => {
    const $target = $(e.target);
    const $targetTable = $target.parents('table');
    const $targetTbody = $target.parents('tbody');
    const $targetTr = $target.parents('tr');
    const $targetTd = $target.parents('td');
    // 行でグルーピングしている場合
    if ($targetTable.hasClass('sdj-group-rows')) {
      updateDisabled($targetTr.find('input.additional-input'), true);
      updateDisabled($targetTr.find('.matrix-value:checked'), false);
    // 列でグルーピングしている場合
    } else if ($targetTable.hasClass('sdj-group-columns')) {
      const index = $targetTr.find('td').index($targetTd);
      updateDisabled($targetTbody.find(`td:nth-child(${index + 1}) .matrix-value`), true);
      updateDisabled($targetTbody.find(`td:nth-child(${index + 1}) .matrix-value:checked`), false);
    } else {
      throw new Error('sdj-group-rowsまたはsdj-group-columnsがtableに指定されていません');
    }
  });
  $(el).on('click', 'table.sdj-matrix input.additional-input', (e) => {
    // iosでadditional-inputへのクリックがcheckboxやradioのクリックと判定されてしまう件への対処
    e.preventDefault();
  });
}

/**
 * matrixのcheckbox排他制御を定義する
 *
 * 有効となる条件
 * tableにclass="sdj-matrix"
 * 排他となるcheckboxにclass="exclusive"
 * グルーピングの方向はtableにsdj-group-rowsまたはsdj-group-columnsを付与する
 */
function attachMatrixExclusiveCheckbox(el) {
  $(el).on('change', 'table.sdj-matrix input[type="checkbox"].exclusive', (e) => {
    const $target = $(e.target);
    const $targetTable = $target.parents('table');
    const checked = $target.prop('checked');
    const $targetTbody = $target.parents('tbody');
    const $targetTr = $target.parents('tr');
    const $targetTd = $target.parents('td');

    // 行でグルーピングしている場合
    if ($targetTable.hasClass('sdj-group-rows')) {
      $targetTr.find('input[type="checkbox"]').each((i, checkboxEl) => {
        if (checkboxEl === e.target) return;
        $(checkboxEl).disable(checked);
      });
    // 列でグルーピングしている場合
    } else if ($targetTable.hasClass('sdj-group-columns')) {
      const index = $targetTr.find('td').index($targetTd);
      $targetTbody.find(`td:nth-child(${index + 1}) input[type="checkbox"]`).each((i, checkboxEl) => {
        if (checkboxEl === e.target) return;
        $(checkboxEl).disable(checked);
      });
    } else {
      throw new Error('sdj-group-rowsまたはsdj-group-columnsがtableに指定されていません');
    }
  });
}

/**
 * 日程の動作を定義する
 *
 * class="sdj-schedule"を定義する
 */
function attachSchedule(el) {
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
        $allCheckboxes.disable(true);
        $allInputTexts.disable(true);
        $targetCheckbox.disable(false);
        $targetInputTexts.disable(false);
      } else {
        $targetInputTexts.disable(true);
        $allCheckboxes.disable(false);
      }
    } else {
      if (checked) {
        $targetInputTexts.disable(false);
      } else {
        $targetInputTexts.disable(true);
      }
    }
  });
}

/**
 * すべてのコンポーネントを登録する
 */
export default function plainComponents(el) {
  attachNumericInput(el);
  attachMatrixSumCols(el);
  attachMatrixSumRows(el);
  attachMatrixAdditionalInput(el);
  attachMatrixExclusiveCheckbox(el);
  attachSchedule(el);
}
