import uuid from 'node-uuid';
import BaseQuestionDefinition from './BaseQuestionDefinition';

export default class SingleTextQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new SingleTextQuestionDefinition({ id: uuid.v4(), type: 'SingleTextQuestion' });
  }
}
