import Immutable, { Record, List } from 'immutable';

export const BranchDefinitionRecord = Record({
  id: null,
  type: null,
  conditions: List(),
});

export default class BranchDefinition extends BranchDefinitionRecord {
}
