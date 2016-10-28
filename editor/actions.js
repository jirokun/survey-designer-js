import * as C from '../constants'
export function initializeDefs(allDefs) {
  const str = JSON.stringify({type: C.INIT_ALL_DEFS, allDefs});
  return {
    type: C.INIT_ALL_DEFS
  };
}
export function changeDefs(defsName, defs) {
  return {
    type: C.CHANGE_DEFS,
    defsName: defsName,
    defs: defs
  };
}
/********************** Graph関連 **********************/
export function selectFlow(flowId) {
  return { type: C.SELECT_FLOW, from: C.GRAPH, flowId }
}
export function addPageFlow(x, y) {
  return { type: C.ADD_PAGE_FLOW, x, y };
}
export function clonePage(flowId, x, y) {
  return { type: C.CLONE_PAGE, flowId, x, y };
}
export function addBranchFlow(x, y) {
  return { type: C.ADD_BRANCH_FLOW, x, y };
}
export function removeFlow(flowId) {
  return { type: C.REMOVE_FLOW, flowId };
}
export function removeEdge(sourceFlowId, targetFlowId) {
  return { type: C.REMOVE_EDGE, sourceFlowId, targetFlowId };
}
export function changePosition(flowId, x, y) {
  return { type: C.CHANGE_POSITION, flowId, x, y };
}
export function changeCustomPage(customPageId, html) {
  return { type: C.CHANGE_CUSTOM_PAGE, customPageId, html };
}
export function connectFlow(sourceFlowId, dstFlowId) {
  return { type: C.CONNECT_FLOW, sourceFlowId, dstFlowId };
}
export function setElementsPosition(positions) {
  return { type: C.SET_ELEMENTS_POSITION, positions };
}

/********************** page, question関連 **********************/
export function loadState(state) {
  return { type: C.LOAD_STATE, state };
}
export function resizeGraphPane(graphWidth) {
  return { type: C.RESIZE_GRAPH_PANE, graphWidth };
}
export function resizeEditorPane(hotHeight) {
  return { type: C.RESIZE_EDITOR_PANE, hotHeight };
}
export function changeCodemirror(yaml) {
  return { type: C.CHANGE_CODEMIRROR, yaml };
}
export function changePageSetting(pageSetting) {
  return { type: C.CHANGE_PAGE_SETTING, pageSetting };
}
export function changeQuestionId(pageId, oldQuestionId, newQuestionId) {
  return { type: C.CHANGE_QUESTION_ID, pageId, oldQuestionId, newQuestionId };
}
export function changeQuestionType(pageId, questionId, questionType) {
  return { type: C.CHANGE_QUESTION_TYPE, pageId, questionId, questionType };
}
export function changeQuestion(pageId, questionId, question) {
  return { type: C.CHANGE_QUESTION, pageId, questionId, question };
}
export function changeBranch(branchId, branch) {
  return { type: C.CHANGE_BRANCH, branchId, branch };
}
export function addComponent(component) {
  return { type: C.ADD_COMPONENT, component};
}
