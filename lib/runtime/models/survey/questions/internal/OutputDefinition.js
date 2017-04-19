import { Record } from 'immutable';

/** 回答データの1列に相当する定義 */
export const OutputDefinitionRecord = Record({
  _id: null,           // 内部で使用するIDでitemの移動やnodeの移動があっても変わらない
  name: null,          // サーバにpostするときにキーとなる属性に使われる値
  label: null,         // 表示用のラベル
  dlLabel: null,       // DL時に使用するカラムのラベル
  question: null,      // 対応するquestion
  outputType: null,    // この出力データの種類。checkbox, radio, text, numberがある
  choices: null,       // 選択肢
  outputNo: null,      // ユーザフレンドリなoutputDefitionのユニークな番号
  downloadable: true,  // 回答データDL時に出力する項目かどうか
  prependValue: null,  // 回答データDL時に先頭につける文字列
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

  getLabelForDetail() {
    return `${this.getOutputNo()} ${this.getLabel()}`;
  }

  getPrependValue() {
    return this.get('prependValue');
  }
}
