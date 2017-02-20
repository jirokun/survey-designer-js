import $ from 'jquery';
import * as C from '../constants';

export function nextPage() {
  return {
    type: C.NEXT_PAGE,
  };
}

export function prevPage() {
  return {
    type: C.PREV_PAGE,
  };
}

export function submitPage(answers) {
  return { type: C.SUBMIT_PAGE, answers };
}

export function restart() {
  return { type: C.RESTART };
}

export function updatePostAnswerStatus(type) {
  return { type };
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
    dispatch(updatePostAnswerStatus(C.ANSWER_POSTED_SUCCESS));
  }).fail(() => {
    dispatch(updatePostAnswerStatus(C.ANSWER_POSTED_FAILED));
  });
  dispatch(updatePostAnswerStatus(C.ANSWER_POSTING));
}
