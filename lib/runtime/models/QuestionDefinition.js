import { Record, List } from 'immutable';

export const QuestionDefinitionRecord = Record({
  id: null,
  type: null,
  title: '',
  beforeNote: '',
  vertical: false,
  choices: List(),
  questions: List(),
});

export default class QuestionDefinition extends QuestionDefinitionRecord {
}
