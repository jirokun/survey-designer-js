import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';

export default class SingleTextQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new SingleTextQuestionDefinition({ id: uuid.v4(), type: 'SingleTextQuestion' });
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
