import $ from 'jquery';

/** 要素の有効無効を切り替える */
$.fn.disable = function disable(disabled) {
  this.prop('disabled', disabled);
  if (disabled) {
    this.addClass('disabled');
    // すでにエラーが出ているものを消すためにfield:successをtriggerする
    const instances = this.parsley();
    if (Array.isArray(instances)) {
      instances.forEach((instance) => {
        instance.trigger('field:success');
      });
    } else {
      const instance = instances;
      instance.trigger('field:success');
    }
  } else {
    this.removeClass('disabled');
  }
};
