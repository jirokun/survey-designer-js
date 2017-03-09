import * as C from '../constants/actions';
import runtimeReducer from '../runtime/reducers';

/** ViewSettingを更新するactionを実行する */
function viewSettingReducer(view, action) {
  switch (action.type) {
    case C.CHANGE_SHOW_PANE:
      return view.updateShowPane(action.paneName, action.show);
    case C.CHANGE_SAVE_SURVEY_STATUS:
      return view.updateSaveSurveyStatus(action.saveSurveyStatus);
    default:
      return view;
  }
}

/** Pageを更新するactionを実行する */
function pageReducer(survey, pageId, action, replaceUtil) {
  const pageIndex = survey.findPageIndex(pageId);
  const selector = ['pages', pageIndex];
  switch (action.type) {
    case C.ADD_ITEM:
      return survey.updateIn(selector, page => page.addItem(action.questionId, action.index));
    case C.ADD_LOGIC_VARIABLE:
      return survey.updateIn(selector, page => page.addLogicVariable(survey));
    case C.ADD_QUESTION:
      return survey.updateIn(selector, page => page.addQuestion(action.questionClassName, action.pageId, action.index));
    case C.CHANGE_LOGIC_VARIABLE:
      return survey.updateIn(selector, page => page.updateLogicVariable(action.logicVariableId, action.logicVariable));
    case C.CHANGE_PAGE_ATTRIBUTE:
      return survey.updateIn(selector, page => page.updatePageAttribute(action.attributeName, action.value));
    case C.CHANGE_ITEM_ATTRIBUTE:
      return survey.updateIn(selector, page => page.updateItemAttribute(action.questionId, action.itemId, action.attributeName, action.value, replaceUtil));
    case C.CHANGE_QUESTION_ATTRIBUTE:
      return survey.updateIn(selector, page => page.updateQuestionAttribute(action.questionId, action.attributeName, action.value, action.subValue, replaceUtil));
    case C.REMOVE_LOGIC_VARIABLE:
      return survey.updateIn(selector, page => page.removeLogicVariable(action.logicVariableId));
    case C.REMOVE_ITEM:
      return survey.updateIn(selector, page => page.removeItem(action.questionId, action.itemId));
    case C.REMOVE_QUESTION:
      return survey.updateIn(selector, page => page.removeQuestion(action.questionId));
    case C.SWAP_ITEM:
      return survey.updateIn(selector, page => page.swapItem(action.questionId, action.srcItemId, action.destItemId));
    case C.SWAP_QUESTION:
      return survey.updateIn(selector, page => page.swapQuestion(action.srcQuestionId, action.destQuestionId));
    default:
      return survey;
  }
}

/** Branchを更新するactionを実行する */
function branchReducer(survey, branchId, action, replaceUtil) {
  const branchIndex = survey.findBranchIndex(branchId);
  const selector = ['branches', branchIndex];
  switch (action.type) {
    case C.ADD_CHILD_CONDITION:
      return survey.updateIn(selector, branch => branch.addChildCondition(action.conditionId, action.index));
    case C.ADD_CONDITION:
      return survey.updateIn(selector, branch => branch.addCondition(action.index));
    case C.CHANGE_CONDITION_ATTRIBUTE:
      return survey.updateIn(selector, branch => branch.updateConditionAttribute(action.conditionId, action.attributeName, action.value));
    case C.CHANGE_CHILD_CONDITION_ATTRIBUTE:
      return survey.updateIn(selector, branch => branch.updateChildConditionAttribute(action.conditionId,
        action.childConditionId, action.attributeName, action.value));
    case C.REMOVE_CHILD_CONDITION:
      return survey.updateIn(selector, branch => branch.removeChildCondition(action.conditionId, action.childConditionId));
    case C.REMOVE_CONDITION:
      return survey.updateIn(selector, branch => branch.removeCondition(action.conditionId));
    case C.SWAP_CONDITION:
      return survey.updateIn(selector, branch => branch.swapCondition(action.srcConditionId, action.destConditionId));
    default:
      return survey;
  }
}

/** RuntimeValueを更新するactionを実行する */
function finisherReducer(survey, finisherId, action, replaceUtil) {
  const finisherIndex = survey.findFinisherIndex(finisherId);
  const selector = ['finishers', finisherIndex];
  switch (action.type) {
    case C.CHANGE_FINISHER_ATTRIBUTE:
      return survey.updateIn(selector, finisher => finisher.updateFinisherAttribute(action.attributeName, action.value, replaceUtil));
    default:
      return survey;
  }
}

/** Surveyを更新するactionを実行する */
function surveyReducer(survey, action, replaceUtil) {
  switch (action.type) {
    case C.ADD_CHILD_CONDITION:
    case C.ADD_CONDITION:
    case C.CHANGE_CONDITION_ATTRIBUTE:
    case C.CHANGE_CHILD_CONDITION_ATTRIBUTE:
    case C.REMOVE_CHILD_CONDITION:
    case C.REMOVE_CONDITION:
    case C.SWAP_CONDITION:
      return branchReducer(survey, action.branchId, action, replaceUtil);
    case C.ADD_ITEM:
    case C.ADD_LOGIC_VARIABLE:
    case C.ADD_QUESTION:
    case C.CHANGE_ITEM_ATTRIBUTE:
    case C.CHANGE_LOGIC_VARIABLE:
    case C.CHANGE_PAGE_ATTRIBUTE:
    case C.CHANGE_QUESTION_ATTRIBUTE:
    case C.REMOVE_ITEM:
    case C.REMOVE_LOGIC_VARIABLE:
    case C.REMOVE_QUESTION:
    case C.SWAP_ITEM:
    case C.SWAP_QUESTION:
      return pageReducer(survey, action.pageId, action, replaceUtil);
    case C.CHANGE_FINISHER_ATTRIBUTE:
      return finisherReducer(survey, action.finisherId, action, replaceUtil);
    case C.REMOVE_NODE:
      return survey.removeNode(action.nodeId);
    case C.SWAP_NODE:
      return survey.swapNode(action.srcNodeId, action.destNodeId);
    case C.ADD_NODE:
      return survey.addNode(action.index, action.nodeType);
    case C.CHANGE_TITLE:
      return survey.updateTitle(action.title);
    case C.CHANGE_PANEL:
      return survey.updatePanel(action.panel);
    default:
      return survey;
  }
}

/** RuntimeValueを更新するactionを実行する */
function runtimeValueReducer(runtime, action) {
  switch (action.type) {
    case C.SELECT_NODE:
      return runtime.setCurrentNodeId(action.nodeId);
    default:
      return runtime;
  }
}

/** reducerのメイン処理 */
export default function reducer(state, action) {
  // runtimeとeditorのreducerを両方実行する
  const replaceUtil = state.survey.createReplaceUtil(
    state.survey.getAllOutputDefinitionMap(),
    state.survey.getQuestionNoMap(),
    state.getAnswers().toJS(),
  );
  const editorReducedState = state
    .update('survey', survey => surveyReducer(survey, action, replaceUtil))
    .update('runtime', runtime => runtimeValueReducer(runtime, action, replaceUtil))
    .update('view', view => viewSettingReducer(view, action));
  return runtimeReducer(editorReducedState, action);
}
