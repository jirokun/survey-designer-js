import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
import { VALUE_CHANGE, NEXT_PAGE, PREV_PAGE } from './constants'
import { findPage, findFlow, findValue } from './utils'

/**
 * typeがpageの次のflowを返す
 */
function nextFlowPage(state, flowId) {
  const flow = findFlow(state, flowId);
  const nextFlow = findFlow(state, flow.nextFlowId);
  switch (nextFlow.type) {
    case 'page':
      return nextFlow;
    case 'branch':
      return nextFlow;
    default:
      throw 'unkwon flow type: ' + nextFlow.type;
  }
}
function showPage(state, action) {
  var { currentFlowId, flowStack } = state.values;
  switch (action.type) {
    case NEXT_PAGE:
      var nextFlow = nextFlowPage(state, currentFlowId);
      return { currentFlowId: nextFlow.id, flowStack: [...flowStack, currentFlowId]};
    case PREV_PAGE:
      var newFlowStack = [...flowStack];
      var prevFlowId = newFlowStack.pop();
      return { currentFlowId: prevFlowId, flowStack };
    default:
      return { currentFlowId: currentFlowId, flowStack: [...flowStack]};
  }
}
function changeValue(state, action) {
  var inputValues = Object.assign({}, state.values.inputValues);
  switch (action.type) {
    case VALUE_CHANGE:
      inputValues[action.itemName] = action.value;
      return inputValues;
    default:
      return inputValues;
  }
}

export default function reducer(state, action) {
  const{ currentFlowId, flowStack } = showPage(state, action);
  return {
    values: {
      currentFlowId,
      flowStack,
      inputValues: changeValue(state, action)
    },
    defs: Object.assign({}, state.defs)
  }
}
