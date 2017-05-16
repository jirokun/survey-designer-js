import $ from 'jquery';
import * as C from '../constants/actions';
import { ANSWER_POSTED_SUCCESS, ANSWER_POSTED_FAILED, ANSWER_POSTING } from '../constants/states';
import { parseInteger } from '../utils';

export function submitPage(pageAnswers) {
  return { type: C.SUBMIT_PAGE, pageAnswers };
}

export function restart() {
  return { type: C.RESTART };
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

  const answerTime = parseInteger((new Date().getTime() - options.getStartTime().getTime()) / 1000);
  const postData = {
    _doc: JSON.stringify(Object.assign(answers, extraPostParameters, { answerTime })),
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
