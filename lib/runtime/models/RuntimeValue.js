import { Record, List, Map } from 'immutable';

export const RuntimeValueRecord = Record({
  currentFlowId: null,
  flowStack: List(),
  inputValues: Map(),
});

export default class RuntimeValue extends RuntimeValueRecord {
  getCurrentFlowId() {
    return this.get('currentFlowId');
  }

  getFlowStack() {
    return this.get('flowStack');
  }

  getInputValues() {
    return this.get('inputValues');
  }
}
