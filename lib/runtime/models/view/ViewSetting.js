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

  // ---------------------- 更新系 --------------------------
  /** 表示するペインのon, offを切り替える */
  updateShowPane(paneName, show) {
    return this.set(paneName, show);
  }

  /** surveyの保存リクエスト状態を更新する */
  updateSaveSurveyStatus(saveStatus) {
    return this.set('saveSurveyStatus', saveStatus);
  }
}
