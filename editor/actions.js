import { GRAPH, CHANGE_DEFS, SELECT_FLOW} from '../constants'
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
