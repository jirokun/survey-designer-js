import { Record } from 'immutable';
import uuid from 'node-uuid';
import PageDefinition from './PageDefinition';
import BranchDefinition from './BranchDefinition';
import FlowDefinition from './FlowDefinition';

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
  getEditorHeight() {
    return this.getIn(['viewSettings', 'editorHeight']);
  }

  getGraphWidth() {
    return this.getIn(['viewSettings', 'graphWidth']);
  }

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

  /** stateからpageを探す */
  findPage(pageId) {
    const ret = this.getPageDefs().find(def => def.id === pageId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid pageId: ${pageId}`);
  }

  /** stateからflowを探す */
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

  /** pageの更新 */
  updatePage(pageId, page) {
    const pageIndex = this.getPageDefs().findIndex(p => p.getId() === pageId);
    return this.setIn(['defs', 'pageDefs', pageIndex], page);
  }

  /** questionの更新 */
  updateQuestion(pageId, questionId, question) {
    const pageIndex = this.getPageDefs().findIndex(p => p.getId() === pageId);
    const questionIndex = this.findPage(pageId).getQuestions().findIndex(q => q.getId() === questionId);
    return this.setIn(['defs', 'pageDefs', pageIndex, 'questions', questionIndex], question);
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

  /** flowを作成する */
  createFlow(pageOrBranch, insertIndex) {
    const nextFlow = this.getFlowDefs().get(insertIndex);
    return new FlowDefinition({
      id: uuid.v1(),
      type: pageOrBranch.constructor.name === 'PageDefinition' ? 'page' : 'branch',
      refId: pageOrBranch.getId(),
      nextFlowId: nextFlow.getId(),
    });
  }
}
