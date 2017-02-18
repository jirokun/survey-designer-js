import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';

export default class MultiNumberQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new MultiNumberQuestionDefinition({ _id: uuid.v4(), dataType: 'MultiNumber' });
  }

  getOutputDefinitions() {
    let outputDefinitions = List();
    this.getTransformedItems().forEach((item) => {
      const baseId = `${this.getId()}__value${item.getIndex() + 1}`;
      const baseName = `${this.getId()}__value${item.getId()}`;
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        _id: `${baseId}`,
        name: `${baseName}`,
        label: `${item.getPlainLabel()}`,
        outputType: 'number',
      }));
    });
    return outputDefinitions;
  }
}
