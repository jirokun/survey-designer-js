import { Record, List, Map, fromJS } from 'immutable';
import cuid from 'cuid';
import S from 'string';
import ReplaceUtil from '../../../ReplaceUtil';
import PageDefinition from './PageDefinition';
import BranchDefinition from './BranchDefinition';
import FinisherDefinition from './FinisherDefinition';
import NodeDefinition from './NodeDefinition';

export const SurveyDefinitionRecord = Record({
  _id: '',
  title: '',
  version: 1,
  pages: List(),
  branches: List(),
  finishers: List(),
  nodes: List(),
  panel: Map(),
});

/** アンケートの定義 */
export default class SurveyDefinition extends SurveyDefinitionRecord {
  // ------------------------- 単純なgetter -----------------------------
  getId() {
    return this.get('_id');
  }

  getTitle() {
    return this.get('title');
  }

  getPanel() {
    return this.get('panel');
  }

  getPages() {
    return this.get('pages');
  }

  getBranches() {
    return this.get('branches');
  }

  getFinishers() {
    return this.get('finishers');
  }

  getNodes() {
    return this.get('nodes');
  }

  // ------------------------- finder -----------------------------
  /** nodeを探す */
  findNode(nodeId) {
    const ret = this.getNodes().find(def => def.getId() === nodeId);
    if (ret) {
      return ret;
    }
    return null; // nodeを削除したときには現在選択しているnodeがnullになる
  }

  /** pageを探す */
  findPage(pageId) {
    const ret = this.getPages().find(def => def.getId() === pageId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid pageId: ${pageId}`);
  }

  /** branchを探す */
  findBranch(branchId) {
    const ret = this.getBranches().find(def => def.getId() === branchId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid branchId: ${branchId}`);
  }

  /** finisherを探す */
  findFinisher(finisherId) {
    const ret = this.getFinishers().find(def => def.getId() === finisherId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid finisherId: ${finisherId}`);
  }

  /** nodeのindexを取得する */
  findNodeIndex(nodeId) {
    return this.getNodes().findIndex(p => p.getId() === nodeId);
  }

  /** pageのindexを取得する */
  findPageIndex(pageId) {
    return this.getPages().findIndex(p => p.getId() === pageId);
  }

  /** branchのindexを取得する */
  findBranchIndex(branchId) {
    return this.getBranches().findIndex(p => p.getId() === branchId);
  }

  /** finisherのindexを取得する */
  findFinisherIndex(finisherId) {
    return this.getFinishers().findIndex(p => p.getId() === finisherId);
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

  /** questionを探す */
  findQuestion(questionId) {
    return this.getPages()
      .flatMap(page => page.getQuestions())
      .find(question => question.getId() === questionId);
  }

  // ------------------------- calc -----------------------------
  /** pageIdに対応するページ番号を生成する */
  calcPageNo(pageId) {
    const nodes = this.getNodes();
    let pageNo = 1;
    for (let i = 0, len = nodes.size; i < len; i++) {
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

  /** questionIdに対応する番号を生成する */
  calcQuestionNo(pageId, questionId) {
    const page = this.findPage(pageId);
    const questions = page.getQuestions();
    return questions.findIndex(q => q.getId() === questionId) + 1;
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

  // ------------------------- 削除系 -----------------------------
  /** pageを削除する */
  removePage(pageId) {
    return this.set('pages', this.getPages().filter(page => page.getId() !== pageId).toList());
  }

  /** branchを削除する */
  removeBranch(branchId) {
    return this.set('branches', this.getBranches().filter(branch => branch.getId() !== branchId).toList());
  }

  /** finisherを削除する */
  removeFinisher(finisherId) {
    return this.set('finishers', this.getFinishers().filter(finisher => finisher.getId() !== finisherId).toList());
  }

  /** nodeを削除する */
  removeNode(nodeId) {
    const node = this.findNode(nodeId);
    let refDeletedSurvey;
    if (node.isPage()) refDeletedSurvey = this.removePage(node.getRefId());
    else if (node.isBranch()) refDeletedSurvey = this.removeBranch(node.getRefId());
    else if (node.isFinisher()) refDeletedSurvey = this.removeFinisher(node.getRefId());
    else throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);

    // 該当のnodeを削除
    refDeletedSurvey = refDeletedSurvey.set('nodes', this.getNodes().filter(f => f.getId() !== nodeId).toList());

    // このnodeを参照しているのconditionのnextNodeIdを書き換え
    const branches = refDeletedSurvey.getBranches().map(branch =>
      branch.update('conditions', conditions => conditions.map(condition =>
        condition.set('nextNodeId', condition.nextNodeId === nodeId ? '' : condition.nextNodeId),
      )),
    );
    refDeletedSurvey = refDeletedSurvey.set('branches', branches);

    // このnodeを参照しているのnodeのnextNodeIdを書き換え
    return refDeletedSurvey.update('nodes', nodes =>
      nodes.map(cn => (node.getId() === cn.getNextNodeId() ? cn.set('nextNodeId', node.getNextNodeId()) : cn)),
    );
  }

  // ------------------------- 更新系 -----------------------------
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
      newState = this.update('nodes', arr => arr.setIn([nodeIndex - 1, 'nextNodeId'], node.getId()));
    }

    let surveyAttribute;
    if (node.isPage()) surveyAttribute = 'pages';
    else if (node.isBranch()) surveyAttribute = 'branches';
    else if (node.isFinisher()) surveyAttribute = 'finishers';

    return newState.update('nodes', arr => arr.insert(nodeIndex, node))
      .update(surveyAttribute, arr => arr.push(ref));
  }

  /** nodeを入れ替える */
  swapNode(srcNodeId, destNodeId) {
    const srcIndex = this.findNodeIndex(srcNodeId);
    const destIndex = this.findNodeIndex(destNodeId);
    const srcNode = this.findNode(srcNodeId);
    const destNode = this.findNode(destNodeId);

    let newSurvey = this
      .setIn(['nodes', destIndex], srcNode.set('nextNodeId', destNode.getNextNodeId()))
      .setIn(['nodes', srcIndex], destNode.set('nextNodeId', srcNode.getNextNodeId()));

    // 入れ替えるノードの一つ前のノードも変更
    if (srcIndex > 0) {
      const preSrcNode = newSurvey.getIn(['nodes', srcIndex - 1]);
      newSurvey = newSurvey.setIn(['nodes', srcIndex - 1], preSrcNode.set('nextNodeId', destNode.getId()));
    }
    if (destIndex > 0) {
      const preDestNode = newSurvey.getIn(['nodes', destIndex - 1]);
      newSurvey = newSurvey.setIn(['nodes', destIndex - 1], preDestNode.set('nextNodeId', srcNode.getId()));
    }
    return newSurvey;
  }

  /** titleの更新 */
  updateTitle(title) {
    return this.set('title', title);
  }

  /** panelの更新 */
  updatePanel(panel) {
    return this.set('panel', fromJS(panel));
  }

  // ------------------------- ユーティリティ -----------------------------
  /** nodeを作成する */
  createNode(ref, type, insertIndex) {
    const nextNode = this.getNodes().get(insertIndex);
    return new NodeDefinition({
      _id: cuid(),
      type,
      refId: ref.getId(),
      nextNodeId: nextNode ? nextNode.getId() : null,
    });
  }

  /** ReplaceUtilを生成して返す */
  createReplaceUtil(answers) {
    return new ReplaceUtil(this.getAllOutputDefinitionMap(), this.getQuestionNoMap(), answers);
  }

  /**
   * すべての設問のOutputDefinitionをidをkeyにして返す
   */
  getAllOutputDefinitionMap() {
    let map = Map();
    const allOutputDefinitions = this.getPages().flatMap((page) => {
      const pageNo = this.calcPageNo(page.getId());
      return page.getQuestions().flatMap(question => question.getOutputDefinitions(pageNo, this.calcQuestionNo(page.getId(), question.getId())))
        .concat(page.getLogicVariableOutputDefinitions());
    }).toList();
    allOutputDefinitions.forEach((outputDefinition) => {
      const outputId = outputDefinition.getId();
      if (map.has(outputId)) {
        throw new Error(`outputIdが重複しています。outputId: ${outputId}`);
      }
      map = map.set(outputId, outputDefinition);
    });
    return map;
  }

  /** outputDefinitionのnameと設問番号の対応付を返す */
  getQuestionNoMap() {
    const questionNoMap = {};
    this.getPages().forEach((page) => {
      const pageNo = this.calcPageNo(page.getId());
      page.getQuestions().forEach((question) => {
        const questionNo = this.calcQuestionNo(page.getId(), question.getId());
        question.getOutputDefinitions(pageNo, questionNo).forEach((od) => {
          questionNoMap[od.getOutputNo()] = od.getName();
        });
      });
      page.getLogicVariableOutputDefinitions().forEach((od) => { questionNoMap[od.getOutputNo()] = od.getName(); });
    });
    return questionNoMap;
  }

  /** outputDefinitionの設問番号とnameの対応付を返す */
  getQuestionNameMap() {
    const questionNameMap = {};
    this.getPages().forEach((page) => {
      const pageNo = this.calcPageNo(page.getId());
      page.getQuestions().forEach((question) => {
        const questionNo = this.calcQuestionNo(page.getId(), question.getId());
        question.getOutputDefinitions(pageNo, questionNo).forEach((od) => {
          questionNameMap[od.getName()] = od.getOutputNo();
        });
      });
    });
    return questionNameMap;
  }

  /**
   * すべてのquestionを取得する
   */
  getAllQuestions() {
    return this.getPages().flatMap(page => page.getQuestions()).toList();
  }

  /**
   * 先行するページのnodeId一覧を取得する。
   *
   * 最初に指定したnodeIdがpageであればそれも含む
   * 含みたくない場合はincludeSelfをfalseに設定する
   */
  findPrecedingPageNodeIds(nodeId, includeSelf = true, currentNodeId = null, nodeList = []) {
    const id = currentNodeId || this.getNodes().get(0).getId();
    const node = this.findNode(id);
    if (node.isPage() && !(includeSelf === false && nodeId === id)) {
      nodeList.push(id);
    }
    if (nodeId !== id) {
      this.findPrecedingPageNodeIds(nodeId, includeSelf, node.getNextNodeId(), nodeList);
    }
    return nodeList;
  }

  /** 先行するページが出力するOutputDefinitionをすべて取得する */
  findPrecedingOutputDefinition(nodeId, includeSelf = true) {
    const precedingPageNodeIds = this.findPrecedingPageNodeIds(nodeId, includeSelf);
    const optionValues = List(precedingPageNodeIds).flatMap((nodeId2) => {
      const page = this.findPageFromNode(nodeId2);
      const pageNo = this.calcPageNo(page.getId());
      const options = page.getQuestions().flatMap((question) => {
        const questionNo = this.calcQuestionNo(page.getId(), question.getId());
        return question.getOutputDefinitions(pageNo, questionNo);
      }).toList().concat(page.getLogicVariableOutputDefinitions());
      return options;
    }).toList();
    return optionValues;
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
}
