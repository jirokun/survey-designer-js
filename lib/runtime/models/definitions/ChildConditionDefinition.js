import uuid from 'node-uuid';
import { Record } from 'immutable';

export const ChildConditionDefinitionRecord = Record({
  id: null,
  refQuestionId: null,
  operator: '=',
  value: '',
});

export default class ChildConditionDefinition extends ChildConditionDefinitionRecord {
  static create() {
    return new ChildConditionDefinition({ id: uuid.v4() });
  }

  getRefQuestionId() {
    return this.get('refQuestionId');
  }

  getOperator() {
    return this.get('operator');
  }

  getValue() {
    return this.get('value');
  }
}
