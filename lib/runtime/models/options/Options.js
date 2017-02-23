import { Record, Map } from 'immutable';

export const OptionsRecord = Record({
  saveSurveyUrl: null,          // surveyを保存するURL
  previewUrl: null,             // プレビューURL
  postAnswerUrl: null,          // 回答を登録するURL
  confirmSurveyUrl: null,       // 配信化確認ページのURLを
  extraPostParameters: Map(),   // post時に追加したいパラメタ名
  panelSelectFn: null,          // パネル選択をクリックしたときに呼ばれる関数
});

export default class Options extends OptionsRecord {
  getSaveSurveyUrl() {
    return this.get('saveSurveyUrl');
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

  getExtraPostParameters() {
    return this.get('extraPostParameters');
  }
}
