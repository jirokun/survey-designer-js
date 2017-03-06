import { Record, List } from 'immutable';
import S from 'string';
import cuid from 'cuid';
import CheckboxQuestionDefinition from './questions/CheckboxQuestionDefinition';

const PageDefinitionRecord = Record({
  _id: null,
  questions: List(),        // 設問のリスト
  logicVariables: List(),   // ロジック変数の定義
  javaScriptCode: '',       // Pageが表示されたときに実行されるJavaScript
});

/** ページの定義 */
export default class PageDefinition extends PageDefinitionRecord {
  static create() {
    const id = cuid();
    const questions = List().push(CheckboxQuestionDefinition.create());
    const logicVariables = List();
    return new PageDefinition({ _id: id, questions, logicVariables });
  }

  /**
   * エディタで入力したJavaScriptの設問番号を設問のnameに変換する
   * 例 Q1_2_1 -> uuid
   */
  static encodeJavaScriptCode(state, code) {
    const questionNoMap = state.getQuestionNoMap();
    let encodedCode = S(code);
    for (const key in questionNoMap) {
      if (!Object.prototype.hasOwnProperty.call(questionNoMap, key)) continue;
      const pattern = `\${Q${key}}`;
      encodedCode = encodedCode.replaceAll(pattern, questionNoMap[key]);
    }
    return encodedCode.s;
  }

  /** エディタで入力したJavaScriptのを設問番号を設問のnameに変換する */
  static decodeJavaScriptCode(state, code) {
    const questionNameMap = state.getQuestionNameMap();
    let encodedCode = S(code);
    for (const key in questionNameMap) {
      if (!Object.prototype.hasOwnProperty.call(questionNameMap, key)) continue;
      const pattern = key;
      encodedCode = encodedCode.replaceAll(pattern, `\${Q${questionNameMap[key]}}`);
    }
    return encodedCode.s;
  }

  getId() {
    return this.get('_id');
  }

  getQuestions() {
    return this.get('questions');
  }

  getLogicVariables() {
    return this.get('logicVariables');
  }

  getJavaScriptCode() {
    return this.get('javaScriptCode');
  }

  findLogicVariableIndex(logicVariableId) {
    return this.getLogicVariables().findIndex(lv => lv.getId() === logicVariableId);
  }

  /** ロジック変数名がユニークかどうかを確認する */
  isUniqueLogicVariableName(logicVariableId, logicVariableName) {
    return this.getLogicVariables().findIndex(lv => lv.getId() !== logicVariableId && lv.getVariableName() === logicVariableName) === -1;
  }
}
