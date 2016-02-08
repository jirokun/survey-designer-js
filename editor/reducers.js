import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
import { findPage, findFlow, findValue, findConditions } from '../utils'
import { CHANGE_DEFS, SELECT_FLOW} from '../constants'

export default function reducer(state, action) {
  let newState = Object.assign({}, state);
  switch (action.type) {
  case CHANGE_DEFS:
    newState.defs[action.defsName] = action.defs;
    return newState;
  case SELECT_FLOW:
    newState.currentFlowId = action.flowId;
    return newState;
  default:
    return newState;
  }
}
