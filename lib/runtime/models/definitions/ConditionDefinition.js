import uuid from 'node-uuid';
import { Record, List } from 'immutable';

export const ConditionDefinitionRecord = Record({
  id: null,
  conditionType: null,
  nextNodeId: null,
  childConditions: List(),
});

export default class ConditionDefinition extends ConditionDefinitionRecord {
  static create() {
    return new ConditionDefinition({ id: uuid.v4() });
  }

  getId() {
    return this.get('id');
  }

  getConditionType() {
    return this.get('conditionType');
  }

  getNextNodeId() {
    return this.get('nextNodeId');
  }

  getChildConditions() {
    return this.get('childConditions');
  }

  findChildConditionIndex(childConditionId) {
    return this.get('childConditions').findIndex(cc => cc.getId() === childConditionId);
  }
}
