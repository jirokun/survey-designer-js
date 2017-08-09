import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import surveyIdGeneratorInstance from '../../../SurveyIdGenerator';

/** 設問定義：説明文 */
export default class DescriptionQuestionDefinition extends BaseQuestionDefinition {
  static create(options) {
    const questionId = surveyIdGeneratorInstance.generateQuestionId(options.pageId);
    return new DescriptionQuestionDefinition({
      _id: questionId,
      dataType: 'Description',
      plainTitle: '説明文',
    });
  }
}
