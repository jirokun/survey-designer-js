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

/** ******************** branch関連 **********************/
export function changeBranch(branchId, branch) {
  return { type: C.CHANGE_BRANCH, branchId, branch };
}
export function swapCondition(branchId, srcIndex, destIndex) {
  return { type: C.SWAP_CONDITION, branchId, srcIndex, destIndex };
}
