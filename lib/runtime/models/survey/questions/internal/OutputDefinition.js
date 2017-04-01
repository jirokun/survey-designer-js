import { Record } from 'immutable';

/** 回答データの1列に相当する定義 */
export const OutputDefinitionRecord = Record({
  _id: null,           // 内部で使用するIDでitemの移動やnodeの移動があっても変わらない
  name: null,          // サーバにpostするときにキーとなる属性に使われる値
  label: null,         // 表示用のラベル
  dlLabel: null,       // DL時に使用するカラムのラベル
  question: null,      // 対応するquestion
  outputType: null,    // この出力データの種類。checkbox, radio, text, numberがある
  overrideItems: null, // 選択肢がquestion.itemsになく設問内に含まれている場合、代わりにここにListで値を格納する
  choices: null,       // 選択肢
  outputNo: null,      // ユーザフレンドリなoutputDefitionのユニークな番号
  downloadable: true,  // 回答データDL時に出力する項目かどうか
});

export default class OutputDefinition extends OutputDefinitionRecord {
  getId() {
    return this.get('_id');
  }

  getName() {
    return this.get('name');
  }

  getLabel() {
    return this.get('label');
  }

  getDlLabel() {
    return this.get('dlLabel');
  }

  getOutputType() {
    return this.get('outputType');
  }

  getOverrideItems() {
    return this.get('overrideItems');
  }

  getChoices() {
    return this.get('choices');
  }

  getPageId() {
    return this.get('pageId');
  }

  getQuestion() {
    return this.get('question');
  }

  getOutputNo() {
    return this.get('outputNo');
  }
}
