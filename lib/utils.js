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

/** parseIntのwrapper。NaNだった場合にはdefaultValueを返す */
export function parseInteger(str, defaultValue = 0) {
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
}
