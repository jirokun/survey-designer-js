import { Record, List } from 'immutable';
import uuid from 'node-uuid';
import CheckboxQuestionDefinition from './questions/CheckboxQuestionDefinition';

export const PageDefinitionRecord = Record({
  id: null,
  title: 'ページタイトル',
  questions: List(),
  layout: 'flow_layout',
});

export default class PageDefinition extends PageDefinitionRecord {
  static create() {
    const id = uuid.v4();
    const questions = List().push(CheckboxQuestionDefinition.create());
    return new PageDefinition({ id, questions });
  }

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
