import * as Utils from '../utils'
import * as C from '../constants'
import runtimeReducer from '../runtime/reducers'
import yaml from 'js-yaml'

function addFlow(state, x, y, type) {
  const flowId = Utils.generateNextId(state, 'flow');
  const pageId = Utils.generateNextId(state, 'page');
  const defaultPage = {
    title: 'ここに設問を書いてください',
    questions: [
      { type: 'checkbox', choices: ['選択肢1', '選択肢2']},
      { type: 'radio', choices: ['選択肢1', '選択肢2']},
    ]
  };
  state.defs.positionDefs.push({ flowId, x, y });
  state.defs.flowDefs.push({ id: flowId, type: type, pageId: pageId });
  state.defs.pageDefs.push(Object.assign({}, defaultPage, { id: pageId }));
  state.defs.draftDefs.push({ pageId: pageId, valid: true, yaml: yaml.safeDump(defaultPage) });
  return state;
}
// ページを複製する
function clonePage(state, flowId, x, y) {
  const flow = Utils.findFlow(state, flowId);
  const clonedFlow = Utils.cloneObj(flow);
  clonedFlow.id = Utils.generateNextId(state, 'flow');
  state.defs.flowDefs.push(clonedFlow);
  state.defs.positionDefs.push({ flowId: clonedFlow.id, x, y });
  return state;
}
function removeEdge(state, sourceFlowId, targetFlowId) {
  const sourceFlow = Utils.findFlow(state, sourceFlowId);
  if (sourceFlow.type === 'page') {
    sourceFlow.nextFlowId = null;
  } else if (sourceFlow.type === 'branch') {
    const targetCondition = Utils.findConditions(state, sourceFlowId).find((def) => {
      return def.nextFlowId === targetFlowId;
    });
    targetCondition.nextFlowId = null;
  } else {
    throw "unkown flow type: " + sourceFlow.type;
  }
  return state;
}
function changeCustomPage(state, customPageId, html) {
  let customPage = state.defs.customPageDefs.find((def) => {
    return def.id === customPageId;
  });
  if (!customPage) {
    customPage = { id: customPageId, html }
    state.defs.customPageDefs.push(customPage);
  } else {
    customPage.html = html;
  }
  return state;
}
// 正しい値のときdraftにvalid=trueを設定し、pageも更新する
// 正しくない値でもdraftのyamlには値を代入する
function changeCodemirror(state, str) {
  const flow = Utils.findFlow(state, state.values.currentFlowId);
  const draft = Utils.findDraft(state, flow.pageId);
  draft.yaml = str;
  draft.valid = false;
  try {
    const page = yaml.load(str);
    if (typeof(page) === 'string' || typeof(page) === 'undefined' || Array.isArray(page)) {
      return state;
    }
    page.id = flow.pageId;
    removePage(state, flow.pageId, true);
    state.defs.pageDefs.push(page);
  } catch (e) {
    return state;
  }
  draft.valid = true;
  return state;
}
function changePosition(state, flowId, x, y) {
  const pos = state.defs.positionDefs.find((def) => {
    return def.flowId === flowId;
  });
  if (pos) {
    pos.x = x;
    pos.y = y;
  } else {
    state.defs.positionDefs.push({ flowId, x, y });
  }
  return state;
}
/** flowを削除する */
function removeFlow(state, flowId) {
  const flowDefs = state.defs.flowDefs;
  const index = flowDefs.findIndex((def) => def.id === flowId);
  const pageId = flowDefs[index].pageId;
  flowDefs.splice(index, 1);
  const pageRemained = flowDefs.findIndex(def => def.pageId === pageId) !== -1;
  if (!pageRemained) {
    removePage(state, pageId);
  }
  return state;
}
/** pageを削除する */
function removePage(state, pageId, doNotRemoveDraft = false) {
  // pageDefsから削除
  const pageDefs = state.defs.pageDefs;
  const pageIndex= pageDefs.findIndex(def => def.id === pageId);
  if (pageIndex === -1) {
    throw 'pagedef is not found: ' + pageId;
  }
  pageDefs.splice(pageIndex, 1);

  if (doNotRemoveDraft === false) {
    // draftDefsからも削除
    const draftDefs = state.defs.draftDefs;
    const draftIndex = draftDefs.findIndex(def => def.pageId === pageId);
    if (draftIndex === -1) {
      throw 'draftdef is not found: ' + pageId;
    }
    draftDefs.splice(draftIndex, 1);
  }

  return state;
}
/** Flowを接続する */
function connectFlow(state, sourceFlowId, dstFlowId) {
  let sourceFlow = Utils.findFlow(state, sourceFlowId);
  if (sourceFlow.type === 'page') {
    sourceFlow.nextFlowId = dstFlowId;
  } else if (sourceFlow.type === 'branch') {
    state.defs.conditionDefs.push({
      flowId: sourceFlow.id,
      type: 'if',
      nextFlowId: dstFlowId
    });
  } else {
    // デフォルトはpage
    throw 'unknown flow type: ' + sourceFlow.type;
  }
  return state;
}
/** elementのpositionを全て設定する */
function setElementsPosition(state, positions) {
  state.defs.positionDefs = positions;
  return state;
}
/** graphPaneをリサイズする */
function resizeGraphPane(state, width) {
  state.viewSettings.graphWidth = width;
  return state;
}
/** hotPaneをリサイズする */
function resizeHotPane(state, height) {
  state.viewSettings.hotHeight = height;
  return state;
}

function editorReducer(state, action) {
  let newState = Utils.cloneObj(state);
  switch (action.type) {
  case C.CHANGE_DEFS:
    newState.defs[action.defsName] = Utils.cloneObj(action.defs);
    return newState;
  case C.SELECT_FLOW:
    newState.values.currentFlowId = action.flowId;
    return newState;
  case C.ADD_PAGE_FLOW:
    return addFlow(newState, action.x, action.y, 'page');
  case C.ADD_BRANCH_FLOW:
    return addFlow(newState, action.x, action.y, 'branch');
  case C.CLONE_PAGE:
    return clonePage(newState, action.flowId, action.x, action.y);
  case C.REMOVE_EDGE:
    return removeEdge(newState, action.sourceFlowId, action.targetFlowId);
  case C.REMOVE_FLOW:
    return removeFlow(newState, action.flowId);
  case C.CHANGE_POSITION:
    return changePosition(newState, action.flowId, action.x, action.y);
  case C.CONNECT_FLOW:
    return connectFlow(newState, action.sourceFlowId, action.dstFlowId);
  case C.SET_ELEMENTS_POSITION:
    return setElementsPosition(newState, action.positions);
  case C.LOAD_STATE:
    return action.state;
  case C.RESIZE_GRAPH_PANE:
    return resizeGraphPane(newState, action.graphWidth);
  case C.RESIZE_HOT_PANE:
    return resizeHotPane(newState, action.hotHeight);
  case C.CHANGE_CUSTOM_PAGE:
    return changeCustomPage(newState, action.customPageId, action.html);
  case C.CHANGE_CODEMIRROR:
    return changeCodemirror(newState, action.yaml);
  default:
    return newState;
  }
}
export default function reducer(state, action) {
  // runtimeとeditorのreducerを両方実行する
  return runtimeReducer(editorReducer(state, action), action);
}
