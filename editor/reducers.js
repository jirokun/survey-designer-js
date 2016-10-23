import * as Utils from '../utils'
import * as C from '../constants'
import runtimeReducer from '../runtime/reducers'
import yaml from 'js-yaml'

function addFlow(state, x, y, type) {
  const flowId = Utils.generateNextId(state, 'flow');
  const id = Utils.generateNextId(state, type);
  state.defs.flowDefs.push({ id: flowId, type: type, refId: id });
  state.defs.positionDefs.push({ flowId, x, y });
  if (type === 'page') {
    const defaultPage = {
      title: 'ここに設問を書いてください',
      questions: [
        { type: 'checkbox', choices: ['選択肢1', '選択肢2']},
        { type: 'radio', choices: ['選択肢1', '選択肢2']},
      ]
    };
    state.defs.pageDefs.push(Object.assign({}, defaultPage, { id: id }));
    state.defs.draftDefs.push({ id: id, valid: true, yaml: yaml.safeDump(defaultPage) });
  } else if (type === 'branch') {
    const defaultBranch = {
      type: 'simple',
      conditions: [
        { key: null, operator: '==', value: null, nextFlowId: null },
        { nextFlowId: null }
      ]
    };
    state.defs.branchDefs.push(Object.assign({}, defaultBranch, { id: id }));
    state.defs.draftDefs.push({ id: id, valid: true, yaml: yaml.safeDump(defaultBranch) });
  } else {
    throw 'Unexpected argument type: ' + type;
  }
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
    const branchDef = Utils.findBranchDef(state, sourceFlowId);
    const targetIndex = branchDef.conditions.findIndex((def) => {
      return def.nextFlowId === targetFlowId;
    });
    branchDef.conditions.splice(targetIndex, 1);
    // draftも更新
    const draft = Utils.findDraft(state, branchDef.branchId);
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
  const draft = Utils.findDraft(state, flow.refId);
  draft.yaml = str;
  draft.valid = false;
  try {
    const page = yaml.load(str);
    if (typeof(page) === 'string' || typeof(page) === 'undefined' || Array.isArray(page)) {
      return state;
    }
    page.id = flow.refId;
    removePage(state, flow.refId, true);
    state.defs.pageDefs.push(page);
  } catch (e) {
    return state;
  }
  draft.valid = true;
  return state;
}

// ページの設定をを変更する
function changePageSetting(state, action, pageSetting) {
  const flow = Utils.findFlow(state, state.values.currentFlowId);
  const page = Utils.findPage(state, flow.refId);
  if (pageSetting.pageId !== undefined) {
    // 参照しているflowのidは全て変更する
    const flowList = Utils.findFlowByPage(state, page.id);
    flowList.forEach(f => f.refId = pageSetting.pageId);

    // draftのrefIdも更新
    const draft = Utils.findDraft(state, page.id);
    draft.id = pageSetting.pageId;

    // page.idを更新
    page.id = pageSetting.pageId;
  }
  if (pageSetting.pageTitle !== undefined) page.title = pageSetting.pageTitle;
  if (pageSetting.pageSubTitle !== undefined) page.subTitle = pageSetting.pageSubTitle;
  if (pageSetting.pageLayout !== undefined) page.layout = pageSetting.pageLayout;
  return state;
}

function changeQuestionId(state, action, pageId, oldQuestionId, newQuestionId) {
  const question = Utils.findQuestion(state, pageId, oldQuestionId);
  question.id = newQuestionId;
  return state;
}
// 1ページに対して1クエスションしかない前提(Easyモード)
function changeQuestion(state, pageId, questionId, newQuestion) {
  const page = Utils.findPage(state, pageId);
  const question = Utils.findQuestion(state, pageId, questionId);
  for (const prop in question) {
    if (prop === 'id' || prop === 'type') continue;
    delete question[prop];
  }
  Object.assign(question, newQuestion);
  removeDraft(state, page.id);
  state.defs.draftDefs.push({ id: page.id, valid: true, yaml: yaml.safeDump(page) });
  return state;
}
// コンポーネントを追加する
function addComponent(state, component) {
  const flow = Utils.findFlow(state, state.values.currentFlowId);
  const page = Utils.findPage(state, flow.refId);
  page.questions.push(component.getDefaultDefinition());
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
  const refId = flowDefs[index].refId;
  flowDefs.splice(index, 1);
  if (flowDefs[index].type === 'page') {
    const pageRemained = flowDefs.findIndex(def => def.pageId === refId) !== -1;
    if (!pageRemained) {
      removePage(state, pageId);
    }
  } else if (flowDefs[index].type === 'branch') {
    removeBranch(state, pageId);
  }
  return state;
}
/** branchを削除する */
function removeBranch(state, branchId) {
  const branchDefs = state.defs.branchDefs;
  const branchIndex = branchDefs.findIndex(def => def.id === branchId);
  branchDefs.splice(branchIndex, 1);
  removeDraft(state, branchId);
}
/** draftを削除する */
function removeDraft(state, id) {
  const draftDefs = state.defs.draftDefs;
  const draftIndex = draftDefs.findIndex(def => def.id === id);
  if (draftIndex === -1) {
    throw 'draftdef is not found: ' + pageId;
  }
  draftDefs.splice(draftIndex, 1);
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
    removeDraft(state, pageId);
  }

  return state;
}
/** Flowを接続する */
function connectFlow(state, sourceFlowId, dstFlowId) {
  let sourceFlow = Utils.findFlow(state, sourceFlowId);
  if (sourceFlow.type === 'page') {
    sourceFlow.nextFlowId = dstFlowId;
  } else if (sourceFlow.type === 'branch') {
    state.defs.branchDefs.push({
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
  case C.CHANGE_PAGE_SETTING:
    return changePageSetting(newState, action.type, action.pageSetting);
    break;
  case C.CHANGE_QUESTION_ID:
    return changeQuestionId(newState, action.type, action.pageId, action.oldQuestionId, action.newQuestionId);
  case C.CHANGE_QUESTION:
    return changeQuestion(newState, action.pageId, action.questionId, action.question);
    break;
  case C.ADD_COMPONENT:
    return addComponent(newState, action.component);
    break;
  default:
    return newState;
  }
}
export default function reducer(state, action) {
  // runtimeとeditorのreducerを両方実行する
  return runtimeReducer(editorReducer(state, action), action);
}
