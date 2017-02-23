import { Record, List, Map } from 'immutable';
import * as C from '../../../constants/constants';

export const RuntimeValueRecord = Record({
  currentNodeId: null,    // 現在表示中のnodeId
  nodeStack: List(),      // ユーザのnode遷移を格納する
  answers: Map(),         // ユーザの回答
  postAnswerStatus: C.ANSWER_NOT_POSTED, // 回答の提出状態
});

export default class RuntimeValue extends RuntimeValueRecord {
  getCurrentNodeId() {
    return this.get('currentNodeId');
  }

  getNodeStack() {
    return this.get('nodeStack');
  }

  getInputValues() {
    return this.get('answers');
  }

  getPostAnswerStatus() {
    return this.get('postAnswerStatus');
  }
}
