import * as C from '../constants';
import runtimeReducer from '../runtime/reducers';

function editorReducer(state, action) {
  switch (action.type) {
    case C.SELECT_NODE:
      return state.setCurrentNodeId(action.nodeId);
    case C.ADD_CHILD_CONDITION:
      return state.addChildCondition(action.branchId, action.conditionId, action.index);
    case C.ADD_CONDITION:
      return state.addCondition(action.branchId, action.index);
    case C.ADD_ITEM:
      return state.addItem(action.pageId, action.questionId, action.index);
    case C.ADD_NODE:
      return state.addNode(action.index, action.nodeType);
    case C.REMOVE_CHILD_CONDITION:
      return state.deleteChildCondition(action.branchId, action.conditionId, action.childConditionId);
    case C.REMOVE_CONDITION:
      return state.deleteCondition(action.branchId, action.conditionId);
    case C.REMOVE_ITEM:
      return state.deleteItem(action.pageId, action.questionId, action.itemId);
    case C.REMOVE_NODE:
      return state.deleteNode(action.nodeId);
    case C.REMOVE_QUESTION:
      return state.deleteQuestion(action.pageId, action.questionId);
    case C.SWAP_CONDITION:
      return state.swapCondition(action.branchId, action.srcIndex, action.destIndex);
    case C.SWAP_ITEM:
      return state.swapItem(action.pageId, action.questionId, action.srcItemId, action.destItemId);
    case C.SWAP_NODE:
      return state.swapNode(action.srcNodeId, action.destNodeId);
    case C.SWAP_QUESTION:
      return state.swapQuestion(action.nodeId, action.srcQuestionId, action.destQuestionId);
    case C.CHANGE_PAGE:
      return state.updatePage(action.pageId, action.page);
    case C.CHANGE_TITLE:
      return state.updateTitle(action.title);
    case C.CHANGE_ITEM_ATTRIBUTE:
      return state.updateItemAttribute(action.pageId, action.questionId, action.itemId, action.attributeName, action.value);
    case C.CHANGE_FINISHER_ATTRIBUTE:
      return state.updateFinisherAttribute(action.finisherId, action.attributeName, action.value);
    case C.CHANGE_QUESTION_ATTRIBUTE:
      return state.updateQuestionAttribute(action.pageId, action.questionId, action.attributeName, action.value, action.subValue);
    case C.CHANGE_CONDITION_ATTRIBUTE:
      return state.updateConditionAttribute(action.branchId, action.conditionId, action.attributeName, action.value);
    case C.CHANGE_CHILD_CONDITION_ATTRIBUTE:
      return state.updateChildConditionAttribute(action.branchId, action.conditionId,
        action.childConditionId, action.attributeName, action.value);
    case C.CHANGE_SHOW_PANE:
      return state.updateShowPane(action.paneName, action.show);
    case C.ADD_QUESTION:
      return state.addQuestion(action.questionClassName, action.pageId, action.index);
    default:
      return state;
  }
}
export default function reducer(state, action) {
  // runtimeとeditorのreducerを両方実行する
  return runtimeReducer(editorReducer(state, action), action);
}
