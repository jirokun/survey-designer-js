/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import Raven from 'raven-js';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnqueteDetailApp from './preview/containers/EnqueteDetailApp';
import { configureStore } from './runtime/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyWrapper from './ParsleyWrapper';
import { RequiredBrowserNoticeForRuntime } from './browserRequirements';
import { isIELowerEquals } from './browserUtils';
// /static/css/detail.css を生成。別途CSSの読み込みが必要です
import './preview/css/detail.scss';

/** 初期stateを取得する */
export function getInitialState(json) {
  return SurveyDesignerState.createFromJson(json);
}

/** 1ページにすべてのページ、分岐、終了ページを詳細表示するページのエントリポイント */
export function Detail(el, json) {
  if (isIELowerEquals(8)) {
    render(<RequiredBrowserNoticeForRuntime />, el);
    return null;
  }

  if (json.options.sentryInitFn) {
    json.options.sentryInitFn(Raven);
  }

  // 詳細プレビューのデフォルトのオプション
  const defaultOptions = {
    showPageNo: true,
    visibilityConditionDisabled: true,
    disableTransformQuestion: true,
  };
  json.options = Object.assign(defaultOptions, json.options);

  const parsleyWrapper = new ParsleyWrapper(el);
  const initialState = getInitialState(json);
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnqueteDetailApp parsleyWrapper={parsleyWrapper} />
    </Provider>,
    el,
  );
}
