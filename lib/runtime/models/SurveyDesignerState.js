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
    return this.getIn(['runtime', 'nodeStack']);
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

  /** nodeを探す */
  findNode(nodeId) {
    const ret = this.getNodes().find(def => def.id === nodeId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid nodeId: ${nodeId}`);
  }

  /** branchを探す */
  findBranch(branchId) {
    const ret = this.getBranches().find(def => def.id === branchId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid branchId: ${branchId}`);
  }

  /** nodeIdから対応するbranchを探す */
  findBranchFromNode(nodeId) {
    const node = this.findNode(nodeId);
    return !node ? null : this.findBranch(node.get('refId'));
  }

  /** nodeIdからpageIdを引く */
  findPageFromNode(nodeId) {
    const node = this.findNode(nodeId);
    return !node ? null : this.findPage(node.get('refId'));
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

  /** 現在のnodeIdを設定する */
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

  /** nodeを削除する */
  deleteNode(nodeId) {
    const node = this.findNode(nodeId);
    const refDeletedState = node.isPage() ? this.deletePage(node.getRefId()) : this.deleteBranch(node.getRefId());
    const nodeDeletedState = refDeletedState.setIn(['survey', 'nodes'], this.getNodes().filter(f => f.getId() !== nodeId).toList());
    // currentNodeIdも更新
    if (nodeDeletedState.getCurrentNodeId() === nodeId) {
      return nodeDeletedState.setCurrentNodeId(nodeDeletedState.getNodes().get(0).getId());
    }
    return nodeDeletedState;
  }

  /** pageのsubmit */
  submitPage(values) {
    return this.mergeIn(['runtime', 'answers'], values)
      .setIn(['runtime', 'currentNodeId'], this.findCurrentNode().getNextNodeId());
  }

  /** pageのindexを取得する */
  findPageIndex(pageId) {
    return this.getPages().findIndex(p => p.getId() === pageId);
  }

  /** branchのindexを取得する */
  findBranchIndex(branchId) {
    return this.getBranches().findIndex(p => p.getId() === branchId);
  }

  /** nodeのindexを取得する */
  findNodeIndex(nodeId) {
    return this.getNodes().findIndex(p => p.getId() === nodeId);
  }

  /** pageの更新 */
  updatePage(pageId, page) {
    const pageIndex = this.findPageIndex(pageId);
    return this.setIn(['survey', 'pages', pageIndex], page);
  }

  /** questionの属性の更新 */
  updateQuestionAttribute(pageId, questionId, attributeName, value1, value2) {
    const pageIndex = this.findPageIndex(pageId);
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

  /** conditionの属性の更新 */
  updateConditionAttribute(branchId, conditionId, attributeName, value) {
    const branchIndex = this.findBranchIndex(branchId);
    const branch = this.findBranch(branchId);
    const conditionIndex = branch.findConditionIndex(conditionId);
    return this.setIn(['survey', 'branches', branchIndex, 'conditions', conditionIndex, attributeName], value);
  }

  /** conditionの属性の更新 */
  updateChildConditionAttribute(branchId, conditionId, childConditionId, attributeName, value) {
    const branchIndex = this.findBranchIndex(branchId);
    const branch = this.findBranch(branchId);
    const conditionIndex = branch.findConditionIndex(conditionId);
    const condition = branch.getConditions().get(conditionIndex);
    const childConditionIndex = condition.findChildConditionIndex(childConditionId);
    return this.setIn(['survey', 'branches', branchIndex, 'conditions', conditionIndex, 'childConditions', childConditionIndex, attributeName], value);
  }

  /** questionの更新 */
  updateQuestion(pageId, questionId, question) {
    const pageIndex = this.findPageIndex(pageId);
    const questionIndex = this.findPage(pageId).getQuestions().findIndex(q => q.getId() === questionId);
    const newState = this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex], question);
    return newState;
  }

  updateShowPane(paneName, show) {
    return this.setIn(['view', paneName], show);
  }

  /** nodeの追加, typeにはpageまたはbranchを指定する */
  addNode(nodeIndex, type) {
    const ref = type === 'page' ? PageDefinition.create() : BranchDefinition.create();
    const node = this.createNode(ref, nodeIndex);
    let newState = this;
    if (nodeIndex > 0) {
      newState = this.updateIn(['survey', 'nodes'], arr => arr.setIn([nodeIndex - 1, 'nextNodeId'], node.getId()));
    }
    const surveyAttribute = type === 'page' ? 'pages' : 'branches';
    return newState.updateIn(['survey', 'nodes'], arr => arr.insert(nodeIndex, node))
      .updateIn(['survey', surveyAttribute], arr => arr.push(ref));
  }

  /** pageにコンポーネントを追加する */
  addQuestion(questionClassName, pageId, index) {
    const Model = findQuestionDefinitionClass(questionClassName);
    const question = Model.create();
    const newQuestions = this.findPage(pageId).getQuestions().insert(index, question);
    const pageIndex = this.findPageIndex(pageId);
    return this.setIn(['survey', 'pages', pageIndex, 'questions'], newQuestions);
  }

  /** nodeを作成する */
  createNode(pageOrBranch, insertIndex) {
    const nextNode = this.getNodes().get(insertIndex);
    return new NodeDefinition({
      id: uuid.v4(),
      type: pageOrBranch.constructor.name === 'PageDefinition' ? 'page' : 'branch',
      refId: pageOrBranch.getId(),
      nextNodeId: nextNode ? nextNode.getId() : null,
    });
  }

  /** 分岐条件を入れ替える */
  swapCondition(branchId, srcIndex, destIndex) {
    const branchIndex = this.findBranchIndex(branchId);
    const srcCondition = this.getIn(['survey', 'branches', branchIndex, 'conditions', srcIndex]);
    const destCondition = this.getIn(['survey', 'branches', branchIndex, 'conditions', destIndex]);
    return this
      .setIn(['survey', 'branches', branchIndex, 'conditions', destIndex], srcCondition)
      .setIn(['survey', 'branches', branchIndex, 'conditions', srcIndex], destCondition);
  }

  /** pageIdに対応するページ番号を生成する */
  calcPageNo(pageId) {
    const nodes = this.getNodes();
    let pageNo = 1;
    for (let i = 0, len = this.getNodes().size; i < len; i++) {
      const node = nodes.get(i);
      if (!node.isPage()) continue;
      const page = this.findPageFromNode(node.getId());
      if (page.getId() !== pageId) {
        pageNo++;
        continue;
      }
      return `${pageNo}`;
    }
    throw new Error(`存在しないpageIdを指定しました: pageId=${pageId}`);
  }

  /** 表示用にページのラベルを取得する */
  calcPageLabel(pageId) {
    const page = this.findPage(pageId);
    return `ページ ${this.calcPageNo(page.getId())}`;
  }

  /** questionIdに対応する番号を生成する */
  calcQuestionNo(pageId, questionId, excludePage = false) {
    const page = this.findPage(pageId);
    const questions = page.getQuestions();
    const questionNo = questions.findIndex(q => q.getId() === questionId) + 1;
    if (excludePage) {
      return `${questionNo}`;
    }
    return `${this.calcPageNo(pageId)}-${questionNo}`;
  }

  /**
   * 先行するページのnodeId一覧を取得する。
   *
   * 最初に指定したnodeIdがpageであればそれも含む
   */
  findPrecedingPageNodeIds(nodeId, currentNodeId = null, nodeList = []) {
    const id = currentNodeId || this.getNodes().get(0).getId();
    const node = this.findNode(id);
    if (node.isPage()) {
      nodeList.push(id);
    }
    if (nodeId !== currentNodeId) {
      this.findPrecedingPageNodeIds(nodeId, node.getNextNodeId(), nodeList);
    }
    return nodeList;
  }

  /**
   * 後続のページのnodeId一覧を取得する。
   *
   * 最初に指定したnodeIdがpageであればそれも含む
   */
  findFollowingPageNodeIds(nodeId, nodeList = []) {
    if (!nodeId) return nodeList;
    const node = this.findNode(nodeId);
    if (node.isPage()) {
      nodeList.push(nodeId);
    }
    this.findFollowingPageNodeIds(node.getNextNodeId(), nodeList);
    return nodeList;
  }

  /** RuntimeValueを初期化して最初からやり直す */
  restart() {
    return this
      .setIn(['runtime', 'currentNodeId'], this.getNodes().get(0).getId())
      .setIn(['runtime', 'answers'], Map())
      .setIn(['runtime', 'nodeStack'], List());
  }
}
