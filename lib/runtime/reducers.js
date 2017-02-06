import * as C from '../constants';
import { cloneObj, findFlow, findBranch } from '../utils';

/**
 * branchを評価する
 */
function evaluateBranch(state, branchFlow) {
  function evaluateConditions(func, childConditions) {
    return func.call(childConditions, (cc) => {
      const inputValue = state.values.inputValues[cc.refQuestionId];
      if (cc.operator === 'includes') {
        const checkboxValue = inputValue.find(v => v.value === cc.value);
        return checkboxValue.checked;
      }
      return false;
    });
  }
  const conditions = findBranch(state, branchFlow.refId).conditions;
  for (let i = 0, len = conditions.length; i < len; i++) {
    const c = conditions[i];
    const isLast = (i === len - 1);
    if (isLast) {
      return c.nextFlowId;
    } else if (c.type === 'any') {
      const match = evaluateConditions(Array.prototype.some, c.childConditions);
      if (!match) {
        continue;
      }
      return c.nextFlowId;
    } else if (c.type === 'all') {
      const match = evaluateConditions(Array.prototype.every, c.childConditions);
      if (!match) {
        continue;
      }
      return c.nextFlowId;
    } else {
      throw `unkown condition type: "${c.type}" at FlowID=${c.flowId}`;
    }
  }
  throw 'next flow is not defined';
}

export default function reducer(state, action) {
  try {
    switch (action.type) {
      case C.RESTART:
        return state.restart();
      case C.SUBMIT_PAGE:
        console.log(state.getIn(['runtimeValues', 'inputValues']));
        console.log(state.mergeIn(['runtimeValues', 'inputValues'], {'ABC': 123}));
        const newState = state.submitPage(action.inputValues);
        console.log(newState.getInputValues());
        return newState;
    }
    return state;
  } catch (e) {
    console.error(e);
    alert(e);
    return state;
  }
}
