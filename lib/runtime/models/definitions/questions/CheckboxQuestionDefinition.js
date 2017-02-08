import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';

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

  getOutputDefinitions() {
    let outputDefinitions = List();
    this.getTransformedItems().forEach((item) => {
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        id: `${this.getId()}__value${item.getIndex() + 1}`,
        label: `${item.getPlainLabel()}`,
        type: 'checkbox',
      }));
      if (item.hasTextInput()) {
        outputDefinitions = outputDefinitions.push(new OutputDefinition({
          id: `${this.getId()}__value${item.getIndex() + 1}_text`,
          label: `${item.getPlainLabel()}の自由入力`,
          type: 'text',
        }));
      }
      if (item.hasNumberInput()) {
        outputDefinitions = outputDefinitions.push(new OutputDefinition({
          id: `${this.getId()}__value${item.getIndex() + 1}_text`,
          label: `${item.getPlainLabel()}の自由入力`,
          type: 'number',
        }));
      }
    });
    return outputDefinitions;
  }
}
