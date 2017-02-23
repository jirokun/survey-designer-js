import TransformedQuestionStateBase from './TransformedQuestionStateBase';

/** MultiNumberQuestionで使用するstate */
export default class MultiNumberQuestionState extends TransformedQuestionStateBase {
  setItemState(index, value) {
    return this.updateIn(['itemState', index], value);
  }
}
