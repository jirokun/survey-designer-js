import * as C from '../constants/actions';

export default function reducer(state, action) {
  try {
    switch (action.type) {
      case '@@INIT':
        state.getSurvey().updateReplacer();
        return state;
      default:
        return state.update('runtime', (runtime) => {
          switch (action.type) {
            case C.RESTART:
              return runtime.restart(state.getSurvey());
            case C.SUBMIT_PAGE:
              return runtime.submitPage(state.getSurvey(), action.pageAnswers);
            case C.CHANGE_POST_ANSWER_STATUS:
              return runtime.updatePostAnswerStatus(action.postAnswerStatus);
            case C.CHANGE_ANSWERS:
              return runtime.updateAnswers(state.getSurvey(), action.answers);
            default:
              return runtime;
          }
        });
    }
  } catch (e) {
    console.error(e);
    alert(e);
    return state;
  }
}
