import cuid from 'cuid';
import { Record, List } from 'immutable';
import PersonalItemDisplayTypeDefinition from './PersonalItemDisplayTypeDefinition';

export const PersonalItemRecord = Record({
  _id: null,                                  // ID
  dataType: 'PersonalItem',                   // Itemのタイプ
  devId: null,                                // DevId
  index: -1,                                  // 定義順
  label: '',                                  // HTMLとして評価されるラベル
  plainLabel: '',                             // TEXTとして評価されるラベル
  value: '',                                  // 値を指定したい場合に指定する
  rowType: null,                              // 列の種別
  isRequire: true,                            // 必須なら true、異なれば false
  displayTypeId: null,                        // 表示形式
  personalItemDisplayTypeCandidates: List(),  // 表示形式の候補
});

export default class PersonalItemDefinition extends PersonalItemRecord {
  static create(index, rowType, label, isRequire, displayTypeId, displayTypeCandidates) {
    const displayTypeDefinitions = displayTypeCandidates.map((displayType) => {
      return PersonalItemDisplayTypeDefinition.create(displayType);
    });
    return new PersonalItemDefinition({
      _id: cuid(),
      index,
      rowType,
      isRequire,
      displayTypeId,
      label,
      plainLabel: label,
      personalItemDisplayTypeCandidates: displayTypeDefinitions,
    });
  }

  getId() {
    return this.get('_id');
  }

  getIndex() {
    return this.get('index');
  }

  getLabel() {
    return this.get('label');
  }

  getPlainLabel() {
    return this.get('plainLabel');
  }

  getDevId() {
    return this.get('devId');
  }

  getRowType() {
    return this.get('rowType');
  }

  getValue() {
    return this.get('value');
  }

  getFields() {
    const currentDisplayTypeId = this.getDisplayTypeId();
    const displayType = this.getPersonalItemDisplayTypeCandidates().find(dt => dt.getId() === currentDisplayTypeId);
    return displayType ? displayType.getPersonalItemFields() : [];
  }

  getDisplayTypeId() {
    return this.get('displayTypeId');
  }

  getPersonalItemDisplayTypeCandidates() {
    return this.get('personalItemDisplayTypeCandidates');
  }

  getField(argField) {
    return this.getFields().find(field => field.getId() === argField);
  }

  isRequire() {
    return this.get('isRequire');
  }

  isHomeTelRow() {
    return this.getRowType() === 'HomeTelRow';
  }

  isMobileTelRow() {
    return this.getRowType() === 'MobileTelRow';
  }

  isWorkTelRow() {
    return this.getRowType() === 'WorkTelRow';
  }

  isEmailRow() {
    return this.getRowType() === 'EmailRow';
  }

  isDisable() {
    return this.getDisplayTypeId() === 'none';
  }
}
