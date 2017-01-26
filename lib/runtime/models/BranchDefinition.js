import { Record, List } from 'immutable';
import uuid from 'node-uuid';
import ConditionDefinition from './ConditionDefinition';

export const BranchDefinitionRecord = Record({
  id: null,
  type: null,
  conditions: List(),
});

export default class BranchDefinition extends BranchDefinitionRecord {
  static create() {
    const id = uuid.v1();
    const conditions = List().push(new ConditionDefinition());
    return new BranchDefinition({ id, conditions });
  }

  getId() {
    return this.get('id');
  }

  getType() {
    return this.get('type');
  }

  getConditions() {
    return this.get('');
  }
}
