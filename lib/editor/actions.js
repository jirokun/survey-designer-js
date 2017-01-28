import * as C from '../constants';
export function initializeDefs(allDefs) {
  const str = JSON.stringify({ type: C.INIT_ALL_DEFS, allDefs });
  return {
    type: C.INIT_ALL_DEFS,
  };
}
export function changeDefs(defsName, defs) {
  return {
    type: C.CHANGE_DEFS,
    defsName,
    defs,
  };
}
/** ******************** デザイン画面関連 **********************/
export function changeShowPane(paneName, show) {
  return { type: C.CHANGE_SHOW_PANE, paneName, show };
}

/** ******************** Graph関連 **********************/
export function selectFlow(flowId) {
  return { type: C.SELECT_FLOW, from: C.GRAPH, flowId };
}
export function addFlow(index, flowType) {
  return { type: C.ADD_FLOW, index, flowType };
}
export function removeFlow(flowId) {
  return { type: C.REMOVE_FLOW, flowId };
}

/** ******************** page, question関連 **********************/
export function changeCodemirror(yaml) {
  return { type: C.CHANGE_CODEMIRROR, yaml };
}
export function changePage(page) {
  return { type: C.CHANGE_PAGE, pageId: page.getId(), page };
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
export function changeQuestionAttribute(pageId, questionId, attributeName, value, subValue) {
  return { type: C.CHANGE_QUESTION_ATTRIBUTE, pageId, questionId, attributeName, value, subValue };
}
export function addComponent(component) {
  return { type: C.ADD_COMPONENT, component };
}

/** ******************** branch関連 **********************/
export function changeBranch(branchId, branch) {
  return { type: C.CHANGE_BRANCH, branchId, branch };
}
export function moveCondition(branchId, sourceIndex, toIndex) {
  return { type: C.MOVE_CONDITION, branchId, sourceIndex, toIndex };
}
