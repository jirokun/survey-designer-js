/* eslint-env browser,jquery */
import $ from 'jquery';
import S from 'string';
import cuid from 'cuid';
import { Record, Map, Iterable } from 'immutable';

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
  $(targetElement).find('h2, input, select, textarea, .page-no').each((i, el) => {
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

/** data-dev-id, data-dev-id-labelを表示する */
export function showDevId(targetElement) {
  $(targetElement).find('[data-dev-id], [data-dev-id-label]').each((i, el) => {
    const $el = $(el);
    const devId = $el.data('dev-id') || $el.data('dev-id-label');
    const $insertEl = $('<span class="dev-id" />').text(devId);
    if ($el.prop('tagName') === 'H2' || $el.prop('tagName') === 'DIV') {
      $el.prepend($insertEl);
    } else {
      $el.after($insertEl);
    }
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
 * recordを複製します
 * 
 * ただし、_idは新しく採番し直します。
 * 必ずオブジェクトでくるむ必要があります
 */
export function cloneRecord(record) {
  // すべてのプロパティをトラバースする再起関数
  // 第二引数に_idのときだけ実行するコールバック関数を取る
  function traverseRecord(r, callback) {
    if (r === null || r === undefined) return r;

    if (Map.isMap(r) || r instanceof Record) {
      const keys = r.keySeq();
      let tmpRecord = r;
      for (let i = 0, len = keys.size; i < len; i++) {
        const key = keys.get(i);
        tmpRecord = callback(tmpRecord, key, tmpRecord.get(key), callback);
      }
      return tmpRecord;
    } else if (Iterable.isIterable(r)) {
      let tmpRecord = r;
      for (let i = 0, len = r.size; i < len; i++) {
        tmpRecord = tmpRecord.update(i, child => traverseRecord(child, callback));
      }
      return tmpRecord;
    }
    return r;
  }

  let idMapping = Map();
  // すべてのidを置換するとともに、新旧の対応表を作成する
  const idConvertedRecord = traverseRecord(record, (childRecord, key, value, callback) => {
    if (key === '_id') {
      const newId = cuid();
      idMapping = idMapping.set(value, newId);
      return childRecord.update(key, () => newId);
    }
    return childRecord.update(key, child => traverseRecord(child, callback));
  });

  // 書き換えたIDを参照している箇所があればすべて置き換える
  const oldKeySeq = idMapping.keySeq();
  return traverseRecord(idConvertedRecord, (childRecord, key, value, callback) => {
    if (typeof value === 'string' || value instanceof String) {
      let replacedStr = value;
      while (true) {
        const existsKey = oldKeySeq.find(k => replacedStr.indexOf(k) !== -1);
        if (existsKey) replacedStr = replacedStr.replace(existsKey, idMapping.get(existsKey));
        else break;
      }
      return childRecord.set(key, replacedStr);
    }
    return childRecord.update(key, child => traverseRecord(child, callback));
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
  window.__gCrWeb.autofill.extractForms = window.__gCrWeb.autofill.extractForms || function () {};
  window.__gCrWeb.innerSizeAsString = window.__gCrWeb.innerSizeAsString || function () {};
  window.__gCrWeb.getElementFromPoint = window.__gCrWeb.getElementFromPoint || function () {};
}
