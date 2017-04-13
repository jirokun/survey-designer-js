import $ from 'jquery';

/** 要素の有効無効を切り替える */
$.fn.disable = function disable(disabled) {
  this.prop('disabled', disabled);
  if (disabled) {
    this.addClass('disabled');
  } else {
    this.removeClass('disabled');
  }
};
