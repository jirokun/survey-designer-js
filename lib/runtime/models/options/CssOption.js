import { Record, List } from 'immutable';
import cuid from 'cuid';

export const CssOptionRecord = Record({
  _id: null,
  title: null,
  runtimeUrls: List(),
  previewUrls: List(),
  detailUrls: List(),
});

export default class CssOption extends CssOptionRecord {
  static create(title, runtimeUrls, previewUrls, detailUrls) {
    return new CssOption({ _id: cuid(), title, runtimeUrls, previewUrls, detailUrls });
  }

  getId() {
    return this.get('_id');
  }

  getTitle() {
    return this.get('title');
  }

  getRuntimeUrls() {
    return this.get('runtimeUrls');
  }

  getPreviewUrls() {
    return this.get('previewUrls');
  }

  getDetailUrls() {
    return this.get('detailUrls');
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

  matchDetailUrls(detailUrls) {
    const inStr = detailUrls.toArray().sort().toString();
    const currentStr = this.getDetailUrls().toArray().sort().toString();
    return inStr === currentStr;
  }
}
