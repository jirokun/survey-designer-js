import uuid from 'node-uuid';
import BaseQuestionDefinition from './BaseQuestionDefinition';

export default class CheckboxQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new CheckboxQuestionDefinition({ id: uuid.v4(), type: 'CheckboxQuestion' });
  }

  getConstraint() {
    return {
      CheckboxQuestion: {
        minCheckCount: this.getMinCheckCount(),
        maxCheckCount: this.getMaxCheckCount(),
      },
    };
  }
}
