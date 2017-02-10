import uuid from 'node-uuid';
import { Record } from 'immutable';

export const FinisherDefinitionRecord = Record({
  id: null,
  finishType: 'COMPLETE',
  point: 0,
  html: '',
});

export default class FinisherDefinition extends FinisherDefinitionRecord {
  static create() {
    return new FinisherDefinition({ id: uuid.v4() });
  }

  getId() {
    return this.get('id');
  }

  getFinishType() {
    return this.get('finishType');
  }

  getPoint() {
    return this.get('point');
  }

  getHtml() {
    return this.get('html');
  }
}
