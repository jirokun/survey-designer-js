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

/** pageIdを参照しているflowを返す */
export function findFlowByPage(state, pageId) {
  return state.defs.flowDefs.filter(def => def.refId === pageId);
}
/** stateからcustom pageを探す */
export function findCustomPage(state, customPageId) {
  return state.defs.customPageDefs.find(def => def.id === customPageId);
}
/** stateからquestionを探す */
export function findQuestion(state, pageId, questionId) {
  const page = state.defs.pageDefs.find(def => def.id === pageId);
  return page.questions.find(q => q.id === questionId);
}
/** ページ番号とquestionの文字列から設問を取得する。例: P001_1_2 => ページP001, 設問番号1_2 */
export function findQuestionByStr(state, str) {
  const underbarIndex = str.indexOf('_');
  const pageId = str.substr(0, underbarIndex);
  const questionId = str.substr(underbarIndex + 1);
  return findQuestion(state, pageId, questionId);
}

/** stateからquestionIdに紐つくitemを探す */
export function findItems(state, questionId) {
  return state.defs.itemDefs.filter(def => def.questionId === questionId);
}
/** stateからitemIdに紐つくchoiceを探す */
export function findChoices(state, itemId) {
  return state.defs.choiceDefs.filter(def => def.itemId === itemId);
}

/** ユニークとなるflowIdを返す */
export function nextFlowId(state) {
  let i = 0;
  for (;;) {
    const nextId = `flow${i++}`;
    if (!findFlow(state, nextId)) {
      return nextId;
    }
  }
}

/** エラーメッセージ用のエレメントを返す */
export function errorMessage(msg) {
  return <h3 className="error-message">{msg}</h3>;
}
/** 次のIDを生成する */
export function generateNextId(state, type) {
  const num = (state.defs[`${type}Defs`].map(def => parseInt(def.id.substr(1), 10)).reduce((x, y) => x > y ? x : y) + 1).toString();
  let padding = '';
  for (let i = num.length; i < 3; i++) {
    padding += '0';
  }
  const prefix = type.substr(0, 1).toUpperCase();
  return `${prefix}${padding}${num}`;
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
