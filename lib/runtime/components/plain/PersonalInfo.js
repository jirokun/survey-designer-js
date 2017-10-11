import $ from 'jquery';

/**
 * 日程の動作を定義する
 *
 * class="sdj-schedule"を定義する
 */
export default class PersonalInfo {
  constructor(el) {
    this.el = el;
  }

  initialize() {
    console.log('Loading PersonalInfo');
    $(this.el).on('change', '.js__question__personal-info__tel-optional', (e) => {
      console.log('任意の項目で変更がありました!');
      if (e.target.value) {
        console.log('値が存在します');
        // const activateTo = e.target.getAttribute('data-activate-to');
        // $(`*[data-activate-from=${activateTo}]`).each(el => console.log(el))
      } else {
        console.log('値が存在しません');
      }
    });

    // $(this.el).on('change', 'input='

    // $(this.el).on('change', 'table.sdj-schedule input[type="checkbox"]', (e) => {
    //   const checked = e.target.checked;
    //   const $targetCheckbox = $(e.target);
    //   const $targetTable = $targetCheckbox.parents('table.sdj-schedule');
    //   const $allCheckboxes = $targetTable.find('input[type="checkbox"]');
    //   const $allInputTexts = $targetTable.find('input[type="text"]');
    //   const $targetInputTexts = $targetCheckbox.parents('td').find('input[type="text"]');
    //   // 上記のいずれも都合がつかないをクリックした場合
    //   if ($targetCheckbox.hasClass('exclusion')) {
    //     // 一度クリア
    //     $allCheckboxes.each((i, checkboxEl) => { checkboxEl.checked = false; });
    //     $targetCheckbox[0].checked = checked;
    //
    //     if (checked) {
    //       $allCheckboxes.disable(true);
    //       $allInputTexts.disable(true);
    //       $targetCheckbox.disable(false);
    //       $targetInputTexts.disable(false);
    //     } else {
    //       $targetInputTexts.disable(true);
    //       $allCheckboxes.disable(false);
    //     }
    //   } else {
    //     if (checked) {
    //       $targetInputTexts.disable(false);
    //     } else {
    //       $targetInputTexts.disable(true);
    //     }
    //   }
    // });
  }

  deInitialize() {
  }
}
