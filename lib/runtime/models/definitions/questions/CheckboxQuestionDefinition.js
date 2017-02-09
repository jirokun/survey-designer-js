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
      const baseId = `${this.getId()}__value${item.getIndex() + 1}`;
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        id: `${baseId}`,
        label: `${item.getPlainLabel()}`,
        outputType: 'checkbox',
        postfix: `${item.getIndex() + 1}`,
      }));
      if (item.hasTextInput()) {
        outputDefinitions = outputDefinitions.push(new OutputDefinition({
          id: `${baseId}_text`,
          label: `${item.getPlainLabel()}の自由入力`,
          outputType: 'text',
          postfix: `${item.getIndex() + 1}-text`,
        }));
      }
      if (item.hasNumberInput()) {
        outputDefinitions = outputDefinitions.push(new OutputDefinition({
          id: `${baseId}_text`,
          label: `${item.getPlainLabel()}の自由入力`,
          outputType: 'number',
          postfix: `${item.getIndex() + 1}-text`,
        }));
      }
    });
    return outputDefinitions;
  }
}
