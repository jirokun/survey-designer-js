import { Record } from 'immutable';
import { SURVEY_NOT_MODIFIED } from '../../../constants/states';

export const ViewSettingRecord = Record({
  flowPane: true,
  editorPane: true,
  previewPane: true,
  saveSurveyStatus: SURVEY_NOT_MODIFIED,
});

/** editorのviewの定義 */
export default class ViewSetting extends ViewSettingRecord {
  getFlowPane() {
    return this.get('flowPane');
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
  /** 属性値を変更する */
  updateViewAttribute(attribute, value) {
    return this.set(attribute, value);
  }

  /** surveyの保存リクエスト状態を更新する */
  updateSaveSurveyStatus(saveStatus) {
    return this.set('saveSurveyStatus', saveStatus);
  }
}
