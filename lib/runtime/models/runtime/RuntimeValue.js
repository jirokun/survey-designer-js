import { Record, List, Map } from 'immutable';
import { ANSWER_NOT_POSTED } from '../../../constants/states';

export const RuntimeValueRecord = Record({
  currentNodeId: null,                 // 現在表示中のnodeId
  nodeStack: List(),                   // ユーザのnode遷移を格納する
  answers: Map(),                      // ユーザの回答
  currentPageAnswers: Map(),           // 現在のページのユーザ回答
  postAnswerStatus: ANSWER_NOT_POSTED, // 回答の提出状態
  executing: false,                    // 処理中の場合trueとなる
});

export default class RuntimeValue extends RuntimeValueRecord {
  getCurrentNodeId() {
    return this.get('currentNodeId');
  }

  getNodeStack() {
    return this.get('nodeStack');
  }

  getAnswers(includeCurrentPage = false) {
    const answers = this.get('answers');
    if (includeCurrentPage === true) {
      return answers.merge(this.getCurrentPageAnswers());
    }
    return answers;
  }

  getCurrentPageAnswers() {
    return this.get('currentPageAnswers');
  }

  getPostAnswerStatus() {
    return this.get('postAnswerStatus');
  }

  isExecuting() {
    return this.get('executing');
  }

  // ---------------------- 参照系 --------------------------
  /** 現在のpageを探す */
  findCurrentPage(survey) {
    return survey.findPageFromNode(this.getCurrentNodeId());
  }

  /** 現在のbranchを探す */
  findCurrentNode(survey) {
    return survey.findNode(this.getCurrentNodeId());
  }

  /** 現在のbranchを探す */
  findCurrentBranch(survey) {
    return survey.findBranchFromNode(this.getCurrentNodeId());
  }

  /** 現在のfinisherを探す */
  findCurrentFinisher(survey) {
    return survey.findFinisherFromNode(this.getCurrentNodeId());
  }

  // ---------------------- 更新系 --------------------------
  /** RuntimeValueを初期化して最初からやり直す */
  restart(survey) {
    return this
      .set('currentNodeId', survey.getNodes().get(0).getId())
      .set('answers', Map())
      .set('nodeStack', List());
  }

  /** 現在のnodeIdを設定する */
  setCurrentNodeId(value) {
    return this.set('currentNodeId', value);
  }

  /** pageのsubmit */
  submitPage(survey, pageAnswers) {
    const node = survey.findNode(this.getCurrentNodeId());
    const nextNode = survey.findNode(node.getNextNodeId());
    const newRuntime = this.mergeDeep({ answers: pageAnswers });
    // replacerの更新 ここではcurrentPageAnswersを含まない
    const newAnswers = newRuntime.getAnswers();
    const replacer = survey.refreshReplacer(newAnswers.toJS());
    if (nextNode.isPage() || nextNode.isFinisher()) {
      // ページ, 終了ページ
      return newRuntime.set('currentNodeId', nextNode.getId());
    } else if (nextNode.isBranch()) {
      // 分岐
      const branch = survey.findBranchFromNode(nextNode.getId());
      const nextNodeId = branch.evaluateConditions(newAnswers, survey.getAllOutputDefinitionMap(), replacer)
        || nextNode.getNextNodeId();
      return newRuntime.set('currentNodeId', nextNodeId);
    }
    throw new Error(`不明なnodeTypeです。type: ${nextNode.getType()}`);
  }

  /** 指定されたanswerを更新する */
  updateAnswers(survey, answers) {
    const newRuntime = this.mergeDeep({ answers });
    const newAnswersWithCurentPageAnswers = newRuntime.getAnswers(true);
    survey.refreshReplacer(newAnswersWithCurentPageAnswers.toJS());
    return newRuntime;
  }

  /** 現在のページのcurrentPageAnswersを更新する。 */
  updateCurrentPageAnswers(survey, currentPageAnswers) {
    const newAnswersWithCurentPageAnswers = this.getAnswers().merge(currentPageAnswers);
    survey.refreshReplacer(newAnswersWithCurentPageAnswers.toJS());

    return this.set('currentPageAnswers', Map(currentPageAnswers));
  }

  /** 回答の提出状態を更新する */
  updatePostAnswerStatus(postAnswerStatus) {
    return this.set('postAnswerStatus', postAnswerStatus);
  }

  /** 処理中かどうかを更新する */
  updateExecuting(executing) {
    return this.set('executing', executing);
  }
}
