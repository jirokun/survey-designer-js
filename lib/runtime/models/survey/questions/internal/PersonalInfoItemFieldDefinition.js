import { Record } from 'immutable';

/** 設問定義の設問(PersonalInfoItem)のフィールドの要素 */
export const PersonalInfoItemFieldRecord = Record({
  _id: null,            // ID
  label: null,          // フィールドのラベル
  outputType: null,     // 出力形式 text / number
  prependValue: null,   // 回答データDL時に先頭につける文字列
});

export default class PersonalInfoItemFieldDefinition extends PersonalInfoItemFieldRecord {
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
