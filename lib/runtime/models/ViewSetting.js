import { Record } from 'immutable';

export const ViewSettingRecord = Record({
  graphWidth: 300,
  editorHeight: 400,
});

export default class ViewSetting extends ViewSettingRecord {
}
