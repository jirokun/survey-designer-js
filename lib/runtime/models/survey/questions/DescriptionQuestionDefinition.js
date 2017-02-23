import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';

export default class DescriptionQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new DescriptionQuestionDefinition({
      _id: uuid.v4(),
      dataType: 'Description',
      title: '説明文',
    });
  }

  getOutputDefinitions() {
    return List();
  }
}
