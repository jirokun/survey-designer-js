import { Record } from 'immutable';
import { SURVEY_NOT_MODIFIED } from '../../../constants/states';

export const ViewSettingRecord = Record({
  pageListPane: true,
  editorPane: true,
  previewPane: true,
  saveSurveyStatus: SURVEY_NOT_MODIFIED,
});

/** editorのviewの定義 */
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
