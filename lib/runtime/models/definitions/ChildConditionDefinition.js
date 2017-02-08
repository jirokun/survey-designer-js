import uuid from 'node-uuid';
import { Record } from 'immutable';

export const ChildConditionDefinitionRecord = Record({
  id: null,
  outputId: null,    // 参照先の設問のID.要素のname属性と一致する
  operator: '==',    // どういう条件か
  value: null,       // 比較値
});

export default class ChildConditionDefinition extends ChildConditionDefinitionRecord {
  static create() {
    return new ChildConditionDefinition({ id: uuid.v4() });
  }

  getId() {
    return this.get('id');
  }

  getOutputId() {
    return this.get('outputId');
  }

  getOperator() {
    return this.get('operator');
  }

  getValue() {
    return this.get('value');
  }
}
