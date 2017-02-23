import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';

export default class CheckboxQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new CheckboxQuestionDefinition({ _id: uuid.v4(), dataType: 'Checkbox' });
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
      const baseName = `${this.getId()}__value${item.getIndex() + 1}`;
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        _id: item.getId(),
        name: `${baseName}`,
        label: `${item.getPlainLabel()}`,
        outputType: 'checkbox',
        postfix: `${item.getIndex() + 1}`,
      }));
      if (item.hasAdditionalInput()) {
        outputDefinitions = outputDefinitions.push(new OutputDefinition({
          _id: `${item.getId()}_text`,
          name: `${baseName}_text`,
          label: `${item.getPlainLabel()}の自由入力`,
          outputType: item.getAdditionalInputType(),
          postfix: `${item.getIndex() + 1}-text`,
        }));
      }
    });
    return outputDefinitions;
  }
}
