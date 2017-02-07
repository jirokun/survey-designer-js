import * as C from '../constants';
import { cloneObj, findNode, findBranch } from '../utils';

/**
 * branchを評価する
 */
function evaluateBranch(state, branchNode) {
  function evaluateConditions(func, childConditions) {
    return func.call(childConditions, (cc) => {
      const inputValue = state.values.answers[cc.refQuestionId];
      if (cc.operator === 'includes') {
        const checkboxValue = inputValue.find(v => v.value === cc.value);
        return checkboxValue.checked;
      }
      return false;
    });
  }
  const conditions = findBranch(state, branchNode.refId).conditions;
  for (let i = 0, len = conditions.length; i < len; i++) {
    const c = conditions[i];
    const isLast = (i === len - 1);
    if (isLast) {
      return c.nextNodeId;
    } else if (c.type === 'any') {
      const match = evaluateConditions(Array.prototype.some, c.childConditions);
      if (!match) {
        continue;
      }
      return c.nextNodeId;
    } else if (c.type === 'all') {
      const match = evaluateConditions(Array.prototype.every, c.childConditions);
      if (!match) {
        continue;
      }
      return c.nextNodeId;
    }
    throw new Error(`unkown condition type: "${c.type}" at NodeID=${c.nodeId}`);
  }
  throw new Error('next node is not defined');
}

export default function reducer(state, action) {
  try {
    switch (action.type) {
      case C.RESTART:
        return state.restart();
      case C.SUBMIT_PAGE:
        return state.submitPage(action.answers);
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    alert(e);
    return state;
  }
}
