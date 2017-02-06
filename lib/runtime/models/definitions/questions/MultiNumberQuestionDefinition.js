import uuid from 'node-uuid';
import BaseQuestionDefinition from './BaseQuestionDefinition';

export default class MultiNumberQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new MultiNumberQuestionDefinition({ id: uuid.v4(), type: 'MultiNumberQuestion' });
  }
}
