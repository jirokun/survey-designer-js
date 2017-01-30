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

export function submitPage(inputValues) {
  return { type: C.SUBMIT_PAGE, inputValues };
}
