import uuid from 'node-uuid';
import { Record } from 'immutable';

export const FinisherDefinitionRecord = Record({
  id: null,
  finishType: 'COMPLETE',
  point: 0,
  html: 'ご回答ありがとうございました。<br/>またのご協力をお待ちしております。',
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
