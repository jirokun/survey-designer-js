import { Record, List } from 'immutable';

export const PageDefinitionRecord = Record({
  id: null,
  title: '',
  questions: List(),
});

export default class PageDefinition extends PageDefinitionRecord {
  getQuestions() {
    return this.get('questions');
  }
}
