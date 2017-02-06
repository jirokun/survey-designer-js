import { List, Map, Record } from 'immutable';
import uuid from 'node-uuid';
import PageDefinition from './definitions/PageDefinition';
import BranchDefinition from './definitions/BranchDefinition';
import NodeDefinition from './definitions/NodeDefinition';
import { findQuestionDefinitionClass } from './definitions/questions/QuestionDefinitions';

export const SurveyDesignerStateRecord = Record({
  runtime: null,
  survey: null,
  view: null,
});

export default class SurveyDesignerState extends SurveyDesignerStateRecord {
  // for runtime
  getCurrentNodeId() {
    return this.getIn(['runtime', 'currentNodeId']);
  }

  getNodeStack() {
    return this.getIn(['runtime', 'flowStack']);
  }

  getInputValues() {
    return this.getIn(['runtime', 'answers']);
  }

  // for view
  getViewSetting() {
    return this.get('view');
  }

  // for definitions
  getBranches() {
    return this.getIn(['survey', 'branches']);
  }

  getPages() {
    return this.getIn(['survey', 'pages']);
  }

  getNodes() {
    return this.getIn(['survey', 'nodes']);
  }

  /** pageを探す */
  findPage(pageId) {
    const ret = this.getPages().find(def => def.id === pageId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid pageId: ${pageId}`);
  }

  /** questionを探す */
  findQuestion(questionId) {
    return this.getPages()
      .map(page => page.getQuestions())
      .flatten(true)
      .find(question => question.getId() === questionId);
  }

  /** flowを探す */
  findNode(flowId) {
    const ret = this.getNodes().find(def => def.id === flowId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid flowId: ${flowId}`);
  }

  /** branchを探す */
  findBranch(branchId) {
    const ret = this.getBranches().find(def => def.id === branchId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid branchId: ${branchId}`);
  }

  /** flowIdから対応するbranchを探す */
  findBranchFromNode(flowId) {
    const flow = this.findNode(flowId);
    return !flow ? null : this.findBranch(flow.get('refId'));
  }

  /** flowIdからpageIdを引く */
  findPageFromNode(flowId) {
    const flow = this.findNode(flowId);
    return !flow ? null : this.findPage(flow.get('refId'));
  }

  /** 現在のpageを探す */
  findCurrentPage() {
    return this.findPageFromNode(this.getCurrentNodeId());
  }

  /** 現在のbranchを探す */
  findCurrentNode() {
    return this.findNode(this.getCurrentNodeId());
  }

  /** 現在のbranchを探す */
  findCurrentBranch() {
    return this.findBranchFromNode(this.getCurrentNodeId());
  }

  // update methods
  /** viewのエディタの高さを設定 */
  setEditorHeight(value) {
    return this.setIn(['view', 'editorHeight'], value);
  }

  /** viewのグラフの高さを設定 */
  setGraphWidth(value) {
    return this.setIn(['view', 'graphWidth'], value);
  }

  /** 現在のflowIdを設定する */
  setCurrentNodeId(value) {
    return this.setIn(['runtime', 'currentNodeId'], value);
  }

  /** branchを削除する */
  deleteBranch(branchId) {
    return this.setIn(['survey', 'branches'], this.getBranches().filter(branch => branch.getId() !== branchId).toList());
  }

  /** pageを削除する */
  deletePage(pageId) {
    return this.setIn(['survey', 'pages'], this.getPages().filter(page => page.getId() !== pageId).toList());
  }

  /** flowを削除する */
  deleteNode(flowId) {
    const flow = this.findNode(flowId);
    const refDeletedState = flow.isPage() ? this.deletePage(flow.getRefId()) : this.deleteBranch(flow.getRefId());
    const flowDeletedState = refDeletedState.setIn(['survey', 'nodes'], this.getNodes().filter(f => f.getId() !== flowId).toList());
    // currentNodeIdも更新
    if (flowDeletedState.getCurrentNodeId() === flowId) {
      return flowDeletedState.setCurrentNodeId(flowDeletedState.getNodes().get(0).getId());
    }
    return flowDeletedState;
  }

  /** pageのsubmit */
  submitPage(values) {
    return this.mergeIn(['runtime', 'answers'], values)
      .setIn(['runtime', 'currentNodeId'], this.findCurrentNode().getNextNodeId());
  }

  /** pageの更新 */
  updatePage(pageId, page) {
    const pageIndex = this.getPages().findIndex(p => p.getId() === pageId);
    return this.setIn(['survey', 'pages', pageIndex], page);
  }

  /** questionの属性の更新 */
  updateQuestionAttribute(pageId, questionId, attributeName, value1, value2) {
    const pageIndex = this.getPages().findIndex(p => p.getId() === pageId);
    const questionIndex = this.findPage(pageId).getQuestions().findIndex(q => q.getId() === questionId);
    if (attributeName === 'title') {
      const newState = this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, attributeName], value1)
        .setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, 'plainTitle'], value2);
      return newState;
    }
    if (attributeName === 'items') {
      // itemsの場合はindexを修正する
      const newState = this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, attributeName], value1);
      const question = newState.findQuestion(questionId);
      return newState.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, attributeName], question.fixItemIndex());
    }
    return this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, attributeName], value1);
  }

  /** questionの更新 */
  updateQuestion(pageId, questionId, question) {
    const pageIndex = this.getPages().findIndex(p => p.getId() === pageId);
    const questionIndex = this.findPage(pageId).getQuestions().findIndex(q => q.getId() === questionId);
    const newState = this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex], question);
    return newState;
  }

  updateShowPane(paneName, show) {
    return this.setIn(['view', paneName], show);
  }

  /** flowの追加, typeにはpageまたはbranchを指定する */
  addNode(flowIndex, type) {
    const ref = type === 'page' ? PageDefinition.create() : BranchDefinition.create();
    const flow = this.createNode(ref, flowIndex);
    let newState = this;
    if (flowIndex > 0) {
      newState = this.updateIn(['survey', 'nodes'], arr => arr.setIn([flowIndex - 1, 'nextNodeId'], flow.getId()));
    }
    const surveyAttribute = type === 'page' ? 'pages' : 'branches';
    return newState.updateIn(['survey', 'nodes'], arr => arr.insert(flowIndex, flow))
      .updateIn(['survey', surveyAttribute], arr => arr.push(ref));
  }

  /** pageにコンポーネントを追加する */
  addQuestion(questionClassName, pageId, index) {
    const Model = findQuestionDefinitionClass(questionClassName);
    const question = Model.create();
    const newQuestions = this.findPage(pageId).getQuestions().insert(index, question);
    const pageIndex = this.getPages().findIndex(p => p.getId() === pageId);
    return this.setIn(['survey', 'pages', pageIndex, 'questions'], newQuestions);
  }

  /** flowを作成する */
  createNode(pageOrBranch, insertIndex) {
    const nextNode = this.getNodes().get(insertIndex);
    return new NodeDefinition({
      id: uuid.v4(),
      type: pageOrBranch.constructor.name === 'PageDefinition' ? 'page' : 'branch',
      refId: pageOrBranch.getId(),
      nextNodeId: nextNode.getId(),
    });
  }

  /** RuntimeValueを初期化して最初からやり直す */
  restart() {
    return this
      .setIn(['runtime', 'currentNodeId'], this.getNodes().get(0).getId())
      .setIn(['runtime', 'answers'], Map())
      .setIn(['runtime', 'flowStack'], List());
  }
}
