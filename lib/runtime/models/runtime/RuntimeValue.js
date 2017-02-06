import { Record, List, Map } from 'immutable';

export const RuntimeValueRecord = Record({
  currentNodeId: null,
  flowStack: List(),
  answers: Map(),
});

export default class RuntimeValue extends RuntimeValueRecord {
  getCurrentNodeId() {
    return this.get('currentNodeId');
  }

  getNodeStack() {
    return this.get('flowStack');
  }

  getInputValues() {
    return this.get('answers');
  }
}
