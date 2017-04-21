/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
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
import makeErrorHandler from './errorUtil';
import './runtime/css/runtime.scss';
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

  // errorHandlerUrlが指定されていたらエラー発生時にメッセージpostする
  if (json.options.errorHandlerUrl) {
    window.onerror = makeErrorHandler(json.options.errorHandlerUrl);
  }

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
