import { Record, List, Map } from 'immutable';

export const RuntimeValueRecord = Record({
  currentNodeId: null,
  nodeStack: List(),
  answers: Map(),
});

export default class RuntimeValue extends RuntimeValueRecord {
  getCurrentNodeId() {
    return this.get('currentNodeId');
  }

  getNodeStack() {
    return this.get('nodeStack');
  }

  getInputValues() {
    return this.get('answers');
  }
}
