import { Record } from 'immutable';

export const ViewSettingRecord = Record({
  pageListPane: true,
  editorPane: true,
  previewPane: true,
  saveSurveyStatus: null,
});

export default class ViewSetting extends ViewSettingRecord {
  getPageListPane() {
    return this.get('pageListPane');
  }

  getEditorPane() {
    return this.get('editorPane');
  }

  getPreviewPane() {
    return this.get('previewPane');
  }

  getSaveSurveyStatus() {
    return this.get('saveSurveyStatus');
  }
}
