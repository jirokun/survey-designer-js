import uuid from 'node-uuid';
import BaseQuestionDefinition from './BaseQuestionDefinition';

export default class TextQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new TextQuestionDefinition({ id: uuid.v4(), type: 'TextQuestion' });
  }
}
