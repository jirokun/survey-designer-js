import { Record } from 'immutable';

/** 回答データの1列に相当する定義 */
export const OutputDefinitionRecord = Record({
  _id: null,           // 内部で使用するIDでitemの移動やnodeの移動があっても変わらない
  name: null,          // サーバにpostするときにキーとなる属性に使われる値
  label: null,         // 表示用のラベル
  outputType: null,    // この出力データの種類。checkbox, text, numberがある
  postfix: null,       // ユーザが分岐の選択肢で選択する場合に設問番号の後ろにつく文字列
  overrideItems: null, // 選択肢がquestion.itemsになく設問内に含まれている場合、代わりにここにListで値を格納する
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

  // questionIdを取得する。実際には"_"よりも前の文字列をかえしている
  getQuestionId() {
    return this.getId().split(/_/)[0];
  }

  getPostfix() {
    return this.get('postfix');
  }

  getOverrideItems() {
    return this.get('overrideItems');
  }
}
