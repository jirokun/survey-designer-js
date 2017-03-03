import * as C from '../constants/actions';

export default function reducer(state, action) {
  try {
    switch (action.type) {
      case C.RESTART:
        return state.restart();
      case C.SUBMIT_PAGE:
        return state.submitPage(action.pageAnswers);
      case C.CHANGE_POST_ANSWER_STATUS:
        return state.updatePostAnswerStatus(action.postAnswerStatus);
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    alert(e);
    return state;
  }
}
