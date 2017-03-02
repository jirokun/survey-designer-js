import cuid from 'cuid';
import { Record } from 'immutable';

export const FinisherDefinitionRecord = Record({
  _id: null,
  finishType: 'COMPLETE',                                             // 終了タイプ。COMPLETEまたはSCREEN
  point: 0,                                                           // 付与するポイント
  html: 'ご回答ありがとうございました。<br/>またのご協力をお待ちしております。', // 画面に表示するHTML
});

/** Finisherの定義 */
export default class FinisherDefinition extends FinisherDefinitionRecord {
  static create() {
    return new FinisherDefinition({ _id: cuid() });
  }

  getId() {
    return this.get('_id');
  }

  getFinishType() {
    return this.get('finishType');
  }

  getPoint() {
    return this.get('point');
  }

  getHtml() {
    return this.get('html');
  }

  isComplete() {
    return this.get('finishType') === 'COMPLETE';
  }
}
