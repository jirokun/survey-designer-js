import $ from 'jquery';
import Raven from 'raven-js';
import * as C from '../constants/actions';
import { ANSWER_POSTED_SUCCESS, ANSWER_POSTED_FAILED, ANSWER_POSTING } from '../constants/states';

export function nextPage() {
  return { type: C.NEXT_PAGE };
}

export function restart() {
  return { type: C.RESTART };
}

export function changeCurrentNodeId(nodeId) {
  return { type: C.CHANGE_CURRENT_NODE_ID, nodeId };
}

export function updatePostAnswerStatus(postAnswerStatus) {
  return { type: C.CHANGE_POST_ANSWER_STATUS, postAnswerStatus };
}

export function changeAnswers(answers) {
  return { type: C.CHANGE_ANSWERS, answers };
}

/** ************** 非同期 ******************/
export function asyncPostAnswer(dispatch, survey, finisher, answers, isComplete, options) {
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
  }).fail((xhr, status, error) => {
    const finisherId = finisher.getId();
    const finisherNo = survey.calcFinisherNo(finisherId);
    Raven.captureMessage('回答の登録に失敗しました', {
      level: 'error',
      tags: { finisherId, finisherNo },
      extra: {
        responseText: xhr.responseText,
        status: xhr.status,
        error,
        answers,
      },
    });
    dispatch(updatePostAnswerStatus(ANSWER_POSTED_FAILED));
  });
}
