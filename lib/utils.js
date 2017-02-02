import React from 'react';

export function flatten(ary) {
  return ary.reduce((p, c) => Array.isArray(c) ? p.concat(flatten(c)) : p.concat(c), []);
}
export function isEmpty(str) {
  return str === null || str === undefined || str === '';
}
export function findParentByClassName(parentNode, className) {
  let node = parentNode;
  for (;;) {
    node = node.parentNode;
    if (!node) return null;
    if (node.classList.contains(className)) {
      return node;
    }
  }
}

/** エラーメッセージ用のエレメントを返す */
export function errorMessage(msg) {
  return <h3 className="error-message">{msg}</h3>;
}

/** 引数がstringかどうかを判定する */
export function isString(str) {
  return typeof (str) === 'string';
}
/** 再掲のための文字列置換を行う */
export function r(str, values) {
  let index = 0;
  let oldIndex;
  let isInVariable = false;
  let variableStartIndex;
  let variableEndIndex;
  let ret = '';
  if (!str) {
    return ret;
  }
  for (;;) {
    oldIndex = index;
    if (!isInVariable) {
      index = str.indexOf('${', index);
      if (index === -1) {
        ret += str.substring(oldIndex);
        break;
      }
      if (str[index - 1] === '\\') {
        ret += str.substring(oldIndex, index - 1);
        ret += str[index];
        index++;
      } else {
        ret += str.substring(oldIndex, index);
        isInVariable = true;
        variableStartIndex = index + 2;
        index++;
      }
    } else {
      index = str.indexOf('}', index);
      if (index === -1) {
        ret += str.substring(oldIndex);
        break;
      }
      if (str[index - 1] === '\\') {
        index++;
        ret += str.substring(oldIndex, index);
      } else {
        isInVariable = false;
        variableEndIndex = index;
        const variable = str.substring(variableStartIndex, variableEndIndex);
        try {
          const func = new Function('values', `return ${variable};`);
          ret += func(values);
        } catch (e) {
          ret += '<span style="color: red">invalid value</span>';
        }
        index++;
      }
    }
  }
  return ret;
}

export function isDescendant(parent, child) {
  let node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
