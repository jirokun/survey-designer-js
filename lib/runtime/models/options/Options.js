import { Record } from 'immutable';

export const OptionsRecord = Record({
  saveUrl: null,
  panelSelectFn: null,
});

export default class Options extends OptionsRecord {
  getSaveUrl() {
    return this.get('saveUrl');
  }

  getPanelSelectFn() {
    return this.get('panelSelectFn');
  }
}
