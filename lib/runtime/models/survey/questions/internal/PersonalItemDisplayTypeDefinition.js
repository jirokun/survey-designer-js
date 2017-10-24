import { Record, List } from 'immutable';
import PersonalItemFieldDefinition from './PersonalItemFieldDefinition';

export const PersonalItemDisplayTypeRecord = Record({
  _id: null,                  // ID
  label: null,                // 選択肢の日本語表記
  personalItemFields: List(), // フィールド配列
});

export default class PersonalItemDisplayTypeDefinition extends PersonalItemDisplayTypeRecord {
  static create(displayType) {
    let fieldDefinitions = [];
    if (displayType.fields) {
      fieldDefinitions = displayType.fields.map((field) => {
        return new PersonalItemFieldDefinition({ _id: field.id, label: field.label, outputType: field.outputType, prependValue: field.prependValue });
      });
    }
    return new PersonalItemDisplayTypeDefinition({ _id: displayType.id, label: displayType.label, personalItemFields: fieldDefinitions });
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
