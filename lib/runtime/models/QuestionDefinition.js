import { Record, List } from 'immutable';
import uuid from 'node-uuid';
import ChoiceDefinition from './ChoiceDefinition';

export const QuestionDefinitionRecord = Record({
  id: null,
  type: 'checkbox',
  title: '設問タイトル',
  plainTitle: '設問タイトル',
  beforeNote: '',
  direction: 'vertical',
  vertical: false,
  random: false,
  choices: List().push(new ChoiceDefinition()),
  checkMinCount: 0,
  checkMaxCount: 0,
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

  getDirection() {
    return this.get('direction');
  }

  isRandom() {
    return this.get('random');
  }

  getChoices() {
    return this.get('choices');
  }

  getCheckMinCount() {
    return this.get('checkMinCount');
  }

  getCheckMaxCount() {
    return this.get('checkMaxCount');
  }

  getValidations() {
    return this.get('validations');
  }
}
