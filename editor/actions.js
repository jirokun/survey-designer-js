import { CONNECT_FLOW, REMOVE_FLOW, CHANGE_POSITION, ADD_BRANCH_FLOW, ADD_PAGE_FLOW, REMOVE_EDGE, INIT_ALL_DEFS, GRAPH, CHANGE_DEFS, SELECT_FLOW} from '../constants'
export function initializeDefs(allDefs, previewWindow) {
  const str = JSON.stringify({type: INIT_ALL_DEFS, allDefs});
  previewWindow.contentWindow.postMessage(str, location.origin);
  return {
    type: INIT_ALL_DEFS
  };
}
export function changeDefs(defsName, defs, getPreviewWindow) {
  const previewWindow = getPreviewWindow();
  if (previewWindow) {
    const str = JSON.stringify({type: CHANGE_DEFS, defsName, defs});
    previewWindow.contentWindow.postMessage(str, location.origin);
  }
  return {
    type: CHANGE_DEFS,
    defsName: defsName,
    defs: defs
  };
}
export function selectFlow(flowId, getPreviewWindow) {
  const previewWindow = getPreviewWindow();
  if (previewWindow) {
    const str = JSON.stringify({type: SELECT_FLOW, flowId});
    previewWindow.contentWindow.postMessage(str, location.origin);
  }
  return {
    type: SELECT_FLOW,
    from: GRAPH,
    flowId
  }
}
export function addPageFlow(x, y, getPreviewWindow) {
  return { type: ADD_PAGE_FLOW, x, y };
}
export function addBranchFlow(x, y, getPreviewWindow) {
  return { type: ADD_BRANCH_FLOW, x, y };
}
export function addEdgeFlow(getPreviewWindow) {
}
export function removeFlow(flowId, getPreviewWindow) {
  return { type: REMOVE_FLOW, flowId };
}
export function addEdge(getPreviewWindow) {
}
export function removeEdge(sourceFlowId, targetFlowId, getPreviewWindow) {
  return { type: REMOVE_EDGE, sourceFlowId, targetFlowId };
}
export function changePosition(flowId, x, y) {
  return { type: CHANGE_POSITION, flowId, x, y };
}
export function connectFlow(sourceFlowId, dstFlowId) {
  return { type: CONNECT_FLOW, sourceFlowId, dstFlowId };
}
