/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnqueteRuntimeApp from './runtime/containers/EnqueteRuntimeApp';
import { configureStore } from './runtime/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyWrapper from './ParsleyWrapper';
import { RequiredBrowserNoticeForRuntime } from './browserRequirements';
import { isIELowerEquals } from './browserUtils';
import makeErrorHandler from './errorUtil';
import './runtime/css/runtime.scss';

/** Runtimeのエントリポイント */
export function Runtime(el, json) {
  if (isIELowerEquals(8)) {
    render(<RequiredBrowserNoticeForRuntime />, el);
    return;
  }

  // errorHandlerUrlが指定されていたらエラー発生時にメッセージpostする
  if (json.options.errorHandlerUrl) {
    window.onerror = makeErrorHandler(json.options.errorHandlerUrl);
  }

  new ParsleyWrapper(el);
  const initialState = SurveyDesignerState.createFromJson(json);
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnqueteRuntimeApp />
    </Provider>,
    el,
  );
}
