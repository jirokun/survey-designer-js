import { Record } from 'immutable';
import { SURVEY_NOT_MODIFIED } from '../../../constants/states';

export const ViewSettingRecord = Record({
  graphPane: true,
  editorPane: true,
  previewPane: true,
  saveSurveyStatus: SURVEY_NOT_MODIFIED,
});

/** editorのviewの定義 */
export default class ViewSetting extends ViewSettingRecord {
  getGraphPane() {
    return this.get('graphPane');
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
