import { Record, List } from 'immutable';

export const PageDefinitionRecord = Record({
  id: null,
  title: '',
  questions: List(),
  layout: 'flow_layout',
});

export default class PageDefinition extends PageDefinitionRecord {
  getId() {
    return this.get('id');
  }

  getTitle() {
    return this.get('title');
  }

  getQuestions() {
    return this.get('questions');
  }
}
