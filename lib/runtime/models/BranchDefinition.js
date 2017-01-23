import { Record, List } from 'immutable';

export const BranchDefinitionRecord = Record({
  id: null,
  type: null,
  conditions: List(),
});

export default class BranchDefinition extends BranchDefinitionRecord {
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
