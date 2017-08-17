import cuid from 'cuid';
import { List } from 'immutable';
import ItemDefinition from './internal/ItemDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';

/** 設問定義：単一選択肢(select) */
export default class SelectQuestionDefinition extends RadioQuestionDefinition {
  static create(pageDevId, options) {
    const questionDevId = surveyDevIdGeneratorInstance.generateForQuestion(pageDevId);
    if (options && options.defaultItems) {
      return new SelectQuestionDefinition({
        _id: cuid(),
        devId: questionDevId,
        dataType: 'Select',
        items: List(options.defaultItems.map((label, index) => {
          const itemDevId = surveyDevIdGeneratorInstance.generateForItem(questionDevId);
          return ItemDefinition.create(itemDevId, index, `${index + 1}`, label);
        })),
      });
    }
    const itemDevId = surveyDevIdGeneratorInstance.generateForItem(questionDevId);
    return new SelectQuestionDefinition({
      _id: cuid(),
      devId: questionDevId,
      dataType: 'Select',
      items: List().push(ItemDefinition.create(itemDevId, 0, '1')),
    });
  }

  getOutputType() {
    return 'select';
  }
}
