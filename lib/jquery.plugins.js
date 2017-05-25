import $ from 'jquery';

/**
 * jQuery extended functions
 */

/** 要素の有効無効を切り替える */
$.fn.disable = function disable(disabled) {
  if (this.length === 0) return this;
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
  return this;
};

/** 要素のoutputNoを取得する */
$.fn.no = function() {
    return $(this).data('output-no');
};

/**
 * jQuery selectors
 */
$.extend($.expr[':'], {
  /**
   * outputNoでセレクタを指定出来るようにする。
   * @example $(':no(1-1-1)')
   **/
  no: function(elem, idx, ags) {
    var regex = new RegExp('^' + ags[3] + '$');
    return regex.test($(elem).data('output-no'));
  },

  /**
   * qidでセレクタを指定出来るようにする。
   * @example $(':qid(1-1)')
   **/
  qid: function(elem, idx, ags) {
    var regex = new RegExp('^' + ags[3] + '-.+$');
    return regex.test($(elem).data('output-no'));
  },

  /**
   * valでセレクタを指定出来るようにする。（ラジオボタン、コンボボックス）
   * @example $(':val(1)')
   **/
  val: function(elem, idx, ags) {
    var regex = new RegExp('^' + ags[3] + '$');
    return (elem.type=='radio' || elem.tagName.toLowerCase()=='select') && regex.test(elem.value);
  }
});


