import { Record, List, Map } from 'immutable';

export const RuntimeValueRecord = Record({
  currentFlowId: null,
  flowStack: List(),
  inputValue: Map(),
});

export default class RuntimeValue extends RuntimeValueRecord {
}
