import uuid from 'node-uuid';
import { Record } from 'immutable';

export const ChildConditionDefinitionRecord = Record({
  _id: null,
  outputId: null,    // 参照先の設問のID.要素のname属性とは異なるので注意
  operator: '==',    // どういう条件か
  value: '',       // 比較値
});

export default class ChildConditionDefinition extends ChildConditionDefinitionRecord {
  static create() {
    return new ChildConditionDefinition({ _id: uuid.v4() });
  }

  getId() {
    return this.get('_id');
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
