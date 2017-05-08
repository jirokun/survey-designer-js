import BaseTransformedQuestionState from './BaseTransformedQuestionState';

/** MultiNumberQuestionで使用するstate */
export default class MultiNumberQuestionState extends BaseTransformedQuestionState {
  setItemState(index, value) {
    return this.updateIn(['itemState', index], value);
  }
}
