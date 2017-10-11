import { Record, List } from 'immutable';

export const PersonalItemFieldRecord = Record({
  _id: null,            // ID
  label: null,          // 列の種別
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
