import { Record, List } from 'immutable';
import uuid from 'node-uuid';

export const QuestionDefinitionRecord = Record({
  id: null,
  type: 'checkbox',
  title: '設問タイトル',
  beforeNote: '',
  vertical: false,
  choices: List(),
  questions: List(),
});

export default class QuestionDefinition extends QuestionDefinitionRecord {
  static create() {
    return new QuestionDefinition({ id: uuid.v1() });
  }

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
