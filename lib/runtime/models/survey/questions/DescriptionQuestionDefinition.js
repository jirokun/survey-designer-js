import cuid from 'cuid';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';

/** 設問定義：説明文 */
export default class DescriptionQuestionDefinition extends BaseQuestionDefinition {
  static create(pageDevId) {
    return new DescriptionQuestionDefinition({
      _id: cuid(),
      devId: surveyDevIdGeneratorInstance.generateForQuestion(pageDevId),
      dataType: 'Description',
      plainTitle: '説明文',
    });
  }
}
