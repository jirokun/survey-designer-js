import { Record, List } from 'immutable';

const RadioQuestionStateRecord = Record({
  transformedChoices: null,
  checkboxState: List(),
});

export default class RadioQuestionState extends RadioQuestionStateRecord {
  getTransformedChoices() {
    return this.get('transformedChoices');
  }

  getCheckboxState() {
    return this.get('checkboxState');
  }

  getCheckboxStateByChoiceIndex(index) {
    return this.getCheckboxState().get(index);
  }

  setTransformedChoices(choices) {
    return this.set('transformedChoices', choices);
  }

  /** indexのcheckboxの値を更新する */
  setCheckboxState(index) {
    return this
      .updateIn(['checkboxState'], state =>
        state.map((v, i) =>
          v.set('checked', i === index),
        ),
      );
  }
}
