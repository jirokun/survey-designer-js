import { Record, List } from 'immutable';
import uuid from 'node-uuid';
import CheckboxQuestionDefinition from './questions/CheckboxQuestionDefinition';

export const PageDefinitionRecord = Record({
  _id: null,
  questions: List(),        // 設問のリスト
  javaScriptCode: '',       // Pageが表示されたときに実行されるJavaScript
});

/** ページの定義 */
export default class PageDefinition extends PageDefinitionRecord {
  static create() {
    const id = uuid.v4();
    const questions = List().push(CheckboxQuestionDefinition.create());
    return new PageDefinition({ _id: id, questions });
  }

  /** エディタで入力したJavaScriptの設問番号をuuidに変換する */
  static encodeJavaScriptCode() {
  }

  /** エディタで入力したJavaScriptのuuidを設問番号に変換する */
  static decodeJavaScriptCode() {
  }

  getId() {
    return this.get('_id');
  }

  getQuestions() {
    return this.get('questions');
  }

  getJavaScriptCode() {
    return this.get('javaScriptCode');
  }
}
