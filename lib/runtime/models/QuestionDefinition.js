import { Record, List } from 'immutable';
import uuid from 'node-uuid';
import ChoiceDefinition from './ChoiceDefinition';

export const QuestionDefinitionRecord = Record({
  id: null,
  type: 'checkbox',
  title: '設問タイトル',
  plainTitle: '設問タイトル',
  beforeNote: '',
  vertical: false,
  random: false,
  choices: List().push(new ChoiceDefinition()),
  validations: List(),
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

  getPlainTitle() {
    return this.get('plainTitle');
  }

  getBeforeNote() {
    return this.get('beforeNote');
  }

  isVertical() {
    return this.get('vertical');
  }

  isRandom() {
    return this.get('random');
  }

  getChoices() {
    return this.get('choices');
  }

  getValidations() {
    return this.get('validations');
  }
}
