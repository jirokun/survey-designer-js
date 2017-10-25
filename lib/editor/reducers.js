import * as C from '../constants/actions';
import runtimeReducer from '../runtime/reducers';
import surveyDevIdGeneratorInstance from '../runtime/SurveyDevIdGenerator';

/** pageのselectorを生成する */
function pageSelector(survey, action) {
  const pageIndex = survey.findPageIndex(action.pageId);
  if (pageIndex === -1) throw new Error(`page not found pageId: ${action.pageId}`);
  return ['pages', pageIndex];
}

/** pageのselectorを生成する */
function questionSelector(survey, action) {
  const pageIndex = survey.findPageIndex(action.pageId);
  if (pageIndex === -1) throw new Error(`page not found pageId: ${action.pageId}`);
  const questionIndex = survey.findPage(action.pageId).findQuestionIndex(action.questionId);
  if (questionIndex === -1) throw new Error(`question not found questionId: ${action.questionId}`);
  return ['pages', pageIndex, 'questions', questionIndex];
}

/** branchのselectorを生成する */
function branchSelector(survey, action) {
  const branchIndex = survey.findBranchIndex(action.branchId);
  if (branchIndex === -1) throw new Error(`branch not found pageId: ${action.branchId}`);
  return ['branches', branchIndex];
}

/** finisherのselectorを生成する */
function finisherSelector(survey, action) {
  const finisherIndex = survey.findFinisherIndex(action.finisherId);
  if (finisherIndex === -1) throw new Error(`finisher not found pageId: ${action.finisherId}`);
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
    case C.CHANGE_PAGE_EDITOR_TAB:
      return view.updateSelectedPageEditorTab(action.eventKey);
    case C.CHANGE_ALL_JAVASCRIPT_EDITOR:
      return view.updateShowAllJsEditorAndSetNullToSavedAt(action.show);
    case C.CHANGE_ALL_JAVASCRIPT_SAVED_AT:
      return view.updateViewAttribute('allJavaScriptSavedAt', action.savedAt);
    case C.CHANGE_SHOW_MENU_CONFIG:
      return view.updateViewAttribute('showMenuConfig', action.showMenuConfig);
    default:
      return view;
  }
}

/** Pageを更新するactionを実行する */
function pageReducer(survey, options, action, replacer) {
  switch (action.type) {
    case C.ADD_ITEM:
      return survey.updateIn(pageSelector(survey, action), page => page.addItem(action.questionId, action.index));
    case C.ADD_SUB_ITEM:
      return survey.updateIn(pageSelector(survey, action), page => page.addSubItem(action.questionId, action.index));
    case C.ADD_LOGICAL_VARIABLE:
      return survey.updateIn(pageSelector(survey, action), page => page.addLogicalVariable());
    case C.ADD_QUESTION:
      return survey.updateIn(pageSelector(survey, action), page => page.addQuestion(action.questionClassName, action.pageId, action.index));
    case C.BULK_ADD_ITEMS:
      return survey.updateIn(pageSelector(survey, action), page => page.bulkAddItems(action.questionId, action.text));
    case C.BULK_ADD_SUB_ITEMS:
      return survey.updateIn(pageSelector(survey, action), page => page.bulkAddSubItems(action.questionId, action.text));
    case C.CHANGE_LOGICAL_VARIABLE:
      return survey.updateIn(pageSelector(survey, action), page => page.updateLogicalVariable(action.logicalVariableId, action.logicalVariable));
    case C.CHANGE_PAGE_ATTRIBUTE:
      return survey.updateIn(pageSelector(survey, action), page => page.updatePageAttribute(action.attributeName, action.value, replacer));
    case C.CHANGE_ITEM_ATTRIBUTE:
      return survey.updateIn(pageSelector(survey, action), page =>
        page.updateItemAttribute(action.questionId, action.itemId, action.attributeName, action.value, replacer));
    case C.CHANGE_ITEM_VISIBILITY_CONDITIONS:
      return survey.updateIn(pageSelector(survey, action), page =>
        page.updateItemVisiblityConditions(survey, action.questionId, action.value));
    case C.CHANGE_SUB_ITEM_VISIBILITY_CONDITIONS:
      return survey.updateIn(pageSelector(survey, action), page =>
        page.updateSubItemVisiblityConditions(survey, action.questionId, action.value));
    case C.CHANGE_SUB_ITEM_ATTRIBUTE:
      return survey.updateIn(pageSelector(survey, action), page =>
        page.updateSubItemAttribute(action.questionId, action.itemId, action.attributeName, action.value, replacer));
    case C.CHANGE_QUESTION_ATTRIBUTE:
      return survey.updateIn(pageSelector(survey, action), page =>
        page.updateQuestionAttribute(action.questionId, action.attributeName, action.value, action.subValue, replacer));
    case C.CHANGE_ALL_JAVASCRIPT_CODE:
      return survey.updateAllJavaScriptCode(action.allJavaScriptCode);
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
      return null;
  }
}

function questionReducer(survey, options, action) {
  switch (action.type) {
    case C.ADD_NUMBER_VALIDATION:
      return survey.updateIn(questionSelector(survey, action), question => question.addNumberValidation(action.outputDefinitionId));
    case C.COPY_NUMBER_VALIDATION_RULES:
      return survey.updateIn(questionSelector(survey, action), question => question.copyNumberValidationRules(survey, action.copyDataList));
    case C.CHANGE_NUMBER_VALIDATION_RULE:
      return survey.updateIn(questionSelector(survey, action), question => question.updateNumberValidationRule(action.outputDefinitionId, action.numberValidationRule));
    default:
      return null;
  }
}

/** Branchを更新するactionを実行する */
function branchReducer(survey, action) {
  switch (action.type) {
    case C.ADD_CHILD_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch => branch.addChildCondition(action.conditionId, action.index));
    case C.ADD_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch => branch.addCondition(action.index));
    case C.CHANGE_BRANCH_ATTRIBUTE:
      return survey.updateIn(branchSelector(survey, action), branch => branch.updateBranchAttribute(action.attributeName, action.value));
    case C.CHANGE_CONDITION_ATTRIBUTE:
      return survey.updateIn(branchSelector(survey, action), branch =>
        branch.updateConditionAttribute(action.conditionId, action.attributeName, action.value));
    case C.CHANGE_CHILD_CONDITION_ATTRIBUTE:
      return survey.updateIn(branchSelector(survey, action), branch => branch.updateChildConditionAttribute(survey, action.conditionId,
        action.childConditionId, action.attributeName, action.value));
    case C.REMOVE_CHILD_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch =>
        branch.removeChildCondition(action.conditionId, action.childConditionId));
    case C.REMOVE_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch => branch.removeCondition(action.conditionId));
    case C.SWAP_CONDITION:
      return survey.updateIn(branchSelector(survey, action), branch => branch.swapCondition(action.srcConditionId, action.destConditionId));
    default:
      return null;
  }
}

/** RuntimeValueを更新するactionを実行する */
function finisherReducer(survey, options, action, replacer) {
  switch (action.type) {
    case C.CHANGE_FINISHER_ATTRIBUTE:
      return survey.updateIn(finisherSelector(survey, action), finisher =>
        finisher.updateFinisherAttribute(action.attributeName, action.value, replacer));
    default:
      return null;
  }
}

/** Surveyを更新するactionを実行する */
function surveyReducer(survey, options, action, replacer) {
  // いずれかのreducerで一つだけ更新される
  const newSurvey = branchReducer(survey, action) ||
    pageReducer(survey, options, action, replacer) ||
    questionReducer(survey, options, action, replacer) ||
    finisherReducer(survey, options, action, replacer) ||
    (() => {
      switch (action.type) {
        case C.REMOVE_NODE:
          return survey.removeNode(action.nodeId);
        case C.SWAP_NODE:
          return survey.swapNode(action.srcNodeId, action.destNodeId);
        case C.ADD_NODE:
          return survey.addNode(action.index, action.nodeType);
        case C.CHANGE_PANEL:
          return survey.updatePanel(action.panel);
        case C.LOAD_SURVEY:
          return action.survey;
        case C.CHANGE_SURVEY_CSS_URLS:
          return survey.updateCssUrls(action.cssOption.getRuntimeUrls(), action.cssOption.getPreviewUrls(), action.cssOption.getDetailUrls());
        case C.CHANGE_SURVEY_ATTRIBUTE:
          return survey.updateAttribute(action.attributeName, action.value);
        default:
          return survey;
      }
    })();
  // OutputDefinitionが変更されている場合、cleanで不要なNumberValidationRuleを削除する
  if (!survey.isOutputDefinitionEqual(newSurvey)) return newSurvey.clean();
  return newSurvey;
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
  const replacer = state.getSurvey().refreshReplacer(state.getRuntime().getAnswers().toJS());
  const options = state.getOptions();
  const editorReducedState = state
    .update('survey', survey => surveyReducer(survey, options, action, replacer))
    .update('runtime', runtime => runtimeValueReducer(runtime, action, replacer))
    .update('view', view => viewSettingReducer(view, action));
  const newState = runtimeReducer(editorReducedState, action);
  const newSurvey = newState.getSurvey();
  newSurvey.refreshReplacer(newState.getRuntime().getAnswers().toJS());
  surveyDevIdGeneratorInstance.updateExistingIds(newSurvey);
  return newState;
}
