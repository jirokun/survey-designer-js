import { RESIZE_HOT_PANE, RESIZE_GRAPH_PANE, LOAD_STATE, SET_ELEMENTS_POSITION, CONNECT_FLOW, REMOVE_FLOW, CHANGE_POSITION, ADD_BRANCH_FLOW, ADD_PAGE_FLOW, REMOVE_EDGE, INIT_ALL_DEFS, GRAPH, CHANGE_DEFS, SELECT_FLOW} from '../constants'
export function initializeDefs(allDefs) {
  const str = JSON.stringify({type: INIT_ALL_DEFS, allDefs});
  return {
    type: INIT_ALL_DEFS
  };
}
export function changeDefs(defsName, defs) {
  return {
    type: CHANGE_DEFS,
    defsName: defsName,
    defs: defs
  };
}
export function selectFlow(flowId) {
  return {
    type: SELECT_FLOW,
    from: GRAPH,
    flowId
  }
}
export function addPageFlow(x, y) {
  return { type: ADD_PAGE_FLOW, x, y };
}
export function addBranchFlow(x, y) {
  return { type: ADD_BRANCH_FLOW, x, y };
}
export function removeFlow(flowId) {
  return { type: REMOVE_FLOW, flowId };
}
export function removeEdge(sourceFlowId, targetFlowId) {
  return { type: REMOVE_EDGE, sourceFlowId, targetFlowId };
}
export function changePosition(flowId, x, y) {
  return { type: CHANGE_POSITION, flowId, x, y };
}
export function connectFlow(sourceFlowId, dstFlowId) {
  return { type: CONNECT_FLOW, sourceFlowId, dstFlowId };
}
export function setElementsPosition(positions) {
  return { type: SET_ELEMENTS_POSITION, positions };
}
export function loadState(state) {
  return { type: LOAD_STATE, state };
}
export function resizeGraphPane(graphWidth) {
  return { type: RESIZE_GRAPH_PANE, graphWidth };
}
export function resizeHotPane(hotHeight) {
  return { type: RESIZE_HOT_PANE, hotHeight };
}
