import { Record, List } from 'immutable';
import PersonalInfoItemFieldDefinition from './PersonalInfoItemFieldDefinition';

/** 設問定義の設問(PersonalInfoItem)の表示形式のセット */
export const PersonalInfoItemDisplayTypeRecord = Record({
  _id: null,                  // ID
  label: null,                // 選択肢の日本語表記
  personalItemFields: List(), // フィールド配列
});

export default class PersonalInfoItemDisplayTypeDefinition extends PersonalInfoItemDisplayTypeRecord {
  static create(displayType) {
    let fieldDefinitions = [];
    if (displayType.fields) {
      fieldDefinitions = displayType.fields.map((field) => {
        return new PersonalInfoItemFieldDefinition({ _id: field.id, label: field.label, outputType: field.outputType, prependValue: field.prependValue });
      });
    }
    return new PersonalInfoItemDisplayTypeDefinition({ _id: displayType.id, label: displayType.label, personalItemFields: fieldDefinitions });
  }

  getId() {
    return this.get('_id');
  }

  getLabel() {
    return this.get('label');
  }

  getPersonalItemFields() {
    return this.get('personalItemFields');
  }
}
