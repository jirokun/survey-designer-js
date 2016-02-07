import { CHANGE_DEFS } from './constants'
export function changeDefs(defsName, defs, getPreviewWindow) {
  const previewWindow = getPreviewWindow();
  if (previewWindow) {
    const str = JSON.stringify({defsName, defs});
    previewWindow.contentWindow.postMessage(str, location.origin);
  }
  return {
    type: CHANGE_DEFS,
    defsName: defsName,
    defs: defs
  };
}
