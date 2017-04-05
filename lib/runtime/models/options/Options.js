import { Record, Map } from 'immutable';

export const OptionsRecord = Record({
  saveSurveyUrl: null,          // surveyを保存するURL
  previewUrl: null,             // プレビューURL
  showDetailUrl: null,          // 詳細プレビューURL
  showDetail: false,            // 制御情報を表示するかどうか
  postAnswerUrl: null,          // 回答を登録するURL
  confirmSurveyUrl: null,       // 配信確認ページのURL
  previewDownloadUrl: null,     // プレビュー時に回答データをDLするたのURL
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

  getShowDetailUrl() {
    return this.get('showDetailUrl');
  }

  getPostAnswerUrl() {
    return this.get('postAnswerUrl');
  }

  getConfirmSurveyUrl() {
    return this.get('confirmSurveyUrl');
  }

  getPreviewDownloadUrl() {
    return this.get('previewDownloadUrl');
  }

  getPanelSelectFn() {
    return this.get('panelSelectFn');
  }

  getExtraPostParameters() {
    return this.get('extraPostParameters');
  }

  isShowDetail() {
    return this.get('showDetail');
  }
}
