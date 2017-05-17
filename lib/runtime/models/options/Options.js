import { Record, Map } from 'immutable';
import { parseInteger } from '../../../utils';

export const OptionsRecord = Record({
  saveSurveyUrl: null,          // surveyを保存するURL
  previewUrl: null,             // プレビューURL
  showDetailUrl: null,          // 詳細プレビューURL
  showDetail: false,            // 制御情報を表示するかどうか
  showOutputNo: false,          // 設問番号を表示するかどうか
  postAnswerUrl: null,          // 回答を登録するURL
  confirmSurveyUrl: null,       // 配信確認ページのURL
  previewDownloadUrl: null,     // プレビュー時に回答データをDLするたのURL
  sentryInitFn: null,           // Sentryを初期化するコールバック関数
  startTime: new Date(),        // 開始時間
  extraPostParameters: Map(),   // post時に追加したいパラメタ名
  panelSelectFn: null,          // パネル選択をクリックしたときに呼ばれる関数
  answerRegisteredFn: null,     // 回答を登録したときに実行するコールバック関数
  pageLoadedFn: null,           // ページ遷移したときに呼ばれるコールバック関数
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

  getSentryInitFn() {
    return this.get('sentryInitFn');
  }

  getStartTime() {
    return this.get('startTime');
  }

  getPanelSelectFn() {
    return this.get('panelSelectFn');
  }

  getAnswerRegisteredFn() {
    return this.get('answerRegisteredFn');
  }

  getExtraPostParameters() {
    return this.get('extraPostParameters');
  }

  getPageLoadedFn() {
    return this.get('pageLoadedFn');
  }

  isShowDetail() {
    return this.get('showDetail');
  }

  isShowOutputNo() {
    return this.get('showOutputNo');
  }

  // 回答時間を計算し、秒で返す
  calcTimeForAnswer() {
    return parseInteger((new Date().getTime() - this.getStartTime().getTime()) / 1000);
  }
}
