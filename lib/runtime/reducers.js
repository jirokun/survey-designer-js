import * as C from '../constants/actions';

export default function reducer(state, action) {
  try {
    switch (action.type) {
      case '@@INIT':
        state.getSurvey().refreshReplacer();
        return state;
      default:
        return state.update('runtime', (runtime) => {
          switch (action.type) {
            case C.RESTART:
              return runtime.restart(state.getSurvey());
            case C.SET_CURRENT_NODE_ID:
              return runtime.setCurrentNodeId(action.nodeId);
            case C.NEXT_PAGE:
              return runtime.nextPage(state.getSurvey());
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
