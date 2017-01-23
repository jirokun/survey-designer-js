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
}
