import TransformedQuestionStateBase from './TransformedQuestionStateBase';

export default class MultiNumberQuestionState extends TransformedQuestionStateBase {
  setItemState(index, value) {
    return this.updateIn(['itemState', index], value);
  }
}
