import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';

export default class TextQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new TextQuestionDefinition({ id: uuid.v4(), dataType: 'Text' });
  }

  getOutputDefinitions() {
    const id = this.getId();
    const ret = List();
    return ret.push(new OutputDefinition({
      id,
      label: `${this.getPlainTitle()}`,
      outputType: 'text',
    }));
  }
}
