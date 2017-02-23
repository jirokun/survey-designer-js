import * as C from '../constants/actions';

export default function reducer(state, action) {
  try {
    switch (action.type) {
      case C.RESTART:
        return state.restart();
      case C.SUBMIT_PAGE:
        return state.submitPage(action.answers);
      case C.ANSWER_NOT_POSTED:
      case C.ANSWER_POSTING:
      case C.ANSWER_POSTED_SUCCESS:
      case C.ANSWER_POSTED_FAILED:
        return state.updateAnswerPostStatus(action.type);
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    alert(e);
    return state;
  }
}
