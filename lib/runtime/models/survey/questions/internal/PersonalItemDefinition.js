import cuid from 'cuid';
import { Record } from 'immutable';

export const ItemRecord = Record({
  _id: null,                    // ID
  outputType: null,             // checkbox, text, numberなどinputタグのtype
  visibility: true,             // 表示対象か否か
});

export default class PersonalItemDefinition extends ItemRecord {
  static create(devId, index, value = '', label = '名称未設定') {
    return new ItemDefinition({ _id: cuid(), devId, index, value, label, plainLabel: label });
  }

  getId() {
    return this.get('_id');
  }

  getOutputType() {
    return this.get('outputType');
  }

  getVisibility() {
    return this.get('visibility');
  }
}
