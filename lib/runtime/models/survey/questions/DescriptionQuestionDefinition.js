import cuid from 'cuid';
import BaseQuestionDefinition from './BaseQuestionDefinition';

/** 設問定義：説明文 */
export default class DescriptionQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new DescriptionQuestionDefinition({
      _id: cuid(),
      dataType: 'Description',
      plainTitle: '説明文',
    });
  }
}
