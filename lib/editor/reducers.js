import * as Utils from '../utils';
import * as C from '../constants';
import runtimeReducer from '../runtime/reducers';

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

function changeQuestionId(state, action, pageId, oldQuestionId, newQuestionId) {
  const question = Utils.findQuestion(state, pageId, oldQuestionId);
  question.id = newQuestionId;
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
    case C.ADD_FLOW:
      return state.addFlow(action.index, action.flowType);
    case C.CLONE_PAGE:
      return clonePage(state, action.flowId, action.x, action.y);
    case C.REMOVE_EDGE:
      return removeEdge(state, action.sourceFlowId, action.targetFlowId);
    case C.REMOVE_FLOW:
      return state.deleteFlow(action.flowId);
    case C.CONNECT_FLOW:
      return connectFlow(state, action.sourceFlowId, action.dstFlowId);
    case C.LOAD_STATE:
      return action.state;
    case C.CHANGE_CUSTOM_PAGE:
      return changeCustomPage(state, action.customPageId, action.html);
    case C.CHANGE_PAGE:
      return state.updatePage(action.pageId, action.page);
    case C.CHANGE_QUESTION_ID:
      return changeQuestionId(state, action.type, action.pageId, action.oldQuestionId, action.newQuestionId);
    case C.CHANGE_QUESTION_ATTRIBUTE:
      return state.updateQuestionAttribute(action.pageId, action.questionId, action.attributeName, action.value, action.subValue);
    case C.CHANGE_QUESTION:
      return state.updateQuestion(action.pageId, action.questionId, action.question);
    case C.CHANGE_BRANCH:
      return changeBranch(state, action.branchId, action.branch);
    case C.CHANGE_SHOW_PANE:
      return state.updateShowPane(action.paneName, action.show);
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
