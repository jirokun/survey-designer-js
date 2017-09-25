import $ from 'jquery';
import { parseInteger } from '../../../utils';

/**
 * Matrixの動作を定義する
 */
export default class Matrix {
  constructor(el) {
    this.el = el;
  }

  initialize() {
    this.attachMatrixSumCols();
    this.attachMatrixSumRows();
    this.attachMatrixAdditionalInput();
    this.attachMatrixExclusiveCheckbox();
  }

  deInitialize() {
  }

  /**
   * tableの行合計クラス
   *
   * 有効となる条件
   * tableにclass="sdj-sum-rows""
   * tableの最後の行に <input type="text" class="sdj-sum" readonly />
   */
  attachMatrixSumRows() {
    $(this.el).on('change keyup', 'table.sdj-sum-rows input.sdj-numeric', (e) => {
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
  attachMatrixSumCols() {
    $(this.el).on('change keyup', 'table.sdj-sum-columns input.sdj-numeric', (e) => {
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
  attachMatrixAdditionalInput() {
    function updateDisabled($el, disabled) {
      if (disabled) {
        $el.parents('td').find('input.additional-input').disable(true);
      } else {
        $el.parents('td').find('input.additional-input').disable(false);
      }
    }

    $(this.el).on('change', 'table.sdj-matrix input.matrix-value', (e) => {
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

    $(this.el).on('click', 'table.sdj-matrix input.additional-input', (e) => {
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
  attachMatrixExclusiveCheckbox() {
    // この関数内の2箇所で使うため敢えてここで関数を定義
    // 入力値に応じてチェックボックスとadditional-inputのdisabledを切り替える
    function toggleChekboxAndAdditionalInput(event, checkboxEl) {
      if (checkboxEl === event.target) return;
      const checked = $(event.target).prop('checked');

      // 排他のチェックボックスをチェックした場合
      if (checked) {
        // checkboxElとadditional-inputをまとめて取得するためparentsを一度取得してからinputを検索する
        $(checkboxEl).parents('td').find('input').disable(true);
      } else {
        // まずcheckboxElをdisable解除
        $(checkboxEl).disable(false);

        // checkboxElがcheckされている場合、additional-inputもdisable解除
        const checkboxChecked = $(checkboxEl).prop('checked');
        if (checkboxChecked) {
          $(checkboxEl).parents('td').find('input.additional-input').disable(false);
        }
      }
    }

    $(this.el).on('change', 'table.sdj-matrix input[type="checkbox"].exclusive', (e) => {
      const $target = $(e.target);
      const $targetTable = $target.parents('table');
      const $targetTbody = $target.parents('tbody');
      const $targetTr = $target.parents('tr');
      const $targetTd = $target.parents('td');

      // 行でグルーピングしている場合
      if ($targetTable.hasClass('sdj-group-rows')) {
        $targetTr.find('input[type="checkbox"]').each((i, checkboxEl) => {
          toggleChekboxAndAdditionalInput(e, checkboxEl);
        });
      // 列でグルーピングしている場合
      } else if ($targetTable.hasClass('sdj-group-columns')) {
        const index = $targetTr.find('td').index($targetTd);
        $targetTbody.find(`td:nth-child(${index + 1}) input[type="checkbox"]`).each((i, checkboxEl) => {
          toggleChekboxAndAdditionalInput(e, checkboxEl);
        });
      } else {
        throw new Error('sdj-group-rowsまたはsdj-group-columnsがtableに指定されていません');
      }
    });
  }
}
