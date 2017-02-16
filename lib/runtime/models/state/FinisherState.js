import { Record } from 'immutable';

const FinisherStateRecord = Record({
  // 取り合える値
  // NOT_POSTED: 表示時にpostする
  // POSTING:    postしレスポンス待ち
  // POSTED:     postした
  // NEVER_POST: postしない
  postAnswerStatus: null,
});

export default class FinisherState extends FinisherStateRecord {
  getPostAnswerStatus() {
    return this.get('postAnswerStatus');
  }

  setPostAnswerStatus(value) {
    return this.set('postAnswerStatus', value);
  }
}

FinisherState.NOT_POSTED = 'NOT_POSTED';
FinisherState.POSTING = 'POSTING';
FinisherState.POSTED = 'POSTED';
FinisherState.NEVER_POST = 'NEVER_POST';
