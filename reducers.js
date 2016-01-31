import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'

import { NEXT_PAGE } from './actions'

function nextPage(state) {
  let pageFlow = state.pageFlow[state.currentPage + 1];
  switch (pageFlow.type) {
  case 'page':
  case 'system':
    return state.currentPage + 1;
  case 'branch':
    // TODO ここでconditionを評価する
    //pageFlow.conditions.find((c) => eval(c
    return  pageFlow;
  default:
    throw 'Unknown pageFlow: ' + pageFlow.type;
  }
}
/** ページIDからページを取得する */
function findPage(state, id) {
  return state.pageDef[id];
}
function showPage(state = FIRST, action) {
  switch (action.type) {
    case NEXT_PAGE:
      return Object.assign({}, state, {
        currentPage: nextPage(state)
      });

  }
}

const enqueteApp = combineReducers({
  showPage,
  todos: undoable(todos, { filter: distinctState() })
})

export default todoApp
