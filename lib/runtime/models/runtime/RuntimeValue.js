import { Record, List, Map } from 'immutable';
import { ANSWER_NOT_POSTED } from '../../../constants/states';

export const RuntimeValueRecord = Record({
  currentNodeId: null,                 // 現在表示中のnodeId
  nodeStack: List(),                   // ユーザのnode遷移を格納する
  answers: Map(),                      // ユーザの回答
  postAnswerStatus: ANSWER_NOT_POSTED, // 回答の提出状態
});

export default class RuntimeValue extends RuntimeValueRecord {
  getCurrentNodeId() {
    return this.get('currentNodeId');
  }

  getNodeStack() {
    return this.get('nodeStack');
  }

  getAnswers() {
    return this.get('answers');
  }

  getPostAnswerStatus() {
    return this.get('postAnswerStatus');
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
    // replacerの更新
    const newAnswers = newRuntime.getAnswers();
    const replacer = survey.updateReplacer(newAnswers.toJS());
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

  /** 回答の提出状態を更新する */
  updatePostAnswerStatus(postAnswerStatus) {
    return this.set('postAnswerStatus', postAnswerStatus);
  }
}
