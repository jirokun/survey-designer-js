import { Record, List } from 'immutable';

export const ConditionDefinitionRecord = Record({
  conditionType: null,
  nextNodeId: null,
  childConditions: List(),
});

export default class ConditionDefinition extends ConditionDefinitionRecord {
}
