import { Record, List, Map, Repeat } from 'immutable';

const BaseTransformedQuestionStateRecord = Record({
  transformedItems: null,
  itemState: List(),
});

const DEFAULT_CHECKBOX_STATE = { value: null, checked: false, disabled: false };

/** ランダムが表現できるQuestionStateの基底クラス */
export default class BaseTransformedQuestionState extends BaseTransformedQuestionStateRecord {
  constructor(question) {
    const transformedItems = question.getTransformedItems();
    const itemState = Repeat(Map(DEFAULT_CHECKBOX_STATE), transformedItems.size).toList();
    super({
      transformedItems,
      itemState,
    });
  }

  getTransformedItems() {
    return this.get('transformedItems');
  }

  getItemState() {
    return this.get('itemState');
  }

  getItemStateByItemIndex(index) {
    return this.getItemState().get(index);
  }

  setTransformedItems(items) {
    return this.set('transformedItems', items);
  }
}
