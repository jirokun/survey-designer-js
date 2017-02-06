import { Record, List } from 'immutable';

export const ConditionDefinitionRecord = Record({
  type: null,
  nextFlowId: null,
  childConditions: List(),
});

export default class ConditionDefinition extends ConditionDefinitionRecord {
}
