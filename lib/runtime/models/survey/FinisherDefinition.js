import cuid from 'cuid';
import { Record, List } from 'immutable';

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

  validate(survey) {
    let errors = List();
    const replacer = survey.getReplacer();
    if (!replacer.validate(this.getHtml())) errors = errors.push('存在しない参照があります');
    return errors;
  }

  // ------------------------- 更新系 -----------------------------
  /** finisherの属性の更新 */
  updateFinisherAttribute(attributeName, value, replacer) {
    return this.set(attributeName, replacer.outputNo2Name(value));
  }
}
