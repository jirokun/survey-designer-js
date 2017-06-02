import { Record, List, Map, Repeat } from 'immutable';

const BaseTransformedQuestionStateRecord = Record({
  transformedItems: null,
  transformedSubItems: null,
  itemState: List(),
});

const DEFAULT_CHECKBOX_STATE = { value: null, checked: false, disabled: false };

/** ランダムが表現できるQuestionStateの基底クラス */
export default class BaseTransformedQuestionState extends BaseTransformedQuestionStateRecord {
  constructor(question, enableTransformedItems) {
    const transformedItems = question.getTransformedItems(enableTransformedItems);
    const transformedSubItems = question.getTransformedSubItems(enableTransformedItems);
    const itemState = Repeat(Map(DEFAULT_CHECKBOX_STATE), transformedItems.size).toList();
    super({
      transformedItems,
      transformedSubItems,
      itemState,
    });
  }

  getTransformedItems() {
    return this.get('transformedItems');
  }

  getTransformedSubItems() {
    return this.get('transformedSubItems');
  }

  getItemState() {
    return this.get('itemState');
  }

  getItemStateByItemIndex(index) {
    return this.getItemState().get(index);
  }
}
