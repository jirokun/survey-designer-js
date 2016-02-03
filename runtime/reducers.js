import { combineReducers } from 'redux'
import undoable, { distinctState } from 'redux-undo'
import { VALUE_CHANGE, NEXT_PAGE, PREV_PAGE } from './constants'
import { findPage, findFlow, findValue } from '../utils'

/**
 * branchを評価する
 */
function evaluateBranch(state, branchFlow) {
  const condition = branchFlow.condition;
  if (condition.type === 'javascript') {
    const func = new Function('state', condition.formula);
    const nextFlowId = func(state);
    return nextFlowId;
  } else if (condition.type === 'simple') {
    const { ifs, else_ } = condition;
    for (var i = 0, len = ifs.length; i < len; i++) {
      const if_ = ifs[i];
      const value = state.values[if_.question];
      const func = new Function('state', 'if_',
          `return state.values.inputValues[if_.question] ${if_.operator} if_.value`);
      const bool = func(state, if_);
      if (bool) return if_.nextFlowId;
    }
    return condition['else'];
  } else {
    throw 'unkown condition type: ' + condition.type;
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
