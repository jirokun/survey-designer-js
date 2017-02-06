import uuid from 'node-uuid';
import BaseQuestionDefinition from './BaseQuestionDefinition';

export default class RadioQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new RadioQuestionDefinition({ id: uuid.v4(), type: 'RadioQuestion' });
  }
}
