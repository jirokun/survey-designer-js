import $ from 'jquery';
import * as C from '../constants/actions';
import { ANSWER_POSTED_SUCCESS, ANSWER_POSTED_FAILED, ANSWER_POSTING } from '../constants/states';

export function nextPage() {
  return { type: C.NEXT_PAGE };
}

export function restart() {
  return { type: C.RESTART };
}

export function setCurrentNodeId(nodeId) {
  return { type: C.SET_CURRENT_NODE_ID, nodeId };
}

export function updatePostAnswerStatus(postAnswerStatus) {
  return { type: C.CHANGE_POST_ANSWER_STATUS, postAnswerStatus };
}

export function changeAnswers(answers) {
  return { type: C.CHANGE_ANSWERS, answers };
}

/** ************** 非同期 ******************/
export function asyncPostAnswer(dispatch, survey, answers, isComplete, options) {
  const postAnswerUrl = options.getPostAnswerUrl();
  const extraPostParameters = options.getExtraPostParameters().toJS();
  const answerRegisteredFn = options.getAnswerRegisteredFn();

  const timeForAnswer = options.calcTimeForAnswer();
  const postData = {
    _doc: JSON.stringify(Object.assign(answers, extraPostParameters, { timeForAnswer })),
    is_complete: isComplete,
  };

  dispatch(updatePostAnswerStatus(ANSWER_POSTING));
  $.ajax({
    url: postAnswerUrl,
    method: 'POST',
    data: postData,
    dataType: 'json',
    timeout: 3000,
  }).done((response) => {
    dispatch(updatePostAnswerStatus(ANSWER_POSTED_SUCCESS));
    if (answerRegisteredFn) answerRegisteredFn(survey, response);
  }).fail(() => {
    dispatch(updatePostAnswerStatus(ANSWER_POSTED_FAILED));
  });
}
