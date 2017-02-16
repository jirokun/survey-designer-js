import { Record } from 'immutable';

export const OptionsRecord = Record({
  saveUrl: null,
  previewUrl: null,
  panelSelectFn: null,
});

export default class Options extends OptionsRecord {
  getSaveUrl() {
    return this.get('saveUrl');
  }

  getPreviewUrl() {
    return this.get('previewUrl');
  }

  getPanelSelectFn() {
    return this.get('panelSelectFn');
  }
}
