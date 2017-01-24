import { Record } from 'immutable';

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

  /** ページの更新 */
  updatePage(pageId, page) {
    const pageIndex = this.getPageDefs().findIndex(p => p.getId() === pageId);
    return this.setIn(['defs', 'pageDefs', pageIndex], page);
  }
}
