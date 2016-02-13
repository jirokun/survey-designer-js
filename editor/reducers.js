import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
import { nextFlowId, cloneObj, findPage, findFlow, findValue, findConditions } from '../utils'
import { ADD_BRANCH_FLOW, ADD_PAGE_FLOW, REMOVE_EDGE, CHANGE_DEFS, SELECT_FLOW} from '../constants'

function addFlow(state, x, y, type) {
  const flowId = nextFlowId(state);
  state.defs.positionDefs.push({ flowId, x, y });
  state.defs.flowDefs.push({ id: flowId, type: type });
  return state;
}
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
  case ADD_PAGE_FLOW:
    return addFlow(newState, action.x, action.y, 'page');
  case ADD_BRANCH_FLOW:
    return addFlow(newState, action.x, action.y, 'branch');
  case REMOVE_EDGE:
    return removeEdge(newState, action.sourceFlowId, action.targetFlowId);
  default:
    return newState;
  }
}
