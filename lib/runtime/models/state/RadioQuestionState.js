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
  setCheckboxState(index, checked) {
    const choice = this.getTransformedChoices().sort((a, b) => {
      if (a.getIndex() < b.getIndex()) return -1;
      if (a.getIndex() === b.getIndex()) return 0;
      return 1;
    }).get(index);
    if (choice.isExclusive()) {
      // disabledも合わせて設定することに注意
      if (checked) {
        return this
          .updateIn(['checkboxState'], state =>
            state.map((v, i) =>
              v
                .set('disabled', i !== index)
                .set('checked', i === index),
            ),
          );
      }
      return this
        .updateIn(['checkboxState'], state =>
          state.map(v =>
            v
              .set('disabled', false)
              .set('checked', false),
          ),
        );
    }
    return this.setIn(['checkboxState', index, 'checked'], checked);
  }
}
