import { EventEmitter } from 'events';
import Promise from 'es6-promise';

const EVENT_NAMES = {
  EVENT_PAGE_LOAD: 'pageLoad',
  EVENT_PAGE_UNLOAD: 'pageUnload',
  EVENT_VALIDATE: 'validate',
};

/**
 * 開発者に公開するオブジェクト
 *
 * Pageの操作に関連するイベントが発火される
 * イベントは3種類
 * - pageLoad
 *   使用方法
 *     function func(survey, page, answers) {
 *       // 何かの処理
 *     };
 *     pageManager.on('pageLoad', func);
 *
 * - pageUnload
 *   使用方法
 *     function func(survey, page) {
 *       // 何かの処理
 *     };
 *     pageManager.on('pageUnLoad', func);
 *
 * - validate
 *   使用方法
 *     function func(resolve, survey, page, answers) {
 *       const result = ['失敗しました']; // バリデーション結果を配列に格納
 *       resolve(result);               // 必ずresolveにバリデーション結果を渡して実行すること
 *                                      // 配列が空、またはundefinedの場合、validationが成功したとみなす
 *     };
 *     pageManager.on('pageLoad', func);
 */
export default class PageManager extends EventEmitter {
  constructor() {
    super();
    this.validationTimeout = 3000;
  }

  static makePromise(event, timeout, timeoutMessage, listener, ...args) {
    const promise = new Promise((resolve, reject) => {
      listener(resolve, ...args);
      setTimeout(() => {
        reject(timeoutMessage);
      }, timeout);
    });
    return promise;
  }

  /** listenerの実行結果をpromiseで返す */
  emitWithResult(event, timeout, timeoutMessage, ...args) {
    const asyncFuncList = this.listeners(event).map(listener => PageManager.makePromise(event, timeout, timeoutMessage, listener, ...args));
    return Promise.all(asyncFuncList);
  }

  /** 初期化してすべてのイベントリスナを削除する */
  init() {
    for (const prop in EVENT_NAMES) {
      if (!Object.prototype.hasOwnProperty.call(EVENT_NAMES, prop)) continue;
      this.removeAllListeners(EVENT_NAMES[prop]);
    }
  }

  /** pageLoadイベントを発火する */
  firePageLoad(...args) {
    return this.emit(EVENT_NAMES.EVENT_PAGE_LOAD, ...args);
  }

  /** beforeNextPageイベントを発火する */
  firePageUnload(...args) {
    this.emit(EVENT_NAMES.EVENT_PAGE_UNLOAD, ...args);
  }

  /** validateイベントを発火する */
  fireValidate(...args) {
    return this.emitWithResult(EVENT_NAMES.EVENT_VALIDATE, this.validationTimeout, 'バリデーション処理がタイムアウトしました', ...args);
  }

  /** validationエラーや、スクリプトエラーがあったときのポップアップ処理 */
  showMessage(message) {
    alert(message);
  }
}
