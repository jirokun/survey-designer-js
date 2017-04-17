import $ from 'jquery';
import Parsley from 'parsleyjs';
import { isSP } from './utils';

const ERROR_CLASS = 'err';

/** PC画面でのParsleyCallback */
class PCParsleyCallback {
  static findTooltipEl(fieldInstance) {
    const $el = fieldInstance.$element;
    const classHandler = $el.data('parsley-class-handler');
    return classHandler ? $(classHandler) : $el;
  }

  /** error時のコールバック */
  static onError(fieldInstance) {
    const content = fieldInstance.getErrorsMessages().join(';');
    const $el = PCParsleyCallback.findTooltipEl(fieldInstance);
    if (!$el.hasClass('tooltipstered')) {
      $el.tooltipster({
        trigger: 'hover',
        contentAsHTML: true,
        timer: 3000,
        side: ['top'],
        functionBefore: () => $el.hasClass(ERROR_CLASS), // errがなければ表示しない
        functionReady: (tooltipster, arg) => {
          $(arg.tooltip).on('click', '.tooltip-close', () => {
            $(arg.origin).tooltipster('close');
          });
        },
        functionPosition: (instance, helper, position) => {
          position.coord.left = helper.geo.origin.offset.right - 50; // 要素の右から50pxにtooltipを表示する
          return position;
        },
      });
    }
    const wrapper = $(`<div class="tooltip-wrapper"><button class="tooltip-close">x</button>${content}</div>`);
    $el.tooltipster('content', wrapper);
    $el.tooltipster('open');
  }

  /** success時のコールバック */
  static onSuccess(fieldInstance) {
    const $el = PCParsleyCallback.findTooltipEl(fieldInstance);
    if (!$el.hasClass('tooltipstered')) return;

    // エラーの要素がなければツールチップを消す
    if ($el.has(`.${ERROR_CLASS}`).length === 0) $el.tooltipster('close');
  }

  /** Preview画面用にPCとSPで切り替えたときの処理 */
  static destroy(el) {
    $(el).find('.tooltipstered').tooltipster('close').tooltipster('destroy');
  }
}

/** SP画面でのParsleyCallback */
class SPParseleyCallback {
  /** error時のコールバック */
  static onError(fieldInstance) {
    const $el = fieldInstance.$element;
    SPParseleyCallback.removeErrorContainer($el);
    const messages = fieldInstance.getErrorsMessages().map(message => `<li>${message}</li>`);
    const errorList = $('<ul class="formErrorMsg formErrorContent"/>').append(messages);
    const errorContainer = $('<div class="formError fixed"/>').append(errorList);
    SPParseleyCallback.findErrorTargetElement($el).before(errorContainer);
  }

  /** success時のコールバック */
  static onSuccess(fieldInstance) {
    const $el = fieldInstance.$element;
    SPParseleyCallback.removeErrorContainer($el);
  }

  /** エラー対象の要素を取得する */
  static findErrorTargetElement($el) {
    // parsley-class-handlerが指定されていればその要素を返す
    const classHandler = $el.data('parsley-class-handler');
    if (classHandler) return $el.parents(classHandler);
    // 指定されていない場合は要素自体を返す
    return $el;
  }

  static removeErrorContainer($el) {
    const $errorTargetEl = SPParseleyCallback.findErrorTargetElement($el);
    if ($errorTargetEl.prev().hasClass('formError')) $errorTargetEl.prev().remove();
  }

  /** Preview画面用にPCとSPで切り替えたときの処理 */
  static destroy(el) {
    $(el).find('.formError').remove();
  }
}

/**
 * Parsleyの初期化を行う
 * validationが失敗したときにはtooltipsterでツールチップを表示するように設定する
 */
export default class ParsleyWrapper {
  static addCustomValidator() {
    Parsley.addValidator('equal', {
      requirementType: 'integer',
      validateNumber: (value, requirement) => value === requirement,
      messages: {
        ja: '%sになるように入力してください',
      },
    });
  }

  constructor(el) {
    this.el = el;
    // validationでerrorとなったときのイベントハンドラ
    Parsley.on('field:error', (fieldInstance) => {
      if (isSP()) SPParseleyCallback.onError(fieldInstance);
      else PCParsleyCallback.onError(fieldInstance);
    });

    // validationでsuccessとなったときのイベントハンドラ
    Parsley.on('field:success', (fieldInstance) => {
      if (isSP()) SPParseleyCallback.onSuccess(fieldInstance);
      else PCParsleyCallback.onSuccess(fieldInstance);
    });

    // errorとなったときに付与するclass名を指定
    Parsley.options.errorClass = ERROR_CLASS;
    ParsleyWrapper.addCustomValidator();
  }

  /** Preview画面用にPCとSPで切り替えたときの処理 */
  destroy() {
    if (isSP()) SPParseleyCallback.destroy(this.el);
    else PCParsleyCallback.destroy(this.el);
  }
}
