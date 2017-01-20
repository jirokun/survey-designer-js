import * as Utils from '../utils';
import * as C from '../constants';
import runtimeReducer from '../runtime/reducers';

function addFlow(state, x, y, type) {
  const flowId = Utils.generateNextId(state, 'flow');
  const id = Utils.generateNextId(state, type);
  state.defs.flowDefs.push({ id: flowId, type, refId: id });
  state.defs.positionDefs.push({ flowId, x, y });
  if (type === 'page') {
    const defaultPage = {
      title: 'ここに設問を書いてください',
      questions: [
        { type: 'checkbox', choices: ['選択肢1', '選択肢2'] },
        { type: 'radio', choices: ['選択肢1', '選択肢2'] },
      ],
    };
    state.defs.pageDefs.push(Object.assign({}, defaultPage, { id }));
  } else if (type === 'branch') {
    const defaultBranch = {
      type: 'simple',
      conditions: [
        { key: null, operator: '==', value: null, nextFlowId: null },
        { nextFlowId: null },
      ],
    };
    state.defs.branchDefs.push(Object.assign({}, defaultBranch, { id }));
  } else {
    throw `Unexpected argument type: ${type}`;
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
    const branchDef = Utils.findBranch(state, sourceFlowId);
    const targetIndex = branchDef.conditions.findIndex(def => def.nextFlowId === targetFlowId);
    branchDef.conditions.splice(targetIndex, 1);
  } else {
    throw `unkown flow type: ${sourceFlow.type}`;
  }
  return state;
}
function changeCustomPage(state, customPageId, html) {
  let customPage = state.defs.customPageDefs.find(def => def.id === customPageId);
  if (!customPage) {
    customPage = { id: customPageId, html };
    state.defs.customPageDefs.push(customPage);
  } else {
    customPage.html = html;
  }
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
  return state;
}
// 分岐定義を変更
function changeBranch(state, branchId, newBranch) {
  const branch = Utils.findBranch(state, branchId);
  for (const prop in branch) {
    if (prop === 'id' || prop === 'type') continue;
    delete branch[prop];
  }
  Object.assign(branch, newBranch);
  return state;
}

// 分岐条件の順番を入れ替える
function moveCondition(state, branchId, sourceIndex, toIndex) {
  const branch = Utils.findBranch(state, branchId);
  const targetCondition = branch.conditions[sourceIndex];
  branch.conditions[sourceIndex] = branch.conditions[toIndex];
  branch.conditions[toIndex] = targetCondition;
  return state;
}

// コンポーネントを追加する
function addComponent(state, component) {
  const flow = Utils.findFlow(state, state.values.currentFlowId);
  const page = Utils.findPage(state, flow.refId);
  page.questions.push(component.getDefaultDefinition());
  return state;
}

/** flowを削除する */
function removeFlow(state, flowId) {
  const flowDefs = state.defs.flowDefs;
  const index = flowDefs.findIndex(def => def.id === flowId);
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
}
/** pageを削除する */
function removePage(state, pageId) {
  // pageDefsから削除
  const pageDefs = state.defs.pageDefs;
  const pageIndex = pageDefs.findIndex(def => def.id === pageId);
  if (pageIndex === -1) {
    throw `pagedef is not found: ${pageId}`;
  }
  pageDefs.splice(pageIndex, 1);

  return state;
}
/** Flowを接続する */
function connectFlow(state, sourceFlowId, dstFlowId) {
  const sourceFlow = Utils.findFlow(state, sourceFlowId);
  if (sourceFlow.type === 'page') {
    sourceFlow.nextFlowId = dstFlowId;
  } else if (sourceFlow.type === 'branch') {
    state.defs.branchDefs.push({
      flowId: sourceFlow.id,
      type: 'if',
      nextFlowId: dstFlowId,
    });
  } else {
    // デフォルトはpage
    throw `unknown flow type: ${sourceFlow.type}`;
  }
  return state;
}

function editorReducer(state, action) {
  switch (action.type) {
    case C.CHANGE_DEFS:
      throw 'not supported yet';
      state.defs[action.defsName] = Utils.cloneObj(action.defs);
      return state;
    case C.SELECT_FLOW:
      return state.setCurrentFlowId(action.flowId);
    case C.ADD_PAGE_FLOW:
      return addFlow(state, action.x, action.y, 'page');
    case C.ADD_BRANCH_FLOW:
      return addFlow(state, action.x, action.y, 'branch');
    case C.CLONE_PAGE:
      return clonePage(state, action.flowId, action.x, action.y);
    case C.REMOVE_EDGE:
      return removeEdge(state, action.sourceFlowId, action.targetFlowId);
    case C.REMOVE_FLOW:
      return removeFlow(state, action.flowId);
    case C.CONNECT_FLOW:
      return connectFlow(state, action.sourceFlowId, action.dstFlowId);
    case C.LOAD_STATE:
      return action.state;
    case C.RESIZE_GRAPH_PANE:
      return state.setGraphWidth(action.graphWidth);
    case C.RESIZE_HOT_PANE:
      return state.setEditorHeight(action.height);
    case C.CHANGE_CUSTOM_PAGE:
      return changeCustomPage(state, action.customPageId, action.html);
    case C.CHANGE_PAGE_SETTING:
      return changePageSetting(state, action.type, action.pageSetting);
    case C.CHANGE_QUESTION_ID:
      return changeQuestionId(state, action.type, action.pageId, action.oldQuestionId, action.newQuestionId);
    case C.CHANGE_QUESTION:
      return changeQuestion(state, action.pageId, action.questionId, action.question);
    case C.CHANGE_BRANCH:
      return changeBranch(state, action.branchId, action.branch);
    case C.MOVE_CONDITION:
      return moveCondition(state, action.branchId, action.sourceIndex, action.toIndex);
    case C.ADD_COMPONENT:
      return addComponent(state, action.component);
    default:
      return state;
  }
}
export default function reducer(state, action) {
  // runtimeとeditorのreducerを両方実行する
  return runtimeReducer(editorReducer(state, action), action);
}
