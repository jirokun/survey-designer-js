import { Record } from 'immutable';

export const OutputDefinitionRecord = Record({
  id: null,            // name属性に使われる値で、このIDが回答データの1列に当たる
  label: null,         // 表示用のラベル
  outputType: null,    // この出力データの種類。checkbox, text, numberがある
  postfix: null,       // ユーザが分岐の選択肢で選択する場合に設問番号の後ろにつく文字列
});

export default class OutputDefinition extends OutputDefinitionRecord {
  getId() {
    return this.get('id');
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
}
