import { Record } from 'immutable';

export const ChildConditionDefinitionRecord = Record({
  refQuestionId: null,
  operator: '=',
  value: '',
});

export default class ChildConditionDefinition extends ChildConditionDefinitionRecord {
}
