import { Record } from 'immutable';

/** 回答データの1列に相当する定義 */
export const OutputDefinitionRecord = Record({
  _id: null,           // 内部で使用するIDでitemの移動やnodeの移動があっても変わらない
  name: null,          // サーバにpostするときにキーとなる属性に使われる値
  label: null,         // 表示用のラベル
  outputType: null,    // この出力データの種類。checkbox, text, numberがある
  overrideItems: null, // 選択肢がquestion.itemsになく設問内に含まれている場合、代わりにここにListで値を格納する
  outputNo: null,      // ユーザフレンドリなoutputDefitionのユニークな番号
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

  getOutputType() {
    return this.get('outputType');
  }

  getOverrideItems() {
    return this.get('overrideItems');
  }

  getPageId() {
    return this.get('pageId');
  }

  getQuestionId() {
    return this.get('questionId');
  }

  getOutputNo() {
    return this.get('outputNo');
  }
}
