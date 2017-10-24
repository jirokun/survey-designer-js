import { Record, List } from 'immutable';

/** 設問定義の設問(PersonalInfoItem)のフィールドの要素 */
export const PersonalItemFieldRecord = Record({
  _id: null,            // ID
  label: null,          // フィールドのラベル
  outputType: List(),   // フィールド配列
  prependValue: null,   // 回答データDL時に先頭につける文字列
});

export default class PersonalItemFieldDefinition extends PersonalItemFieldRecord {
  getId() {
    return this.get('_id');
  }

  getLabel() {
    return this.get('label');
  }

  getOutputType() {
    return this.get('outputType');
  }

  getPrependValue() {
    return this.get('prependValue');
  }
}
