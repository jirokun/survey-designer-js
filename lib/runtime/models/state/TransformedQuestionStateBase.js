import { Record, List } from 'immutable';

const TransformedQuestionStateBaseRecord = Record({
  transformedItems: null,
  itemState: List(),
});

export default class TransformedQuestionStateBase extends TransformedQuestionStateBaseRecord {
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
