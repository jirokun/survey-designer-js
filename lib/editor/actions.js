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

/** ******************** survey関連 **********************/
export function changeTitle(title) {
  return { type: C.CHANGE_TITLE, title };
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
export function changeItemAttribute(pageId, questionId, itemId, attributeName, value) {
  return { type: C.CHANGE_ITEM_ATTRIBUTE, pageId, questionId, itemId, attributeName, value };
}
export function addQuestion(questionClassName, pageId, index) {
  return { type: C.ADD_QUESTION, questionClassName, pageId, index };
}
export function addCondition(branchId, index) {
  return { type: C.ADD_CONDITION, branchId, index };
}
export function addItem(pageId, questionId, index) {
  return { type: C.ADD_ITEM, pageId, questionId, index };
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
export function removeItem(pageId, questionId, itemId) {
  return { type: C.REMOVE_ITEM, pageId, questionId, itemId };
}
export function removeQuestion(pageId, questionId) {
  return { type: C.REMOVE_QUESTION, pageId, questionId };
}
export function removeCondition(branchId, conditionId) {
  return { type: C.REMOVE_CONDITION, branchId, conditionId };
}
export function swapItem(pageId, questionId, srcItemId, destItemId) {
  return { type: C.SWAP_ITEM, pageId, questionId, srcItemId, destItemId };
}
export function swapNode(srcNodeId, destNodeId) {
  return { type: C.SWAP_NODE, srcNodeId, destNodeId };
}
export function swapQuestion(nodeId, srcQuestionId, destQuestionId) {
  return { type: C.SWAP_QUESTION, nodeId, srcQuestionId, destQuestionId };
}

/** ******************** branch関連 **********************/
export function changeBranch(branchId, branch) {
  return { type: C.CHANGE_BRANCH, branchId, branch };
}
export function swapCondition(nodeId, srcConditionId, destConditionId) {
  return { type: C.SWAP_CONDITION, nodeId, srcConditionId, destConditionId };
}
