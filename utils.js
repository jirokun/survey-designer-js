import React from 'react'
export function flatten(ary) {
  return ary.reduce((p, c) => {
    return Array.isArray(c) ? p.concat(flatten(c)) : p.concat(c);
  }, []);
}
export function isEmpty(str) {
  return str === null || str === undefined || str === '';
}

/** stateからdraftを探す */
export function findDraft(state, id) {
  return state.defs.draftDefs.find((def) => def.id === id);
}
/** stateからflowを探す */
export function findFlow(state, flowId) {
  return state.defs.flowDefs.find((def) => def.id === flowId);
}
/** flowIdからpageIdを引く */
export function findPageFromFlow(state, flowId) {
  const flow = findFlow(state, flowId);
  if (!flow) {
    return null;
  }
  return findPage(state, flow.refId);
}
/** pageIdを参照しているflowを返す */
export function findFlowByPage(state, pageId) {
  return state.defs.flowDefs.filter((def) => def.refId === pageId);
}
/** stateからpageを探す */
export function findPage(state, pageId) {
  return state.defs.pageDefs.find((def) => def.id === pageId);
}
/** stateからcustom pageを探す */
export function findCustomPage(state, customPageId) {
  return state.defs.customPageDefs.find((def) => def.id === customPageId);
}
/** stateからquestionを探す */
export function findQuestion(state, pageId, questionId) {
  const page = state.defs.pageDefs.find((def) => def.id === pageId);
  return page.questions.find(q => q.id === questionId);
}
/** stateからquestionIdに紐つくitemを探す */
export function findItems(state, questionId) {
  return state.defs.itemDefs.filter((def) => def.questionId === questionId);
}
/** stateからitemIdに紐つくchoiceを探す */
export function findChoices(state, itemId) {
  return state.defs.choiceDefs.filter((def) => def.itemId === itemId);
}
/** stateからbranchを探す */
export function findBranchDef(state, branchId) {
  return state.defs.branchDefs.find((def) => def.id === branchId);
}
/** ユニークとなるflowIdを返す */
export function nextFlowId(state) {
  let i = 0;
  for (;;) {
    let nextId = `flow${i++}`;
    if (!findFlow(state, nextId)) {
      return nextId;
    }
  }
}
/** flowIdからpositionを取得する */
export function findPosition(state, flowId) {
  const { positionDefs } = state.defs;
  return positionDefs.find((pos) => pos.flowId === flowId);
}
/** flowDefs,condionDefsからcytoscape用のelementsを作成する */
export function makeCytoscapeElements(state) {
  const { flowDefs } = state.defs;
  const elements = flowDefs.map((def) => {
    let pos = findPosition(state, def.id);
    if (!pos) {
      pos = {x: 0, y: 0};
    }
    const classes = [];
    classes.push(def.type === 'branch' ? 'branch' : 'page');
    if (state.values.currentFlowId === def.id) {
      classes.push('selected');
    }
    return {
      data: {
        id: def.id,
        label: `${def.id} (${def.refId})`
      },
      position: { x: pos.x, y: pos.y },
      classes: classes.join(' ')
    };
  });
  const edges = flowDefs.map((def) => {
    if (def.type === 'page') {
      // sourceが入っているとedgeとして解釈されてしまうため
      // pageかつnextflowIdが定義されてない場合はここでは作成しない。
      // 後でfilterする
      if (!def.nextFlowId || def.nextFlowId === '') {
        return null;
      }
      return {
        data: {
          source: def.id,
          target: def.nextFlowId
        }
      };
    } else if (def.type === 'branch') {
      return findBranchDef(state, def.refId).conditions.map(c => {
        return {
          data: {
            label: c.key ? `if ${c.key}==${c.value}` : 'else',
            source: def.id,
            target: c.nextFlowId
          }
        };
      });
    } else {
      return null;
    }
  }).filter((edge) => edge !== null);
  const mergedElements = elements.concat(flatten(edges));
  return mergedElements.filter((e) => e !== null);
}

/** オブジェクトをcloneする */
export function cloneObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}
/** エラーメッセージ用のエレメントを返す */
export function errorMessage(msg) {
  return <h3 className="error-message">{msg}</h3>;
}
/** 次のIDを生成する */
export function generateNextId(state, type) {
  console.log(type);
  let num = (state.defs[type + 'Defs'].map(def => parseInt(def.id.substr(1), 10)).reduce((x, y) => x > y ? x : y) + 1).toString();
  let padding = '';
  for (let i = num.length; i < 3; i++) {
    padding += '0';
  }
  const prefix = type.substr(0, 1).toUpperCase();
  return `${prefix}${padding}${num}`;
}
/** 引数がstringかどうかを判定する */
export function isString(str) {
  return typeof(str) === 'string';
}
/** 再掲のための文字列置換を行う */
export function r(str, values) {
  let index = 0
    , oldIndex
    , isInVariable = false
    , variableStartIndex
    , variableEndIndex
    , ret = '';
  if (!str) {
    return ret;
  }
  while (true) {
    oldIndex = index;
    if (!isInVariable) {
      index = str.indexOf("${", index);
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
      index = str.indexOf("}", index);
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
  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
