import { Record, List } from 'immutable';

const TransformedQuestionStateBaseRecord = Record({
  transformedChoices: null,
  itemState: List(),
});

export default class TransformedQuestionStateBase extends TransformedQuestionStateBaseRecord {
  getTransformedChoices() {
    return this.get('transformedChoices');
  }

  getItemState() {
    return this.get('itemState');
  }

  getItemStateByChoiceIndex(index) {
    return this.getItemState().get(index);
  }

  setTransformedChoices(choices) {
    return this.set('transformedChoices', choices);
  }
}
