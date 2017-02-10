import * as C from '../constants';
import { cloneObj, findNode, findBranch } from '../utils';

export default function reducer(state, action) {
  try {
    switch (action.type) {
      case C.RESTART:
        return state.restart();
      case C.SUBMIT_PAGE:
        return state.submitPage(action.answers);
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    alert(e);
    return state;
  }
}
