import { Record, Map, List } from 'immutable';
import { parseInteger, isDevelopment } from '../../../utils';

export const OptionsRecord = Record({
  headerHtml: null,                        // ヘッダーのHTML
  saveSurveyUrl: null,                     // surveyを保存するURL
  previewUrl: null,                        // プレビューURL
  showDetailUrl: null,                     // 詳細プレビューURL
  useBrowserHistory: false,                // ブラウザのヒストリ機能を使うかどうか
  showDetail: false,                       // 制御情報を表示するかどうか
  showOutputNo: false,                     // 設問番号を表示するかどうか
  showPageNo: false,                       // ページ番号・分岐番号・終了ページ番号を表示するかどうか
  imageManagerUrl: null,                   // 画像管理のURL
  postAnswerUrl: null,                     // 回答を登録するURL
  confirmSurveyUrl: null,                  // 配信確認ページのURL
  previewDownloadUrl: null,                // プレビュー時に回答データをDLするたのURL
  sentryInitFn: null,                      // Sentryを初期化するコールバック関数
  startTime: new Date(),                   // 開始時間 TODO: アンケート中断・再開機能を実装した場合には見直し必要
  extraPostParameters: Map(),              // post時に追加したいパラメタ名
  panelSelectFn: null,                     // パネル選択をクリックしたときに呼ばれる関数
  answerRegisteredFn: null,                // 回答を登録したときに実行するコールバック関数
  pageLoadedFn: null,                      // ページ遷移したときに呼ばれるコールバック関数
  exposeSurveyJS: false,                   // SurveyJSをwindowに紐つけるかどうか。trueの場合はSurveyJSという名前で設定する。文字列の場合は指定した文字列の名前で設定する。
  defaultCss: null,                        // デフォルトのCSSのURL
  cssOptions: List(),                      // 選択可能なCSSのURL
  userId: null,                            // 回答者のユーザID
});

export default class Options extends OptionsRecord {
  getHeaderHtml() {
    return this.get('headerHtml');
  }

  getSaveSurveyUrl() {
    return this.get('saveSurveyUrl');
  }

  getPreviewUrl() {
    const url = this.get('previewUrl');
    if (isDevelopment()) {
      const connectChar = url.indexOf('?') === -1 ? '?' : '&';
      return `${url}${connectChar}env=development`;
    }
    return this.get('previewUrl');
  }

  getShowDetailUrl() {
    const url = this.get('showDetailUrl');
    if (isDevelopment()) {
      const connectChar = url.indexOf('?') === -1 ? '?' : '&';
      return `${url}${connectChar}env=development`;
    }
    return url;
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

  getDefaultCss() {
    return this.get('defaultCss');
  }

  getCssOptions() {
    return this.get('cssOptions');
  }

  getCssOptionIdByUrls(runtimeUrls, previewUrls, detailUrls) {
    if (!this.hasCssOptions()) { return null; }
    const option = this.getCssOptions().find((o) => {
      return o.matchRuntimeUrls(runtimeUrls) && o.matchPreviewUrls(previewUrls) && o.matchDetailUrls(detailUrls);
    });
    return option ? option.getId() : null;
  }

  getCssOptionById(id) {
    if (!this.hasCssOptions()) { return null; }
    return this.getCssOptions().find(o => o.getId() === id) || null;
  }

  isUseBrowserHistory() {
    return this.get('useBrowserHistory') && isDevelopment();
  }

  isShowDetail() {
    return this.get('showDetail');
  }

  isShowOutputNo() {
    return this.get('showOutputNo');
  }

  isShowPageNo() {
    return this.get('showPageNo');
  }

  getImageManagerUrl() {
    return this.get('imageManagerUrl');
  }

  // 回答時間を計算し、秒で返す
  calcTimeForAnswer() {
    return parseInteger((new Date().getTime() - this.getStartTime().getTime()) / 1000);
  }

  isExposeSurveyJS() {
    return this.get('exposeSurveyJS');
  }

  getUserId() {
    return this.get('userId');
  }

  hasCssOptions() {
    return this.getCssOptions() != null && this.getCssOptions().size >= 1;
  }
}
