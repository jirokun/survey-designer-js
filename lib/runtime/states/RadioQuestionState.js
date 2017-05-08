import BaseTransformedQuestionState from './BaseTransformedQuestionState';

/** RadioQuestionで使用するstate */
export default class RadioQuestionState extends BaseTransformedQuestionState {
  /** indexのradioの値を更新する */
  setItemState(index) {
    return this
      .updateIn(['itemState'], state =>
        state.map((v, i) =>
          v.set('checked', i === index),
        ),
      );
  }
}
