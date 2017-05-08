import { Record } from 'immutable';

/** OutputDefinitionのChoiceに格納するクラス */
export const ChoiceDefinitionRecord = Record({
  _id: null,           // 内部で使用するIDでitemの移動やnodeの移動があっても変わらない
  label: null,         // 表示用のラベル
  value: null,         // 対応する値
});

export default class ChoiceDefinition extends ChoiceDefinitionRecord {
  getId() {
    return this.get('_id');
  }

  getLabel() {
    return this.get('label');
  }

  getValue() {
    return this.get('value');
  }
}
