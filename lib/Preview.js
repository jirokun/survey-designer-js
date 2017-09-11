/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import Raven from 'raven-js';
import React from 'react';
import $ from 'jquery';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnquetePreviewApp from './preview/containers/EnquetePreviewApp';
import { configureStore } from './runtime/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyWrapper from './ParsleyWrapper';
import { RequiredBrowserNoticeForRuntime } from './browserRequirements';
import { isIELowerEquals } from './browserUtils';
// /static/css/preview.css を生成。別途CSSの読み込みが必要です
import './preview/css/preview.scss';

/** プレビュー画面のエントリポイント */
export function Preview(el, json) {
  if (isIELowerEquals(8)) {
    render(<RequiredBrowserNoticeForRuntime />, el);
    return;
  }

  if (json.options.sentryInitFn) {
    json.options.sentryInitFn(Raven);
  }
	
  // Preview画面のコンソールでjQueryを使えるようにする
  window.$ = $;
  window.jQuery = $;

  // プレビューのデフォルトのオプション
  const defaultOptions = {
    showPageNo: true,
    exposeSurveyJS: true,
  };
  json.options = Object.assign(defaultOptions, json.options);

  const parsleyWrapper = new ParsleyWrapper(el);
  const initialState = SurveyDesignerState.createFromJson(json);
  const store = configureStore(initialState);
  el.innerHTML = ''; // 一度削除

  render(
    <Provider store={store}>
      <EnquetePreviewApp parsleyWrapper={parsleyWrapper} />
    </Provider>,
    el,
  );
}
