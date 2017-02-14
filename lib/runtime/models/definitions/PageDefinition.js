import { Record, List } from 'immutable';
import uuid from 'node-uuid';
import CheckboxQuestionDefinition from './questions/CheckboxQuestionDefinition';

export const PageDefinitionRecord = Record({
  _id: null,
  questions: List(),
  layout: 'flow_layout',
});

export default class PageDefinition extends PageDefinitionRecord {
  static create() {
    const id = uuid.v4();
    const questions = List().push(CheckboxQuestionDefinition.create());
    return new PageDefinition({ _id: id, questions });
  }

  getId() {
    return this.get('_id');
  }

  getQuestions() {
    return this.get('questions');
  }
}
