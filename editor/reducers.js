import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
import { cloneObj, findPage, findFlow, findValue, findConditions } from '../utils'
import { CHANGE_DEFS, SELECT_FLOW} from '../constants'

export default function reducer(state, action) {
  let newState = cloneObj(state);
  switch (action.type) {
  case CHANGE_DEFS:
    newState.defs[action.defsName] = cloneObj(action.defs);
    return newState;
  case SELECT_FLOW:
    newState.values.currentFlowId = action.flowId;
    return newState;
  default:
    return newState;
  }
}
