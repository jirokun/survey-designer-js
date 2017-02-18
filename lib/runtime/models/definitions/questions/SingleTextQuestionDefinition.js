import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';

export default class SingleTextQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new SingleTextQuestionDefinition({ _id: uuid.v4(), dataType: 'SingleText' });
  }

  getOutputDefinitions() {
    const id = this.getId();
    const ret = List();
    return ret.push(new OutputDefinition({
      _id: id,
      name: id,
      label: `${this.getPlainTitle()}`,
      outputType: 'text',
    }));
  }
}
