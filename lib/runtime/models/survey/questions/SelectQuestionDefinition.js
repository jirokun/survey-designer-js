import cuid from 'cuid';
import { List } from 'immutable';
import ItemDefinition from './internal/ItemDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';

/** 設問定義：単一選択肢(select) */
export default class SelectQuestionDefinition extends RadioQuestionDefinition {
  static create() {
    return new RadioQuestionDefinition({
      _id: cuid(),
      dataType: 'Select',
      items: List().push(ItemDefinition.create(0, '1')),
    });
  }

  getOutputType() {
    return 'select';
  }
}
