import { List, Map, Record } from 'immutable';
import uuid from 'node-uuid';
import PageDefinition from './definitions/PageDefinition';
import BranchDefinition from './definitions/BranchDefinition';
import FinisherDefinition from './definitions/FinisherDefinition';
import ConditionDefinition from './definitions/ConditionDefinition';
import ChildConditionDefinition from './definitions/ChildConditionDefinition';
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

  getAnswers() {
    return this.getIn(['runtime', 'answers']);
  }

  // for view
  getViewSetting() {
    return this.get('view');
  }

  // for definitions
  getPages() {
    return this.getIn(['survey', 'pages']);
  }

  getBranches() {
    return this.getIn(['survey', 'branches']);
  }

  getFinishers() {
    return this.getIn(['survey', 'finishers']);
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

  /** finisherを探す */
  findFinisher(finisherId) {
    const ret = this.getFinishers().find(def => def.id === finisherId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid finisherId: ${finisherId}`);
  }

  /** nodeIdからpageIdを引く */
  findPageFromNode(nodeId) {
    const node = this.findNode(nodeId);
    return !node ? null : this.findPage(node.get('refId'));
  }

  /** nodeIdから対応するbranchを探す */
  findBranchFromNode(nodeId) {
    const node = this.findNode(nodeId);
    return !node ? null : this.findBranch(node.get('refId'));
  }

  /** nodeIdから対応するbranchを探す */
  findFinisherFromNode(nodeId) {
    const node = this.findNode(nodeId);
    return !node ? null : this.findFinisher(node.get('refId'));
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

  /** 現在のfinisherを探す */
  findCurrentFinisher() {
    return this.findFinisherFromNode(this.getCurrentNodeId());
  }

  // update methods
  /** 現在のnodeIdを設定する */
  setCurrentNodeId(value) {
    return this.setIn(['runtime', 'currentNodeId'], value);
  }

  /** pageを削除する */
  deletePage(pageId) {
    return this.setIn(['survey', 'pages'], this.getPages().filter(page => page.getId() !== pageId).toList());
  }

  /** branchを削除する */
  deleteBranch(branchId) {
    return this.setIn(['survey', 'branches'], this.getBranches().filter(branch => branch.getId() !== branchId).toList());
  }

  /** finisherを削除する */
  deleteFinisher(finisherId) {
    return this.setIn(['survey', 'finishers'], this.getFinisheres().filter(finisher => finisher.getId() !== finisherId).toList());
  }

  /** nodeを削除する */
  deleteNode(nodeId) {
    const node = this.findNode(nodeId);
    let refDeletedState;
    if (node.isPage()) refDeletedState = this.deletePage(node.getRefId());
    else if (node.isBranch()) refDeletedState = this.deleteBranch(node.getRefId());
    else if (node.isFinisher()) refDeletedState = this.deleteFinisher(node.getRefId());
    else throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
    const nodeDeletedState = refDeletedState.setIn(['survey', 'nodes'], this.getNodes().filter(f => f.getId() !== nodeId).toList());
    // currentNodeIdも更新
    if (nodeDeletedState.getCurrentNodeId() === nodeId) {
      return nodeDeletedState.setCurrentNodeId(nodeDeletedState.getNodes().get(0).getId());
    }
    return nodeDeletedState;
  }

  /** questionを削除する */
  deleteQuestion(pageId, questionId) {
    const pageIndex = this.findPageIndex(pageId);
    const page = this.findPage(pageId);
    const questions = page.getQuestions().filter(question => question.getId() !== questionId);
    return this.setIn(['survey', 'pages', pageIndex, 'questions'], questions);
  }

  /** childConditionを削除する */
  deleteChildCondition(branchId, conditionId, childConditionId) {
    const branchIndex = this.findBranchIndex(branchId);
    const branch = this.findBranch(branchId);
    const conditionIndex = branch.findConditionIndex(conditionId);
    const condition = branch.getConditions().get(conditionIndex);
    const childConditions = condition.getChildConditions().filter(cc => cc.getId() !== childConditionId);
    return this.setIn(['survey', 'branches', branchIndex, 'conditions', conditionIndex, 'childConditions'], childConditions);
  }

  /** Conditionを削除する */
  deleteCondition(branchId, conditionId) {
    const branchIndex = this.findBranchIndex(branchId);
    const branch = this.findBranch(branchId);
    const conditions = branch.getConditions().filter(condition => condition.getId() !== conditionId);
    return this.setIn(['survey', 'branches', branchIndex, 'conditions'], conditions);
  }

  /** pageのsubmit */
  submitPage(values) {
    const node = this.findCurrentNode();
    const nextNode = this.findNode(node.getNextNodeId());
    const valueMergedState = this.mergeIn(['runtime', 'answers'], values);
    if (nextNode.isPage()) {
      // 通常遷移
      return valueMergedState.setIn(['runtime', 'currentNodeId'], nextNode.getId());
    } else if (nextNode.isBranch()) {
      // 分岐
      const branch = this.findBranchFromNode(nextNode.getId());
      const nextNodeId = branch.evaluateConditions(valueMergedState.getAnswers()) || nextNode.getNextNodeId();
      return valueMergedState.setIn(['runtime', 'currentNodeId'], nextNodeId);
    } else if (nextNode.isFinisher()) {
      // 終了ページ
      return valueMergedState.setIn(['runtime', 'currentNodeId'], nextNode.getId());
    }
    throw new Error(`不明なnodeTypeです。type: ${nextNode.getType()}`);
  }

  /** pageのindexを取得する */
  findPageIndex(pageId) {
    return this.getPages().findIndex(p => p.getId() === pageId);
  }

  /** questionのindexを取得する */
  findQuestionIndex(pageId, questionId) {
    return this.findPage(pageId).getQuestions().findIndex(q => q.getId() === questionId);
  }

  /** branchのindexを取得する */
  findBranchIndex(branchId) {
    return this.getBranches().findIndex(p => p.getId() === branchId);
  }

  /** finisherのindexを取得する */
  findFinisherIndex(finisherId) {
    return this.getFinishers().findIndex(p => p.getId() === finisherId);
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

  /** finisherの属性の更新 */
  updateFinisherAttribute(finisherId, attributeName, value) {
    const finisherIndex = this.findFinisherIndex(finisherId);
    return this.setIn(['survey', 'finishers', finisherIndex, attributeName], value);
  }

  /** conditionの属性の更新 */
  updateChildConditionAttribute(branchId, conditionId, childConditionId, attributeName, value) {
    const branchIndex = this.findBranchIndex(branchId);
    const branch = this.findBranch(branchId);
    const conditionIndex = branch.findConditionIndex(conditionId);
    const condition = branch.getConditions().get(conditionIndex);
    const childConditionIndex = condition.findChildConditionIndex(childConditionId);
    const newState = this.setIn(['survey', 'branches', branchIndex, 'conditions', conditionIndex, 'childConditions', childConditionIndex, attributeName], value);
    if (attributeName === 'outputId') {
      return newState
        .setIn(['survey', 'branches', branchIndex, 'conditions', conditionIndex, 'childConditions', childConditionIndex, 'operator'], '==')
        .setIn(['survey', 'branches', branchIndex, 'conditions', conditionIndex, 'childConditions', childConditionIndex, 'value'], '');
    }
    return newState;
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

  /** conditionを追加する */
  addCondition(branchId, index) {
    const branchIndex = this.findBranchIndex(branchId);
    const branch = this.findBranch(branchId);
    const conditions = branch.getConditions();
    const newConditions = conditions.insert(index, ConditionDefinition.create());
    return this.setIn(['survey', 'branches', branchIndex, 'conditions'], newConditions);
  }

  /** childConditionを追加する */
  addChildCondition(branchId, conditionId, index) {
    const branchIndex = this.findBranchIndex(branchId);
    const branch = this.findBranch(branchId);
    const conditionIndex = branch.findConditionIndex(conditionId);
    const condition = branch.getConditions().get(conditionIndex);
    const childConditions = condition.getChildConditions();
    const newChildConditions = childConditions.insert(index, ChildConditionDefinition.create());
    return this.setIn(['survey', 'branches', branchIndex, 'conditions', conditionIndex, 'childConditions'], newChildConditions);
  }

  /** nodeの追加, typeにはpageまたはbranchを指定する */
  addNode(nodeIndex, type) {
    let ref;
    if (type === 'page') ref = PageDefinition.create();
    else if (type === 'branch') ref = BranchDefinition.create();
    else if (type === 'finisher') ref = FinisherDefinition.create();
    else throw new Error(`unkown type: ${type}`);

    const node = this.createNode(ref, type, nodeIndex);
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
  createNode(ref, type, insertIndex) {
    const nextNode = this.getNodes().get(insertIndex);
    return new NodeDefinition({
      id: uuid.v4(),
      type,
      refId: ref.getId(),
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
  calcQuestionNo(pageId, questionId, postfix) {
    const page = this.findPage(pageId);
    const questions = page.getQuestions();
    const questionNo = questions.findIndex(q => q.getId() === questionId) + 1;
    if (postfix) {
      return `${this.calcPageNo(pageId)}-${questionNo}-${postfix}`;
    }
    return `${this.calcPageNo(pageId)}-${questionNo}`;
  }

  /** finisherIdに対応するページ番号を生成する */
  calcFinisherNo(finisherId) {
    const nodes = this.getNodes();
    let finisherNo = 1;
    for (let i = 0, len = this.getNodes().size; i < len; i++) {
      const node = nodes.get(i);
      if (!node.isFinisher()) continue;
      const finisher = this.findFinisherFromNode(node.getId());
      if (finisher.getId() !== finisherId) {
        finisherNo++;
        continue;
      }
      return `${finisherNo}`;
    }
    throw new Error(`存在しないfinisherIdを指定しました: finisherId=${finisherId}`);
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

  getAllQuestions() {
    return this.getPages().map(page => page.getQuestions()).toList().flatten(true);
  }

  getAllOutputDefinitionMap() {
    let map = Map();
    const allOutputDefinitionsList = this.getAllQuestions().map(question => question.getOutputDefinitions()).toList().flatten(true);
    allOutputDefinitionsList.forEach((outputDefinition) => {
      const outputId = outputDefinition.getId();
      const value = map.get(outputId);
      if (value) {
        throw new Error(`outputIdが重複しています。outputId: ${outputId}`);
      }
      map = map.set(outputId, outputDefinition);
    });
    return map;
  }

  /** RuntimeValueを初期化して最初からやり直す */
  restart() {
    return this
      .setIn(['runtime', 'currentNodeId'], this.getNodes().get(0).getId())
      .setIn(['runtime', 'answers'], Map())
      .setIn(['runtime', 'nodeStack'], List());
  }
}
