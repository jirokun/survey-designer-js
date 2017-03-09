import { List, Map, Record, fromJS } from 'immutable';
import cuid from 'cuid';
import S from 'string';
import ReplaceUtil from '../../ReplaceUtil';
import PageDefinition from './survey/PageDefinition';
import BranchDefinition from './survey/BranchDefinition';
import FinisherDefinition from './survey/FinisherDefinition';
import ConditionDefinition from './survey/ConditionDefinition';
import ChildConditionDefinition from './survey/ChildConditionDefinition';
import NodeDefinition from './survey/NodeDefinition';
import ItemDefinition from './survey/questions/ItemDefinition';
import LogicVariableDefinition from './survey/LogicVariableDefinition';
import SurveyDefinition from './survey/SurveyDefinition';
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
  /**
   * JSONを解析し、stateで扱える方に変換する
   *
   * forTestにtrueを渡すとテストで使用しやすいように値を返す
   */
  static createFromJson(json, forTest) {
    const parsedObj = fromJS(json, (key, value) => {
      switch (key) {
        case 'answers':
          return new Map(value);
        case 'view':
          return new ViewSetting(value);
        case 'runtime':
          return new RuntimeValue(value);
        case 'options':
          return new Options(value);
        case 'survey':
          return new SurveyDefinition(value);
        case 'pages':
          return value.map(v => new PageDefinition(v)).toList();
        case 'questions':
          return value.map((v) => {
            const dataType = v.get('dataType');
            const Model = findQuestionDefinitionClass(dataType);
            if (!Model) throw new Error(`question dataType="${dataType}"に対応するクラスが見つかりません。`);
            return new Model(v);
          }).toList();
        case 'items':
          return value.map(v => new ItemDefinition(v)).toList();
        case 'branches':
          return value.map(v => new BranchDefinition(v)).toList();
        case 'finishers':
          return value.map(v => new FinisherDefinition(v)).toList();
        case 'conditions':
          return value.map(v => new ConditionDefinition(v)).toList();
        case 'childConditions':
          return value.map(v => new ChildConditionDefinition(v)).toList();
        case 'nodes':
          return value.map(v => new NodeDefinition(v)).toList();
        case 'logicVariables':
          return value.map(v => new LogicVariableDefinition(v)).toList();
        default:
          return value;
      }
    });
    if (forTest) {
      // testのときは部分的に取り出すことも考えて SurveyDesignerState で包まずに返す
      return parsedObj;
    }
    return new SurveyDesignerState(parsedObj);
  }

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
    return this.getSurvey().findNode(nodeId);
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
    return this.getSurvey().findNodeIndex(nodeId);
  }

  /** pageIdに対応するページ番号を生成する */
  calcPageNo(pageId) {
    return this.getSurvey().calcPageNo(pageId);
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
  calcQuestionNo(pageId, questionId) {
    const page = this.findPage(pageId);
    const questions = page.getQuestions();
    return questions.findIndex(q => q.getId() === questionId) + 1;
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

  /** outputDefinitionのnameと設問番号の対応付を返す */
  getQuestionNoMap() {
    return this.getSurvey().getQuestionNoMap();
  }

  /** outputDefinitionの設問番号とnameの対応付を返す */
  getQuestionNameMap() {
    return this.getSurvey().getQuestionNameMap();
  }

  /**
   * 先行するページのnodeId一覧を取得する。
   *
   * 最初に指定したnodeIdがpageであればそれも含む
   */
  findPrecedingPageNodeIds(nodeId, currentNodeId = null, nodeList = []) {
    return this.getSurvey().findPrecedingPageNodeIds(nodeId, currentNodeId, nodeList);
  }

  /** 先行するページが出力するOutputDefinitionをすべて取得する */
  findPrecedingOutputDefinition(nodeId) {
    return this.getSurvey().findPrecedingOutputDefinition(nodeId);
  }

  /**
   * 後続のpageとfinisherのnodeId一覧を取得する。
   *
   * 最初に指定したnodeIdがpageであればそれも含む
   */
  findFollowingPageAndFinisherNodeIds(nodeId, nodeList = []) {
    return this.getSurvey().findFollowingPageAndFinisherNodeIds(nodeId, nodeList);
  }

  /**
   * すべてのquestionを取得する
   */
  getAllQuestions() {
    return this.getPages().flatMap(page => page.getQuestions()).toList();
  }

  /**
   * すべての設問のOutputDefinitionをidをkeyにして返す
   */
  getAllOutputDefinitionMap() {
    return this.getSurvey().getAllOutputDefinitionMap();
  }

  /** ReplaceUtilを生成して返す */
  getReplaceUtil() {
    return new ReplaceUtil(this.getAllOutputDefinitionMap(), this.getQuestionNoMap(), this.getAnswers().toJS());
  }

}
