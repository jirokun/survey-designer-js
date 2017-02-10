import * as C from '../constants';
/** ******************** デザイン画面関連 **********************/
export function changeShowPane(paneName, show) {
  return { type: C.CHANGE_SHOW_PANE, paneName, show };
}

/** ******************** Graph関連 **********************/
export function selectNode(nodeId) {
  return { type: C.SELECT_NODE, from: C.GRAPH, nodeId };
}
export function addNode(index, nodeType) {
  return { type: C.ADD_NODE, index, nodeType };
}
export function removeNode(nodeId) {
  return { type: C.REMOVE_NODE, nodeId };
}

/** ******************** page, question関連 **********************/
export function changeCodemirror(yaml) {
  return { type: C.CHANGE_CODEMIRROR, yaml };
}
export function changePage(page) {
  return { type: C.CHANGE_PAGE, pageId: page.getId(), page };
}
export function changeQuestionAttribute(pageId, questionId, attributeName, value, subValue) {
  return { type: C.CHANGE_QUESTION_ATTRIBUTE, pageId, questionId, attributeName, value, subValue };
}
export function addQuestion(questionClassName, pageId, index) {
  return { type: C.ADD_QUESTION, questionClassName, pageId, index };
}
export function addCondition(branchId, index) {
  return { type: C.ADD_CONDITION, branchId, index };
}
export function addChildCondition(branchId, conditionId, index) {
  return { type: C.ADD_CHILD_CONDITION, branchId, conditionId, index };
}
export function changeConditionAttribute(branchId, conditionId, attributeName, value) {
  return { type: C.CHANGE_CONDITION_ATTRIBUTE, branchId, conditionId, attributeName, value };
}
export function changeChildConditionAttribute(branchId, conditionId, childConditionId, attributeName, value) {
  return { type: C.CHANGE_CHILD_CONDITION_ATTRIBUTE, branchId, conditionId, childConditionId, attributeName, value };
}
export function changeFinisherAttribute(finisherId, attributeName, value) {
  return { type: C.CHANGE_FINISHER_ATTRIBUTE, finisherId, attributeName, value };
}
export function removeChildCondition(branchId, conditionId, childConditionId) {
  return { type: C.REMOVE_CHILD_CONDITION, branchId, conditionId, childConditionId };
}
export function removeQuestion(pageId, questionId) {
  return { type: C.REMOVE_QUESTION, pageId, questionId };
}
export function removeCondition(branchId, conditionId) {
  return { type: C.REMOVE_CONDITION, branchId, conditionId };
}

/** ******************** branch関連 **********************/
export function changeBranch(branchId, branch) {
  return { type: C.CHANGE_BRANCH, branchId, branch };
}
export function swapCondition(branchId, srcIndex, destIndex) {
  return { type: C.SWAP_CONDITION, branchId, srcIndex, destIndex };
}
