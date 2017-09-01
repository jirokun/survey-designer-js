import { Record, List } from 'immutable';

export const CssOptionRecord = Record({
  title: null,
  runtimeUrls: List(),
  previewUrls: List(),
});

export default class CssOption extends CssOptionRecord {
  getTitle() {
    return this.get('title');
  }

  getRuntimeUrls() {
    return this.get('runtimeUrls');
  }

  getPreviewUrls() {
    return this.get('previewUrls');
  }

  matchRuntimeUrls(runtimeUrls) {
    const inStr = runtimeUrls.toArray().sort().toString();
    const currentStr = this.getRuntimeUrls().toArray().sort().toString();
    return inStr === currentStr;
  }

  matchPreviewUrls(previewUrls) {
    const inStr = previewUrls.toArray().sort().toString();
    const currentStr = this.getPreviewUrls().toArray().sort().toString();
    return inStr === currentStr;
  }
}
