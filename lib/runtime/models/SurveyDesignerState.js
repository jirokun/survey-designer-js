import { List, Map, Record, fromJS } from 'immutable';
import uuid from 'node-uuid';
import S from 'string';
import PageDefinition from './survey/PageDefinition';
import BranchDefinition from './survey/BranchDefinition';
import FinisherDefinition from './survey/FinisherDefinition';
import ConditionDefinition from './survey/ConditionDefinition';
import ChildConditionDefinition from './survey/ChildConditionDefinition';
import NodeDefinition from './survey/NodeDefinition';
import ItemDefinition from './survey/questions/ItemDefinition';
import RuntimeValue from './runtime/RuntimeValue';
import ViewSetting from './view/ViewSetting';
import Options from './options/Options';
import { findQuestionDefinitionClass } from './survey/questions/QuestionDefinitions';

export const SurveyDesignerStateRecord = Record({
  runtime: new RuntimeValue(),   // ランタイム時に使用する値
  survey: null,                  // アンケートの定義
  view: new ViewSetting(),       // エディタの設定
  options: new Options(),        // 外部から指定可能なオプション
});

/** editor, runtimeなどで動作するときにReduxが持つstateのトップレベル定義 */
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

  getRuntime() {
    return this.get('runtime');
  }

  // for view
  getViewSetting() {
    return this.get('view');
  }

  // for definitions
  getOptions() {
    return this.get('options');
  }

  getSurvey() {
    return this.get('survey');
  }

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
    const ret = this.getPages().find(def => def.getId() === pageId);
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
    const ret = this.getNodes().find(def => def.getId() === nodeId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid nodeId: ${nodeId}`);
  }

  /** branchを探す */
  findBranch(branchId) {
    const ret = this.getBranches().find(def => def.getId() === branchId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid branchId: ${branchId}`);
  }

  /** conditionを探す */
  findCondition(branchId, conditionId) {
    const ret = this.findBranch(branchId).getConditions().find(def => def.getId() === conditionId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid conditionId: ${conditionId}`);
  }

  /** finisherを探す */
  findFinisher(finisherId) {
    const ret = this.getFinishers().find(def => def.getId() === finisherId);
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
    return this.setIn(['survey', 'finishers'], this.getFinishers().filter(finisher => finisher.getId() !== finisherId).toList());
  }

  /** itemを削除する */
  deleteItem(pageId, questionId, itemId) {
    const pageIndex = this.findPageIndex(pageId);
    const questionIndex = this.findQuestionIndex(pageId, questionId);

    const question = this.findQuestion(questionId);
    const filteredQuestion = question.set('items', question.getItems().filter(item => item.getId() !== itemId).toList());
    const fixedIndexQuestion = filteredQuestion.fixItemIndex();
    return this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex], fixedIndexQuestion);
  }

  /** nodeを削除する */
  deleteNode(nodeId) {
    const node = this.findNode(nodeId);
    let refDeletedState;
    if (node.isPage()) refDeletedState = this.deletePage(node.getRefId());
    else if (node.isBranch()) refDeletedState = this.deleteBranch(node.getRefId());
    else if (node.isFinisher()) refDeletedState = this.deleteFinisher(node.getRefId());
    else throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);

    // 該当のnodeを削除
    refDeletedState = refDeletedState.setIn(['survey', 'nodes'], this.getNodes().filter(f => f.getId() !== nodeId).toList());

    // currentNodeId更新
    if (refDeletedState.getCurrentNodeId() === nodeId) {
      refDeletedState = refDeletedState.setCurrentNodeId(refDeletedState.getNodes().get(0).getId());
    }

    // このnodeを参照しているのnodeのnextNodeIdを書き換え
    const branches = refDeletedState.getBranches().map(branch =>
      branch.update('conditions', conditions => conditions.map(condition =>
        condition.set('nextNodeId', condition.nextNodeId === nodeId ? '' : condition.nextNodeId),
      )),
    );
    refDeletedState = refDeletedState.setIn(['survey', 'branches'], branches);

    // このnodeを参照しているのnodeのnextNodeIdを書き換え
    return refDeletedState.updateIn(['survey', 'nodes'], nodes =>
      nodes.map(cn => (node.getId() === cn.getNextNodeId() ? cn.set('nextNodeId', node.getNextNodeId()) : cn)),

    );
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
      const nextNodeId = branch.evaluateConditions(valueMergedState) || nextNode.getNextNodeId();
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

  /** itemのindexを取得する */
  findItemIndex(questionId, itemId) {
    const question = this.findQuestion(questionId);
    return question.getItems().findIndex(item => item.getId() === itemId);
  }

  /** branchのindexを取得する */
  findBranchIndex(branchId) {
    return this.getBranches().findIndex(p => p.getId() === branchId);
  }

  /** conditionのindexを取得する */
  findConditionIndex(branchId, conditionId) {
    return this.findBranch(branchId).getConditions().findIndex(c => c.getId() === conditionId);
  }

  /** finisherのindexを取得する */
  findFinisherIndex(finisherId) {
    return this.getFinishers().findIndex(p => p.getId() === finisherId);
  }

  /** nodeのindexを取得する */
  findNodeIndex(nodeId) {
    return this.getNodes().findIndex(p => p.getId() === nodeId);
  }

  /** titleの更新 */
  updateTitle(title) {
    return this.setIn(['survey', 'title'], title);
  }

  /** panelの更新 */
  updatePanel(panel) {
    return this.setIn(['survey', 'panel'], fromJS(panel));
  }

  /** pageの更新 */
  updatePage(pageId, page) {
    const pageIndex = this.findPageIndex(pageId);
    return this.setIn(['survey', 'pages', pageIndex], page);
  }

  /** questionの属性の更新 */
  updateQuestionAttribute(pageId, questionId, attributeName, value1, value2) {
    const pageIndex = this.findPageIndex(pageId);
    const questionIndex = this.findQuestionIndex(pageId, questionId);
    if (attributeName === 'title') {
      const newState = this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, attributeName], value1)
        .setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, 'plainTitle'], value2);
      return newState;
    }
    if (attributeName === 'items') {
      throw new Error('updateQuestionAttributeではitemsを更新できません');
    }
    return this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, attributeName], value1);
  }

  /** itemの属性の更新 */
  updateItemAttribute(pageId, questionId, itemId, attributeName, value) {
    const pageIndex = this.findPageIndex(pageId);
    const questionIndex = this.findQuestionIndex(pageId, questionId);
    const itemIndex = this.findItemIndex(questionId, itemId);
    return this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex, 'items', itemIndex, attributeName], value);
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
    const questionIndex = this.findQuestionIndex(pageId, questionId);
    const newState = this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex], question);
    return newState;
  }

  updateShowPane(paneName, show) {
    return this.setIn(['view', paneName], show);
  }

  /** surveyの保存リクエスト状態を更新する */
  updateSaveSurveyStatus(saveStatus) {
    return this.setIn(['view', 'saveSurveyStatus'], saveStatus);
  }

  /** 回答の提出状態を更新する */
  updatePostAnswerStatus(postAnswerStatus) {
    return this.setIn(['runtime', 'postAnswerStatus'], postAnswerStatus);
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

  /** itemを追加する */
  addItem(pageId, questionId, index) {
    const pageIndex = this.findPageIndex(pageId);
    const questionIndex = this.findQuestionIndex(pageId, questionId);
    const question = this.findQuestion(questionId);
    const newQuestion = question.set('items', question.getItems().insert(index, ItemDefinition.create(index)));
    return this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex], newQuestion.fixItemIndex());
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

    let surveyAttribute;
    if (node.isPage()) surveyAttribute = 'pages';
    else if (node.isBranch()) surveyAttribute = 'branches';
    else if (node.isFinisher()) surveyAttribute = 'finishers';

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
      _id: uuid.v4(),
      type,
      refId: ref.getId(),
      nextNodeId: nextNode ? nextNode.getId() : null,
    });
  }

  /** 分岐条件を入れ替える */
  swapCondition(nodeId, srcConditionId, destConditionId) {
    const branchId = this.findBranchFromNode(nodeId).getId();
    const branchIndex = this.findBranchIndex(branchId);
    const srcCondition = this.findCondition(branchId, srcConditionId);
    const destCondition = this.findCondition(branchId, destConditionId);
    const srcConditionIndex = this.findConditionIndex(branchId, srcConditionId);
    const destConditionIndex = this.findConditionIndex(branchId, destConditionId);

    return this
      .setIn(['survey', 'branches', branchIndex, 'conditions', destConditionIndex], srcCondition)
      .setIn(['survey', 'branches', branchIndex, 'conditions', srcConditionIndex], destCondition);
  }

  /** itemを入れ替える */
  swapItem(pageId, questionId, srcItemId, destItemId) {
    const pageIndex = this.findPageIndex(pageId);
    const questionIndex = this.findQuestionIndex(pageId, questionId);
    const question = this.findQuestion(questionId);
    const srcIndex = this.findItemIndex(questionId, srcItemId);
    const destIndex = this.findItemIndex(questionId, destItemId);

    const swappedQuestion = question.update('items', items =>
      items.map((item, index) => {
        if (index === srcIndex) return items.get(destIndex);
        if (index === destIndex) return items.get(srcIndex);
        return items.get(index);
      }).toList(),
    );
    return this.setIn(['survey', 'pages', pageIndex, 'questions', questionIndex], swappedQuestion.fixItemIndex());
  }

  /** nodeを入れ替える */
  swapNode(srcNodeId, destNodeId) {
    const srcIndex = this.findNodeIndex(srcNodeId);
    const destIndex = this.findNodeIndex(destNodeId);
    const srcNode = this.findNode(srcNodeId);
    const destNode = this.findNode(destNodeId);

    let newState = this
      .setIn(['survey', 'nodes', destIndex], srcNode.set('nextNodeId', destNode.getNextNodeId()))
      .setIn(['survey', 'nodes', srcIndex], destNode.set('nextNodeId', srcNode.getNextNodeId()));

    // 入れ替えるノードの一つ前のノードも変更
    if (srcIndex > 0) {
      const preSrcNode = newState.getIn(['survey', 'nodes', srcIndex - 1]);
      newState = newState.setIn(['survey', 'nodes', srcIndex - 1], preSrcNode.set('nextNodeId', destNode.getId()));
    }
    if (destIndex > 0) {
      const preDestNode = newState.getIn(['survey', 'nodes', destIndex - 1]);
      newState = newState.setIn(['survey', 'nodes', destIndex - 1], preDestNode.set('nextNodeId', srcNode.getId()));
    }
    return newState;
  }

  /** questionを入れ替える */
  swapQuestion(nodeId, srcQuestionId, destQuestionId) {
    const page = this.findPageFromNode(nodeId);
    const pageIndex = this.findPageIndex(page.getId());
    const srcQuestionIndex = this.findQuestionIndex(page.getId(), srcQuestionId);
    const destQuestionIndex = this.findQuestionIndex(page.getId(), destQuestionId);
    const srcQuestion = this.findQuestion(srcQuestionId);
    const destQuestion = this.findQuestion(destQuestionId);

    return this
      .setIn(['survey', 'pages', pageIndex, 'questions', destQuestionIndex], srcQuestion)
      .setIn(['survey', 'pages', pageIndex, 'questions', srcQuestionIndex], destQuestion);
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

  /** nodeのラベルを取得する */
  calcNodeLabel(nodeId, simple = false) {
    if (S(nodeId).isEmpty()) {
      return '未設定';
    }
    const nextNode = this.findNode(nodeId);
    if (nextNode.isPage()) {
      const page = this.findPageFromNode(nodeId);
      return this.calcPageLabel(page.getId());
    } else if (nextNode.isBranch()) {
      return '未設定';
    } else if (nextNode.isFinisher()) {
      const finisher = this.findFinisherFromNode(nodeId);
      if (simple) return `終了 ${this.calcFinisherNo(finisher.getId())}`;
      return `終了 ${this.calcFinisherNo(finisher.getId())} ${finisher.getFinishType()} ${finisher.getPoint()}pt`;
    }
    throw new Error(`nodeIdが不正です。 nodeId: ${nodeId}`);
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
   * 後続のpageとfinisherのnodeId一覧を取得する。
   *
   * 最初に指定したnodeIdがpageであればそれも含む
   */
  findFollowingPageAndFinisherNodeIds(nodeId, nodeList = []) {
    if (!nodeId) return nodeList;
    const node = this.findNode(nodeId);
    if (node.isPage() || node.isFinisher()) {
      nodeList.push(nodeId);
    }
    this.findFollowingPageAndFinisherNodeIds(node.getNextNodeId(), nodeList);
    return nodeList;
  }

  getAllQuestions() {
    return this.getPages().map(page => page.getQuestions()).toList().flatten(true);
  }

  /**
   * すべての設問のOutputDefinitionをidをkeyにして返す
   */
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
