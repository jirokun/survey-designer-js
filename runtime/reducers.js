import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
import { CHANGE_DEFS, VALUE_CHANGE, NEXT_PAGE, PREV_PAGE } from './constants'
import { findPage, findFlow, findValue, findConditions } from '../utils'

/**
 * branchを評価する
 */
function evaluateBranch(state, branchFlow) {
  const conditions = findConditions(state, branchFlow.id);
  for (var i = 0, len = conditions.length; i < len; i++) {
    const c = conditions[i];
    if (c.type === 'if') {
      const value = state.values[c.question];
      const func = new Function('state', 'cond',
          `return state.values.inputValues[cond.question] ${c.operator} cond.value`);
      const bool = func(state, c);
      if (bool) return c.nextFlowId;
    } else if (c.type === 'else') {
      return c.nextFlowid;
    } else {
      throw 'unkown condition type: ' + c.type;
    }
  }
}
/**
 * typeがpageの次のflowを返す
 */
function nextFlowPage(state, flowId) {
  const flow = findFlow(state, flowId);
  let nextFlow = findFlow(state, flow.nextFlowId);
  switch (nextFlow.type) {
    case 'page':
      return nextFlow;
    case 'branch':
      while (true) {
        const nextFlowId = evaluateBranch(state, nextFlow);
        nextFlow = findFlow(state, nextFlowId);
        if (nextFlow.type === 'page') return nextFlow;
      }
    default:
      throw 'unkwon flow type: ' + nextFlow.type;
  }
}
function showPage(state, action) {
  const { currentFlowId, flowStack } = state.values;
  switch (action.type) {
    case NEXT_PAGE:
      const nextFlow = nextFlowPage(state, currentFlowId);
      return { currentFlowId: nextFlow.id, flowStack: [...flowStack, currentFlowId]};
    case PREV_PAGE:
      let newFlowStack = [...flowStack];
      const prevFlowId = newFlowStack.pop();
      return { currentFlowId: prevFlowId, flowStack: newFlowStack };
    default:
      return { currentFlowId: currentFlowId, flowStack: [...flowStack]};
  }
}
function changeValue(state, action) {
  let inputValues = Object.assign({}, state.values.inputValues);
  switch (action.type) {
    case VALUE_CHANGE:
      inputValues[action.itemName] = action.value;
      return inputValues;
    default:
      return inputValues;
  }
}
function changeDefs(state, action) {
  let newState = Object.assign({}, state.defs);
  switch (action.type) {
    case CHANGE_DEFS:
      newState[action.defsName] = action.defs;
      return newState;
    default:
      return newState;
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
    defs: changeDefs(state, action)
  }
}
