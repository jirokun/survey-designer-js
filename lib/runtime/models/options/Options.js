import { Record } from 'immutable';

export const OptionsRecord = Record({
  saveUrl: null,                // surveyを保存するURL
  previewUrl: null,             // プレビューURL
  postAnswerUrl: null,          // 回答を登録するURL
  confirmSurveyUrl: null,       // 配信化確認ページのURLを
  panelSelectFn: null,
});

export default class Options extends OptionsRecord {
  getSaveUrl() {
    return this.get('saveUrl');
  }

  getPreviewUrl() {
    return this.get('previewUrl');
  }

  getPostAnswerUrl() {
    return this.get('postAnswerUrl');
  }

  getConfirmSurveyUrl() {
    return this.get('confirmSurveyUrl');
  }

  getPanelSelectFn() {
    return this.get('panelSelectFn');
  }
}
