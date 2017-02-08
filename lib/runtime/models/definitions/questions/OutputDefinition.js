import { Record } from 'immutable';

export const OutputDefinitionRecord = Record({
  id: null,     // name属性に使われる値で、このIDが回答データの1列に当たる
  label: null,  // 表示用のラベル
  type: null,   // この出力データの種類。checkbox, text, numberがある
});

export default class OutputDefinition extends OutputDefinitionRecord {
}
