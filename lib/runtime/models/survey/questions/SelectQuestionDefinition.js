import cuid from 'cuid';
import { List } from 'immutable';
import ItemDefinition from './internal/ItemDefinition';
import RadioQuestionDefinition from './RadioQuestionDefinition';

/** 設問定義：単一選択肢(select) */
export default class SelectQuestionDefinition extends RadioQuestionDefinition {
  static create(options) {
    if (options && options.defaultItems) {
      return new SelectQuestionDefinition({
        _id: cuid(),
        dataType: 'Select',
        items: List(options.defaultItems.map((label, index) => ItemDefinition.create(index, `${index + 1}`, label))),
      });
    }
    return new SelectQuestionDefinition({
      _id: cuid(),
      dataType: 'Select',
      items: List().push(ItemDefinition.create(0, '1')),
    });
  }

  getOutputType() {
    return 'select';
  }
}
