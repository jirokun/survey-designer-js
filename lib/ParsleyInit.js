import $ from 'jquery';
import Parsley from 'parsleyjs';

export default function ParsleyInit() {
  function findTooltipEl(fieldInstance) {
    const $el = fieldInstance.$element;
    const classHandler = $el.data('parsley-class-handler');
    return classHandler ? $(classHandler) : $el;
  }

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
  Parsley.on('field:success', (fieldInstance) => {
    const $el = findTooltipEl(fieldInstance);
    if (!$el.hasClass('tooltipstered')) return;
    $el.tooltipster('close');
  });
  Parsley.options.errorClass = 'err';
}
