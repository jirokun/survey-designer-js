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
  getId() {
    return this.get('id');
  }

  getTitle() {
    return this.get('title');
  }

  getBeforeNote() {
    return this.get('beforeNote');
  }

  isVertical() {
    return this.get('isVertical');
  }

  getChoices() {
    return this.get('choices');
  }

  getQuestions() {
    return this.get('questions');
  }
}
