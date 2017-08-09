import { List } from 'immutable';
import ItemDefinition from './internal/ItemDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';
import surveyIdGeneratorInstance from '../../../SurveyIdGenerator';

/** 設問定義：単一選択肢(select) */
export default class SelectQuestionDefinition extends RadioQuestionDefinition {
  static create(options) {
    const questionId = surveyIdGeneratorInstance.generateQuestionId(options.pageId);
    if (options && options.defaultItems) {
      return new SelectQuestionDefinition({
        _id: questionId,
        dataType: 'Select',
        items: List(options.defaultItems.map((label, index) => {
          const itemId = surveyIdGeneratorInstance.generateItemId();
          return ItemDefinition.create(itemId, index, `${index + 1}`, label);
        })),
      });
    }
    const itemId = surveyIdGeneratorInstance.generateItemId();
    return new SelectQuestionDefinition({
      _id: questionId,
      dataType: 'Select',
      items: List().push(ItemDefinition.create(itemId, 0, '1')),
    });
  }

  getOutputType() {
    return 'select';
  }
}
