import { Record, List, Map, fromJS } from 'immutable';
import cuid from 'cuid';
import S from 'string';
import Replacer from '../../../Replacer';
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
  panel: null,
});

/** アンケートの定義 */
export default class SurveyDefinition extends SurveyDefinitionRecord {
  constructor(...args) {
    super(...args);
    // ダミーのreplacerCacheを作成しておく
    this.replacerCache = new Replacer([], {});
  }
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

  getFinisherNodes() {
    return this.getNodes().filter(node => node.isFinisher());
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

  /** refIdからnodeを取得する */
  findNodeFromRefId(refId) {
    return this.getNodes().find(node => node.getRefId() === refId);
  }

  findNextPageIdFromRefId(refId) {
    const pageIndex = this.getPages().findIndex((page) => page.getId() === refId );
    if (this.getPages().size <= pageIndex + 1) { return null }
    return this.getPages().get(pageIndex + 1).getId();
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

  /** questionが存在するpageを取得する */
  findPageFromQuestion(questionId) {
    return this.getPages().find(page =>
      page.getQuestions().find(question => question.getId() === questionId) !== undefined);
  }

  /** OutputDefinitionをIDから探す */
  findOutputDefinition(outputDefinitionId) {
    return this.getAllOutputDefinitions().find(od => od.getId() === outputDefinitionId);
  }

  /** OutputDefinitionのnameからOutputDefinitionの実体を取得する */
  findOutputDefinitionFromName(name) {
    return this.getAllOutputDefinitions().find(od => od.getName() === name);
  }

  /** OutputDefinitionのnameからOutputDefinitionのoutputNoを取得する */
  findOutputNoFromName(name) {
    const od = this.findOutputDefinitionFromName(name);
    // edit時にはtransformedItemsの影響でoutputDeifinitionが存在しない瞬間がある
    // 具体的にはpropが更新されたがstateが更新されるまでの間
    // そのため、outputDefinitionがnullのことも考慮してoutputNoを取得する
    return !od ? null : od.getOutputNo();
  }

  /** name => devId に変換する */
  findOutputDevIdFromName(name) {
    const od = this.getAllOutputDefinitions().find(d => d.getName() == name);
    return od ? od.getDevId() : null;
  }

  // ------------------------- calc -----------------------------
  /** pageIdに対応するページ番号を生成する */
  calcPageNo(pageId) {
    const index = this.getPages().findIndex(page => page.getId() === pageId);
    if (index === -1) throw new Error(`存在しないpageIdを指定しました: pageId=${pageId}`);
    return `${index + 1}`;
  }

  /** logicalVariableIdに対応するページ番号を生成する */
  calcLogicalVariableNo(pageId, logicalVariableId) {
    const page = this.findPage(pageId);
    const lv = page.findLogicalVariable(logicalVariableId);
    return `${this.calcPageNo(pageId)}-L-${lv.getVariableName()}`;
  }

  /** questionIdに対応する番号を生成する */
  calcQuestionNo(pageId, questionId) {
    const page = this.findPage(pageId);
    const questions = page.getQuestions();
    return questions.findIndex(q => q.getId() === questionId) + 1;
  }

  /** branchIdに対応するページ番号を生成する */
  calcBranchNo(branchId) {
    const index = this.getBranches().findIndex(branch => branch.getId() === branchId);
    if (index === -1) throw new Error(`存在しないbranchIdを指定しました: pageId=${branchId}`);
    return `${index + 1}`;
  }

  /** finisherIdに対応するページ番号を生成する */
  calcFinisherNo(finisherId) {
    const index = this.getFinishers().findIndex(finisher => finisher.getId() === finisherId);
    if (index === -1) throw new Error(`存在しないfinisherIdを指定しました: pageId=${finisherId}`);
    return `${index + 1}`;
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
      return `終了 ${this.calcFinisherNo(finisher.getId())} ${finisher.getFinishType()}`;
    }
    throw new Error(`nodeIdが不正です。 nodeId: ${nodeId}`);
  }

  /** 表示用にページのラベルを取得する */
  calcPageLabel(pageId) {
    const page = this.findPage(pageId);
    return `ページ ${this.calcPageNo(page.getId())}`;
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

    return newState
      .update('nodes', arr => arr.insert(nodeIndex, node))
      .update(surveyAttribute, arr => arr.push(ref))
      .updateOrder();
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

    // page, branch, finisherの順番も入れ替える
    return newSurvey.updateOrder();
  }

  /** page, branch, finisherの順番をnodeの順番と同期する */
  updateOrder() {
    const comparator = (a, b) => {
      const node1Index = this.getNodes().findIndex(node => node.getRefId() === a.getId());
      const node2Index = this.getNodes().findIndex(node => node.getRefId() === b.getId());
      if (node1Index < node2Index) return -1;
      if (node1Index === node2Index) return 0;
      return 1;
    };
    return this
      .update('pages', pages => pages.sort(comparator))
      .update('branches', branches => branches.sort(comparator))
      .update('finishers', finishers => finishers.sort(comparator));
  }


  /** titleの更新 */
  updateTitle(title) {
    return this.set('title', title);
  }

  /** panelの更新 */
  updatePanel(panel) {
    return this.set('panel', fromJS(panel));
  }

  /** JavaScriptの一括更新 */
  updateAllJavaScriptCode(allJavaScriptCode) {
    let newSurvey = this;
    this.getPages().forEach(function (page) {
      const code = allJavaScriptCode.getCodeByPageId(page.getId());
      if (code !== null) {
        const index = newSurvey.findPageIndex(page.getId());
        newSurvey = newSurvey.updateIn(['pages', index], page => page.updatePageAttribute('javaScriptCode', code));
      }
    });
    return newSurvey;
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

  /** Replacerを生成して返す */
  refreshReplacer(answers = {}, forEdit = false) {
    this.replacerCache = new Replacer(this.getAllOutputDefinitionMap(), answers, forEdit);
    return this.replacerCache;
  }

  /** ReplacerのCacheを削除する */
  getReplacer() {
    return this.replacerCache;
  }

  /**
   * すべての設問のOutputDefinitionを返す
   */
  getAllOutputDefinitions() {
    // この処理は繰り返し呼ばれるのでキャッシュする
    // surveyが変わればインスタンスが異なるはずなので明示的にキャッシュを消す必要は無い
    if (this.allOutputDefinitionsCache) return this.allOutputDefinitionsCache;
    this.allOutputDefinitionsCache = this.getPages().flatMap((page) => {
      const pageNo = this.calcPageNo(page.getId());
      return page.getQuestions().flatMap(question => question.getOutputDefinitions(pageNo, this.calcQuestionNo(page.getId(), question.getId())))
        .concat(page.getLogicalVariableOutputDefinitions(this));
    }).toList();
    return this.allOutputDefinitionsCache;
  }

  /**
   * すべての設問のOutputDefinitionをidをkeyにして返す
   */
  getAllOutputDefinitionMap() {
    let map = Map();
    const allOutputDefinitions = this.getAllOutputDefinitions();
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
      page.getLogicalVariableOutputDefinitions(this).forEach((od) => { questionNoMap[od.getOutputNo()] = od.getName(); });
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
   * すべてのpageのdevIdを取得する
   */
  getAllPageDevIds() {
    return this.getPages()
      .map(page => page.getDevId())
      .filter(id => id != null);
  }

  /**
   * すべてのquestionのdevIdを取得する
   */
  getAllQuestionDevIds() {
    return this.getAllQuestions()
      .map(question => question.getDevId())
      .filter(id => id != null); // 古いバージョンではidが割り振られていないため無視
  }

  /**
   * すべてのItemのdevIdを取得する
   */
  getAllItemDevIds() {
    return this.getAllQuestions().flatMap((question) => {
      return question.getItems()
        .map(item => item.getDevId())
        .filter(id => id != null);
    });
  }

  /**
   * すべてのSubItemのidを取得する
   */
  getAllSubItemDevIds() {
    return this.getAllQuestions().flatMap((question) => {
      return question.getSubItems().map(item => item.getDevId()).filter(id => id != null);
    });
  }

  /**
   * すべてのPageもしくはFinisherののNodeId一覧を取得する
   */
  getAllPageOrFinisherNodeIds() {
    return this.getNodes().filter(node => node.isPage() || node.isFinisher()).map(node => node.getId());
  }

  /**
   * 先行するページのnodeId一覧を取得する。
   *
   * 最初に指定したnodeIdがpageであればそれも含む
   * 含みたくない場合はincludeCurrentPageをfalseに設定する
   */
  findPrecedingPageNodeIds(nodeId, includeCurrentPage = true, currentNodeId = null, nodeList = []) {
    const id = currentNodeId || this.getNodes().get(0).getId();
    const node = this.findNode(id);
    if (node.isPage() && !(includeCurrentPage === false && nodeId === id)) {
      nodeList.push(id);
    }
    if (nodeId !== id) {
      this.findPrecedingPageNodeIds(nodeId, includeCurrentPage, node.getNextNodeId(), nodeList);
    }
    return nodeList;
  }

  /** 先行するページが出力するOutputDefinitionをすべて取得する */
  findPrecedingOutputDefinition(nodeId, includeCurrentPage = true, includeCurrentPageLogicalVariables = true) {
    const precedingPageNodeIds = this.findPrecedingPageNodeIds(nodeId, includeCurrentPage);
    return List(precedingPageNodeIds).flatMap((nodeId2) => {
      const page = this.findPageFromNode(nodeId2);
      const pageNo = this.calcPageNo(page.getId());
      const outputDefinitions = page.getQuestions().flatMap((question) => {
        const questionNo = this.calcQuestionNo(page.getId(), question.getId());
        return question.getOutputDefinitions(pageNo, questionNo);
      }).toList();
      // currentPageではない、またはcurrentPageだけどもincludeCurrentPageLogicalVariablesがtrueならロジック変数を追加
      if (nodeId !== nodeId2 || (nodeId === nodeId2 && includeCurrentPageLogicalVariables)) {
        return outputDefinitions.concat(page.getLogicalVariableOutputDefinitions(this));
      }
      return outputDefinitions;
    }).toList();
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

  /**
   * 後続のpageとbranchのnodeId一覧を取得する
   */
  findFollowingPageAndBranchNodeIds(nodeId, nodeList = []) {
    if (!nodeId) return nodeList;
    const node = this.findNode(nodeId);
    if (node.isPage() || node.isBranch()) {
      nodeList.push(nodeId);
    }
    this.findFollowingPageAndBranchNodeIds(node.getNextNodeId(), nodeList);
    return nodeList;
  }

  /** 提出可能な状態かvalidateする */
  validate() {
    let errors = List();
    const panel = this.getPanel();
    // パネルが選択されている必要がある
    if (!panel) errors = errors.push('パネルが選択されていません');
    // 最後のnodeはfinisherである
    if (!this.getNodes().last().isFinisher()) {
      errors = errors.push('最後のページが終了ページではありません');
    } else if (!this.isValidFinisher()) { // Finisher以降にページが存在しない
      errors = errors.push('終了ページより後ろに「ページ、分岐ページ」を設置しないで下さい');
    } else if (!this.isValidPositionOfCompleteFinisher()) { // 最後のページの次はCOMPLETEのFinisherである
      errors = errors.push('事故防止のため、最後の「ページ、分岐ページ」の次はCOMPLETEの終了ページにして下さい');
    }

    // page, branch, finisherのvalidation
    errors = errors.concat(this.getPages().flatMap(page => page.validate(this)));
    errors = errors.concat(this.getBranches().flatMap(branch => branch.validate(this).map(error => `分岐 ${this.calcBranchNo(branch.getId())} ${error}`)));
    errors = errors.concat(this.getFinishers().flatMap(finisher => finisher.validate(this).map(error => `終了 ${this.calcFinisherNo(finisher.getId())} ${error}`)));

    return errors;
  }

  /** surveyのjsonを取得します */
  toJson() {
    return JSON.stringify(this.toJS());
  }

  /** outputDefinitionsのjsonを取得します */
  getOutputDefinitionsJson() {
    return JSON.stringify(this.getAllOutputDefinitions().toJS(), (key, value) => {
      switch (key) {
        // questionは必要ないので出力しない
        case 'question':
          return undefined;
        default:
          return value;
      }
    });
  }

  /** スクリーンアウト以外の分岐が有るか */
  hasNotScreeningBranch() {
    const branches = this.getBranches();
    const conditions = branches.flatMap(branch => branch.getConditions());
    const nodes = conditions.map(condition => this.findNode(condition.getNextNodeId()));
    return nodes.find(node => node.isPage()) !== undefined;
  }

  /** pagesに再掲があるかどうか */
  hasReferenceInPages() {
    const replacer = this.getReplacer();
    // 一度文字列表現に直して、その中にrefernceの文字列があるかどうかで判断する
    return replacer.containsReferenceIdIn(JSON.stringify(this.getPages().toJS()));
  }

  /** finishersに再掲があるかどうか */
  hasReferenceInFinishers() {
    const replacer = this.getReplacer();
    // 一度文字列表現に直して、その中にrefernceの文字列があるかどうかで判断する
    return replacer.containsReferenceIdIn(JSON.stringify(this.getFinishers().toJS()));
  }

  /** ロジック変数があるか */
  hasLogicalVariables() {
    const pages = this.getPages();
    return pages.find(page => page.getLogicalVariables().size > 0) !== undefined;
  }

  /** JavaScript制御があるか */
  hasJavaScript() {
    const pages = this.getPages();
    return pages.find(page => page.getJavaScriptCode().length > 0) !== undefined;
  }

  /** 表示条件の制御があるか */
  hasVisibilityCondition() {
    // すべてのitemを取得
    const allItemsInSurvey = this.getPages().flatMap(page =>
      page.getQuestions().flatMap(question =>
        question.getItems(),
      ),
    );

    // 一つでもvisibilityConditionがあればtrue, なければfalseを返す
    return allItemsInSurvey.find(item => item.getVisibilityCondition() !== null) !== undefined;
  }

  /** 最後の「ページ、分岐ページ」の次がCOMPLETEのFinisherになっているかチェック */
  isValidPositionOfCompleteFinisher() {
    const nextNodeId = this.getNodes().filter(node => node.isPage() || node.isBranch()).last().getNextNodeId();
    if (this.findNode(nextNodeId) == null || !this.findNode(nextNodeId).isFinisher()) return false;
    const finisher = this.findFinisherFromNode(nextNodeId); // Pageの次のノードのFinisherを取得
    return finisher != null && finisher.isComplete();
  }

  /**
   * 不正なFinisherが存在しないかチェック
   *
   * Finisher より後ろに「ページ、分岐ページ」が存在しなければ true、すれば false
   */
  isValidFinisher() {
    return this.getFinisherNodes()
      .filter(node => this.findFollowingPageAndBranchNodeIds(node.getId()).length >= 1)
      .isEmpty();
  }
}
