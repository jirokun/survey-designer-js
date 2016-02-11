import { INIT_ALL_DEFS, SELECT_FLOW, CHANGE_DEFS, NEXT_PAGE, PREV_PAGE, VALUE_CHANGE } from '../constants'
export function initializeDefs(allDefs) {
  return {
    type: INIT_ALL_DEFS,
    allDefs: allDefs
  };
}
export function changeDefs(defsName, defs) {
  return {
    type: CHANGE_DEFS,
    defsName: defsName,
    defs: defs
  };
}
export function nextPage() {
  return {
    type: NEXT_PAGE
  };
}
export function prevPage() {
  return {
    type: PREV_PAGE
  };
}
export function valueChange(itemName, value) {
  return { type: VALUE_CHANGE, itemName, value };
}
export function setFlowId(flowId) {
  return { type: SELECT_FLOW, flowId };
}
