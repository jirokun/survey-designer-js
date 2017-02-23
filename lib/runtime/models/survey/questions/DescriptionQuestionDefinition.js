import uuid from 'node-uuid';
import BaseQuestionDefinition from './BaseQuestionDefinition';

/** 設問定義：説明文 */
export default class DescriptionQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new DescriptionQuestionDefinition({
      _id: uuid.v4(),
      dataType: 'Description',
      title: '説明文',
    });
  }
}
