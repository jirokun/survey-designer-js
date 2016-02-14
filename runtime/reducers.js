import { INIT_ALL_DEFS, SELECT_FLOW, CHANGE_DEFS, VALUE_CHANGE, NEXT_PAGE, PREV_PAGE } from '../constants'
import { cloneObj, findFlow, findConditions } from '../utils'

/**
 * branchを評価する
 */
function evaluateBranch(state, branchFlow) {
  const conditions = findConditions(state, branchFlow.id);
  for (let i = 0, len = conditions.length; i < len; i++) {
    const c = conditions[i];
    if (c.type === 'if') {
      const func = new Function('state', 'cond',
          `return state.values.inputValues[cond.question] ${c.operator} cond.value`);
      const bool = func(state, c);
      if (bool) {
        return c.nextFlowId;
      }
    } else if (c.type === 'else') {
      return c.nextFlowid;
    } else {
      throw `unkown condition type: "${c.type}" at FlowID=${c.flowId}`;
    }
  }
  throw 'next flow is not defined';
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
      for (;;) {
        const nextFlowId = evaluateBranch(state, nextFlow);
        if (!nextFlowId) {
          throw 'next flow is not defined';
        }
        nextFlow = findFlow(state, nextFlowId);
        if (nextFlow.type === 'page') {
          return nextFlow;
        }
      }
    default:
      throw 'unkwon flow type: ' + nextFlow.type;
  }
}
function showPage(state, action) {
  const { currentFlowId, flowStack } = state.values;
  switch (action.type) {
    case SELECT_FLOW: {
      return { currentFlowId: action.flowId, flowStack: [] };
    }
    case NEXT_PAGE: {
      const nextFlow = nextFlowPage(state, currentFlowId);
      return { currentFlowId: nextFlow.id, flowStack: [...flowStack, currentFlowId]};
    }
    case PREV_PAGE: {
      let newFlowStack = [...flowStack];
      const prevFlowId = newFlowStack.pop();
      return { currentFlowId: prevFlowId, flowStack: newFlowStack };
    }
    default: {
      return { currentFlowId: currentFlowId, flowStack: [...flowStack]};
    }
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
  let newState = cloneObj(state.defs);
  switch (action.type) {
    case INIT_ALL_DEFS:
      return cloneObj(action.allDefs);
    case CHANGE_DEFS:
      newState[action.defsName] = action.defs;
      return newState;
    default:
      return newState;
  }
}

export default function reducer(state, action) {
  const newState = cloneObj(state);
  try {
    if (action.type === INIT_ALL_DEFS) {
      // 初期化処理だけ別処理
      return {
        values: {
          currentFlowId: action.allDefs.flowDefs[0].id,
          flowStack: [],
          inputValues: []
        },
        defs: cloneObj(action.allDefs),
        viewSettings: newState.viewSettings
      };
    }
    const { currentFlowId, flowStack } = showPage(state, action);
    return {
      values: {
        currentFlowId,
        flowStack,
        inputValues: changeValue(state, action)
      },
      defs: changeDefs(state, action),
      viewSettings: newState.viewSettings
    }
  } catch(e) {
    alert(e);
    return newState;
  }
}
