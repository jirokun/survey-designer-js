import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
import { cloneObj, findPage, findFlow, findValue, findConditions } from '../utils'
import { REMOVE_EDGE, CHANGE_DEFS, SELECT_FLOW} from '../constants'

function removeEdge(state, sourceFlowId, targetFlowId) {
  const sourceFlow = findFlow(state, sourceFlowId);
  if (sourceFlow.type === 'page') {
    sourceFlow.nextFlowId = null;
  } else if (sourceFlow.type === 'branch') {
    const targetCondition = findConditions(state, sourceFlowId).find((def) => {
      return def.nextFlowId === targetFlowId;
    });
    targetCondition.nextFlowId = null;
  } else {
    throw "unkown flow type: " + sourceFlow.type;
  }
  return state;
}

export default function reducer(state, action) {
  let newState = cloneObj(state);
  switch (action.type) {
  case CHANGE_DEFS:
    newState.defs[action.defsName] = cloneObj(action.defs);
    return newState;
  case SELECT_FLOW:
    newState.values.currentFlowId = action.flowId;
    return newState;
  case REMOVE_EDGE:
    return removeEdge(newState, action.sourceFlowId, action.targetFlowId);
  default:
    return newState;
  }
}
