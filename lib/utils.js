/* eslint-env browser,jquery */
import $ from 'jquery';
import S from 'string';

/** class名にマッチする親の要素を探す */
export function findParentByClassName(parentNode, className) {
  let node = parentNode;
  for (;;) {
    node = node.parentNode;
    if (!node || !node.classList) return null;
    if (node.classList.contains(className)) {
      return node;
    }
  }
}

/** parseIntのwrapper。NaNだった場合にはdefaultValueを返す */
export function parseInteger(str, defaultValue = NaN) {
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
}

/** PC表示かSP表示かを判定する */
export function isSP() {
  const classList = document.body.classList;
  return classList.contains('m3-enquete__user-agent-group--SP') || classList.contains('m3-enquete__user-agent-group--APP');
}

/** data-dev-id をセットする */
export function setDevId(targetElement, survey) {
  $(targetElement).find('input, select, textarea').each((i, el) => {
    const $el = $(el);
    const name = $el.prop('name');
    const devId = survey.findOutputDevIdFromName(name);
    if (devId) {
      $el.attr('data-dev-id', devId);
    }
  });
}

/** data-output-noを表示する */
export function showOutputNo(targetElement) {
  $(targetElement).find('[data-output-no]').each((i, el) => {
    const $el = $(el);
    const outputNo = $el.prop('type') === 'radio' ? `${$el.data('outputNo')}(${$el.val()})` : $el.data('outputNo');
    const $insertEl = $('<span class="output-no" />').text(outputNo);
    $el.after($insertEl);
  });
}

/**
 * containerEl内にある表示されている有効なフォームエレメントを取得する
 *
 * ただし、readonly、disabledな要素は取得しない
 * selectの場合にはoptionが一つもない、または一つあるが値が空の場合には対象外とする
 */
export function findEnabledFormElement(containerEl) {
  return $(containerEl).find('input:visible,select:visible,textarea:visible').filter((index, el) => {
    if (el.readOnly || el.disabled) return false;
    if (el.tagName.toLowerCase() === 'select') {
      const options = el.getElementsByTagName('option');
      if (options.length === 0) return false;
      if (options.length === 1 && S(options.value).isEmpty()) return false;
    }
    return true;
  });
}

/**
 * trueまたはfalseかを返す
 * false, undefined, null, 0, '0', ''の場合にはfalseになる。
 * 回答データは文字列で扱うため、文字列の'0'もfalse扱いとする。
 */
export function booleanize(value) {
  return !!value && value !== '0';
}

export function isDevelopment() {
  return location.search.indexOf('env=development') >= 0;
}

/**
 * chromeでエラーになる不具合がある問題に対処
 * http://lealog.hateblo.jp/entry/2015/02/24/131643
 */
export function fixIphoneChromeBug() {
  window.__gCrWeb = window.__gCrWeb || {};
  window.__gCrWeb.autofill = window.__gCrWeb.autofill || {};
  window.__gCrWeb.autofill.extractForms = window.__gCrWeb.autofill.extractForms || function() {};
  window.__gCrWeb.innerSizeAsString = window.__gCrWeb.innerSizeAsString || function() {};
  window.__gCrWeb.getElementFromPoint = window.__gCrWeb.getElementFromPoint || function() {};
}
