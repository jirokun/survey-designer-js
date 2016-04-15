import React from 'react'
export function flatten(ary) {
  return ary.reduce((p, c) => {
    return Array.isArray(c) ? p.concat(flatten(c)) : p.concat(c);
  }, []);
}

/** stateからdraftを探す */
export function findDraft(state, pageId) {
  return state.defs.draftDefs.find((def) => def.pageId === pageId);
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
  return findPage(state, flow.pageId);
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
export function findQuestion(state, questionId) {
  return state.defs.questionDefs.find((def) => def.id === questionId);
}
/** stateからpageIdに紐つくquestionを探す */
export function findQuestions(state, pageId) {
  return state.defs.questionDefs.filter((def) => def.pageId === pageId);
}
/** stateからquestionIdに紐つくitemを探す */
export function findItems(state, questionId) {
  return state.defs.itemDefs.filter((def) => def.questionId === questionId);
}
/** stateからitemIdに紐つくchoiceを探す */
export function findChoices(state, itemId) {
  return state.defs.choiceDefs.filter((def) => def.itemId === itemId);
}
/** stateからconditionを探す */
export function findConditions(state, flowId) {
  return state.defs.conditionDefs.filter((def) => def.flowId === flowId);
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
        label: `${def.id} (${def.pageId})`
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
      const conditionDefs = findConditions(state, def.id);
      return conditionDefs.map((c) => {
        return {
          data: {
            label: `${c.question}==${c.value}`,
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
  let num = (state.defs[type + 'Defs'].map(def => parseInt(def.id.substr(1), 10)).reduce((x, y) => x > y ? x : y) + 1).toString();
  let padding = '';
  for (let i = num.length; i < 3; i++) {
    padding += '0';
  }
  const prefix = type.substr(0, 1).toUpperCase();
  return `${prefix}${padding}${num}`;
}
