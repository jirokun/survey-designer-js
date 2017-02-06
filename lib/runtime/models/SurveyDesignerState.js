import { List, Map, Record } from 'immutable';
import uuid from 'node-uuid';
import PageDefinition from './definitions/PageDefinition';
import BranchDefinition from './definitions/BranchDefinition';
import FlowDefinition from './definitions/FlowDefinition';
import { findQuestionDefinitionClass } from './definitions/questions/QuestionDefinitions';

export const SurveyDesignerStateRecord = Record({
  runtimeValues: null,
  defs: null,
  viewSettings: null,
});

export default class SurveyDesignerState extends SurveyDesignerStateRecord {
  // for runtimeValues
  getCurrentFlowId() {
    return this.getIn(['runtimeValues', 'currentFlowId']);
  }

  getFlowStack() {
    return this.getIn(['runtimeValues', 'flowStack']);
  }

  getInputValues() {
    return this.getIn(['runtimeValues', 'inputValues']);
  }

  // for viewSettings
  getViewSetting() {
    return this.get('viewSettings');
  }

  // for definitions
  getBranchDefs() {
    return this.getIn(['defs', 'branchDefs']);
  }

  getPageDefs() {
    return this.getIn(['defs', 'pageDefs']);
  }

  getFlowDefs() {
    return this.getIn(['defs', 'flowDefs']);
  }

  /** pageを探す */
  findPage(pageId) {
    const ret = this.getPageDefs().find(def => def.id === pageId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid pageId: ${pageId}`);
  }

  /** questionを探す */
  findQuestion(questionId) {
    return this.getPageDefs()
      .map(page => page.getQuestions())
      .flatten(true)
      .find(question => question.getId() === questionId);
  }

  /** flowを探す */
  findFlow(flowId) {
    const ret = this.getFlowDefs().find(def => def.id === flowId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid flowId: ${flowId}`);
  }

  /** branchを探す */
  findBranch(branchId) {
    const ret = this.getBranchDefs().find(def => def.id === branchId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid branchId: ${branchId}`);
  }

  /** flowIdから対応するbranchを探す */
  findBranchFromFlow(flowId) {
    const flow = this.findFlow(flowId);
    return !flow ? null : this.findBranch(flow.get('refId'));
  }

  /** flowIdからpageIdを引く */
  findPageFromFlow(flowId) {
    const flow = this.findFlow(flowId);
    return !flow ? null : this.findPage(flow.get('refId'));
  }

  /** 現在のpageを探す */
  findCurrentPage() {
    return this.findPageFromFlow(this.getCurrentFlowId());
  }

  /** 現在のbranchを探す */
  findCurrentFlow() {
    return this.findFlow(this.getCurrentFlowId());
  }

  /** 現在のbranchを探す */
  findCurrentBranch() {
    return this.findBranchFromFlow(this.getCurrentFlowId());
  }

  // update methods
  /** viewのエディタの高さを設定 */
  setEditorHeight(value) {
    return this.setIn(['viewSettings', 'editorHeight'], value);
  }

  /** viewのグラフの高さを設定 */
  setGraphWidth(value) {
    return this.setIn(['viewSettings', 'graphWidth'], value);
  }

  /** 現在のflowIdを設定する */
  setCurrentFlowId(value) {
    return this.setIn(['runtimeValues', 'currentFlowId'], value);
  }

  /** branchを削除する */
  deleteBranch(branchId) {
    return this.setIn(['defs', 'branchDefs'], this.getBranchDefs().filter(branch => branch.getId() !== branchId).toList());
  }

  /** pageを削除する */
  deletePage(pageId) {
    return this.setIn(['defs', 'pageDefs'], this.getPageDefs().filter(page => page.getId() !== pageId).toList());
  }

  /** flowを削除する */
  deleteFlow(flowId) {
    const flow = this.findFlow(flowId);
    const refDeletedState = flow.isPage() ? this.deletePage(flow.getRefId()) : this.deleteBranch(flow.getRefId());
    const flowDeletedState = refDeletedState.setIn(['defs', 'flowDefs'], this.getFlowDefs().filter(f => f.getId() !== flowId).toList());
    // currentFlowIdも更新
    if (flowDeletedState.getCurrentFlowId() === flowId) {
      return flowDeletedState.setCurrentFlowId(flowDeletedState.getFlowDefs().get(0).getId());
    }
    return flowDeletedState;
  }

  /** pageのsubmit */
  submitPage(values) {
    return this.mergeIn(['runtimeValues', 'inputValues'], values)
      .setIn(['runtimeValues', 'currentFlowId'], this.findCurrentFlow().getNextFlowId());
  }

  /** pageの更新 */
  updatePage(pageId, page) {
    const pageIndex = this.getPageDefs().findIndex(p => p.getId() === pageId);
    return this.setIn(['defs', 'pageDefs', pageIndex], page);
  }

  /** questionの属性の更新 */
  updateQuestionAttribute(pageId, questionId, attributeName, value1, value2) {
    const pageIndex = this.getPageDefs().findIndex(p => p.getId() === pageId);
    const questionIndex = this.findPage(pageId).getQuestions().findIndex(q => q.getId() === questionId);
    if (attributeName === 'title') {
      const newState = this.setIn(['defs', 'pageDefs', pageIndex, 'questions', questionIndex, attributeName], value1)
        .setIn(['defs', 'pageDefs', pageIndex, 'questions', questionIndex, 'plainTitle'], value2);
      return newState;
    }
    if (attributeName === 'items') {
      // itemsの場合はindexを修正する
      const newState = this.setIn(['defs', 'pageDefs', pageIndex, 'questions', questionIndex, attributeName], value1);
      const question = newState.findQuestion(questionId);
      return newState.setIn(['defs', 'pageDefs', pageIndex, 'questions', questionIndex, attributeName], question.fixItemIndex());
    }
    return this.setIn(['defs', 'pageDefs', pageIndex, 'questions', questionIndex, attributeName], value1);
  }

  /** questionの更新 */
  updateQuestion(pageId, questionId, question) {
    const pageIndex = this.getPageDefs().findIndex(p => p.getId() === pageId);
    const questionIndex = this.findPage(pageId).getQuestions().findIndex(q => q.getId() === questionId);
    const newState = this.setIn(['defs', 'pageDefs', pageIndex, 'questions', questionIndex], question);
    return newState;
  }

  updateShowPane(paneName, show) {
    return this.setIn(['viewSettings', paneName], show);
  }

  /** flowの追加, typeにはpageまたはbranchを指定する */
  addFlow(flowIndex, type) {
    const ref = type === 'page' ? PageDefinition.create() : BranchDefinition.create();
    const flow = this.createFlow(ref, flowIndex);
    let newState = this;
    if (flowIndex > 0) {
      newState = this.updateIn(['defs', 'flowDefs'], arr => arr.setIn([flowIndex - 1, 'nextFlowId'], flow.getId()));
    }
    return newState.updateIn(['defs', 'flowDefs'], arr => arr.insert(flowIndex, flow))
      .updateIn(['defs', `${type}Defs`], arr => arr.push(ref));
  }

  /** pageにコンポーネントを追加する */
  addQuestion(questionClassName, pageId, index) {
    const Model = findQuestionDefinitionClass(questionClassName);
    const question = Model.create();
    const newQuestions = this.findPage(pageId).getQuestions().insert(index, question);
    const pageIndex = this.getPageDefs().findIndex(p => p.getId() === pageId);
    return this.setIn(['defs', 'pageDefs', pageIndex, 'questions'], newQuestions);
  }

  /** flowを作成する */
  createFlow(pageOrBranch, insertIndex) {
    const nextFlow = this.getFlowDefs().get(insertIndex);
    return new FlowDefinition({
      id: uuid.v4(),
      type: pageOrBranch.constructor.name === 'PageDefinition' ? 'page' : 'branch',
      refId: pageOrBranch.getId(),
      nextFlowId: nextFlow.getId(),
    });
  }

  /** RuntimeValueを初期化して最初からやり直す */
  restart() {
    return this
      .setIn(['runtimeValues', 'currentFlowId'], this.getFlowDefs().get(0).getId())
      .setIn(['runtimeValues', 'inputValues'], Map())
      .setIn(['runtimeValues', 'flowStack'], List());
  }
}
