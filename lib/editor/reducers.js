import * as C from '../constants/actions';
import runtimeReducer from '../runtime/reducers';

/** pageのselectorを生成する */
function pageSelector(survey, action) {
  const pageIndex = survey.findPageIndex(action.pageId);
  return ['pages', pageIndex];
}

/** branchのselectorを生成する */
function branchSelector(survey, action) {
  const branchIndex = survey.findPageIndex(action.branchId);
  return ['branches', branchIndex];
}

/** finisherのselectorを生成する */
function finisherSelector(survey, action) {
  const finisherIndex = survey.findFinisherIndex(action.finisherId);
  return ['finishers', finisherIndex];
}

/** ViewSettingを更新するactionを実行する */
function viewSettingReducer(view, action) {
  switch (action.type) {
    case C.CHANGE_NODE_DRAGGING:
      return view.updateViewAttribute('nodeDragging', action.dragging);
    case C.CHANGE_SHOW_PANE:
      return view.updateViewAttribute(action.paneName, action.show);
    case C.CHANGE_SAVE_SURVEY_STATUS:
      return view.updateSaveSurveyStatus(action.saveSurveyStatus);
    default:
      return view;
  }
}

/** Pageを更新するactionを実行する */
function pageReducer(survey, action, replacer) {
  switch (action.type) {
    case C.ADD_ITEM:
      return survey.updateIn(pageSelector(survey, action), page => page.addItem(action.questionId, action.index));
    case C.ADD_SUB_ITEM:
      return survey.updateIn(pageSelector(survey, action), page => page.addSubItem(action.questionId, action.index));
    case C.ADD_LOGICAL_VARIABLE:
      return survey.updateIn(pageSelector(survey, action), page => page.addLogicalVariable(survey));
    case C.ADD_QUESTION:
      return survey.updateIn(pageSelector(survey, action), page => page.addQuestion(action.questionClassName, action.pageId, action.index));
    case C.CHANGE_LOGICAL_VARIABLE:
      return survey.updateIn(pageSelector(survey, action), page => page.updateLogicalVariable(action.logicalVariableId, action.logicalVariable));
    case C.CHANGE_PAGE_ATTRIBUTE:
      return survey.updateIn(pageSelector(survey, action), page => page.updatePageAttribute(action.attributeName, action.value));
    case C.CHANGE_ITEM_ATTRIBUTE:
      return survey.updateIn(pageSelector(survey, action), page =>
        page.updateItemAttribute(action.questionId, action.itemId, action.attributeName, action.value, replacer));
    case C.CHANGE_SUB_ITEM_ATTRIBUTE:
      return survey.updateIn(pageSelector(survey, action), page =>
        page.updateSubItemAttribute(action.questionId, action.itemId, action.attributeName, action.value, replacer));
    case C.CHANGE_QUESTION_ATTRIBUTE:
      return survey.updateIn(pageSelector(survey, action), page =>
        page.updateQuestionAttribute(action.questionId, action.attributeName, action.value, action.subValue, replacer));
    case C.REMOVE_LOGICAL_VARIABLE:
      return survey.updateIn(pageSelector(survey, action), page => page.removeLogicalVariable(action.logicalVariableId));
    case C.REMOVE_ITEM:
      return survey.updateIn(pageSelector(survey, action), page => page.removeItem(action.questionId, action.itemId));
    case C.REMOVE_SUB_ITEM:
      return survey.updateIn(pageSelector(survey, action), page => page.removeSubItem(action.questionId, action.itemId));
    case C.REMOVE_QUESTION:
      return survey.updateIn(pageSelector(survey, action), page => page.removeQuestion(action.questionId));
    case C.SWAP_ITEM:
      return survey.updateIn(pageSelector(survey, action), page => page.swapItem(action.questionId, action.srcItemId, action.destItemId));
    case C.SWAP_SUB_ITEM:
      return survey.updateIn(pageSelector(survey, action), page => page.swapSubItem(action.questionId, action.srcItemId, action.destItemId));
    case C.SWAP_QUESTION:
      return survey.updateIn(pageSelector(survey, action), page => page.swapQuestion(action.srcQuestionId, action.destQuestionId));
    default:
      return survey;
  }
}

/** Branchを更新するactionを実行する */
function branchReducer(survey, action) {
  switch (action.type) {
    case C.ADD_CHILD_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch => branch.addChildCondition(action.conditionId, action.index));
    case C.ADD_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch => branch.addCondition(action.index));
    case C.CHANGE_CONDITION_ATTRIBUTE:
      return survey.updateIn(branchSelector(survey, action), branch =>
        branch.updateConditionAttribute(action.conditionId, action.attributeName, action.value));
    case C.CHANGE_CHILD_CONDITION_ATTRIBUTE:
      return survey.updateIn(branchSelector(survey, action), branch => branch.updateChildConditionAttribute(action.conditionId,
        action.childConditionId, action.attributeName, action.value));
    case C.REMOVE_CHILD_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch =>
        branch.removeChildCondition(action.conditionId, action.childConditionId));
    case C.REMOVE_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch => branch.removeCondition(action.conditionId));
    case C.SWAP_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch => branch.swapCondition(action.srcConditionId, action.destConditionId));
    default:
      return survey;
  }
}

/** RuntimeValueを更新するactionを実行する */
function finisherReducer(survey, action, replacer) {
  switch (action.type) {
    case C.CHANGE_FINISHER_ATTRIBUTE:
      return survey.updateIn(finisherSelector(survey, action), finisher =>
        finisher.updateFinisherAttribute(action.attributeName, action.value, replacer));
    default:
      return survey;
  }
}

/** Surveyを更新するactionを実行する */
function surveyReducer(survey, action, replacer) {
  let newSurvey = survey;
  // surveyのぶら下がっているプロパティを更新
  newSurvey = branchReducer(newSurvey, action);
  newSurvey = pageReducer(newSurvey, action, replacer);
  newSurvey = finisherReducer(newSurvey, action, replacer);

  // survey自体の更新
  switch (action.type) {
    case C.CHANGE_FINISHER_ATTRIBUTE:
      return finisherReducer(newSurvey, action.finisherId, action, replacer);
    case C.REMOVE_NODE:
      return newSurvey.removeNode(action.nodeId);
    case C.SWAP_NODE:
      return newSurvey.swapNode(action.srcNodeId, action.destNodeId);
    case C.ADD_NODE:
      return newSurvey.addNode(action.index, action.nodeType);
    case C.CHANGE_TITLE:
      return newSurvey.updateTitle(action.title);
    case C.CHANGE_PANEL:
      return newSurvey.updatePanel(action.panel);
    default:
      return newSurvey;
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
  const replacer = state.getSurvey().getReplacer(
    state.getSurvey().getAllOutputDefinitionMap(),
    state.getSurvey().getQuestionNoMap(),
    state.getRuntime().getAnswers().toJS(),
  );
  const editorReducedState = state
    .update('survey', survey => surveyReducer(survey, action, replacer))
    .update('runtime', runtime => runtimeValueReducer(runtime, action, replacer))
    .update('view', view => viewSettingReducer(view, action));
  return runtimeReducer(editorReducedState, action);
}
