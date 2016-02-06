import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
import { findPage, findFlow, findValue, findConditions } from '../utils'
import { CHANGE_DEFS } from './constants'

export default function reducer(state, action) {
  switch (action.type) {
  case CHANGE_DEFS:
    let newState = Object.assign({}, state);
    newState.defs[action.defsName] = action.defs;
    return newState;
  default:
    return state;
  }
}
