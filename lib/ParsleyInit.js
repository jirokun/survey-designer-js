import $ from 'jquery';
import Parsley from 'parsleyjs';

/**
 * Parsleyの初期化を行う
 * validationが失敗したときにはtooltipsterでツールチップを表示するように設定する
 */
export default function ParsleyInit() {
  function findTooltipEl(fieldInstance) {
    const $el = fieldInstance.$element;
    const classHandler = $el.data('parsley-class-handler');
    return classHandler ? $(classHandler) : $el;
  }

  // validationでerrorとなったときのイベントハンドラ
  Parsley.on('field:error', (fieldInstance) => {
    const content = fieldInstance.getErrorsMessages().join(';');
    const $el = findTooltipEl(fieldInstance);
    if (!$el.hasClass('tooltipstered')) {
      $el.tooltipster({
        trigger: 'custom',
        contentAsHTML: true,
        functionReady: (tooltipster, arg) => {
          $(arg.tooltip).on('click', '.tooltip-close', () => {
            $(arg.origin).tooltipster('close');
          });
        },
      });
    }
    const wrapper = $(`<div class="tooltip-wrapper"><button class="tooltip-close">x</button>${content}</div>`);
    $el.tooltipster('content', wrapper);
    $el.tooltipster('open');
  });

  // validationでsuccessとなったときのイベントハンドラ
  Parsley.on('field:success', (fieldInstance) => {
    const $el = findTooltipEl(fieldInstance);
    if (!$el.hasClass('tooltipstered')) return;
    $el.tooltipster('close');
  });

  // errorとなったときに付与するclass名を指定
  Parsley.options.errorClass = 'err';
}
