import $ from 'jquery';

/**
 * 日程の動作を定義する
 *
 * class="sdj-schedule"を定義する
 */
export default class Schedule {
  constructor(el) {
    this.el = el;
  }

  initialize() {
    $(this.el).on('change', 'table.sdj-schedule input[type="checkbox"]', (e) => {
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

  deInitialize() {
  }
}
