import $ from 'jquery';
import * as C from '../constants/actions';
import { ANSWER_POSTED_SUCCESS, ANSWER_POSTED_FAILED, ANSWER_POSTING } from '../constants/states';

export function nextPage() {
  return {
    type: C.NEXT_PAGE,
  };
}

export function prevPage() {
  return { type: C.PREV_PAGE };
}

export function submitPage(answers) {
  return { type: C.SUBMIT_PAGE, answers };
}

export function restart() {
  return { type: C.RESTART };
}

export function updatePostAnswerStatus(postAnswerStatus) {
  return { type: C.CHANGE_POST_ANSWER_STATUS, postAnswerStatus };
}

/** ************** 非同期 ******************/
export function postAnswer(dispatch, postAnswerUrl, answers, isComplete, extraPostParameters) {
  const postData = {
    _doc: JSON.stringify(Object.assign(answers, extraPostParameters)),
    is_complete: isComplete,
  };
  $.ajax({
    url: postAnswerUrl,
    method: 'POST',
    data: postData,
    dataType: 'json',
    timeout: 3000,
  }).done(() => {
    dispatch(updatePostAnswerStatus(ANSWER_POSTED_SUCCESS));
  }).fail(() => {
    dispatch(updatePostAnswerStatus(ANSWER_POSTED_FAILED));
  });
  dispatch(updatePostAnswerStatus(ANSWER_POSTING));
}
