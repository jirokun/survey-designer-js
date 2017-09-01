/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import Raven from 'raven-js';
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

/** Runtimeのエントリポイント */
export function Runtime(el, json) {
  if (isIELowerEquals(8)) {
    render(<RequiredBrowserNoticeForRuntime />, el);
    return;
  }

  if (json.options.sentryInitFn) {
    json.options.sentryInitFn(Raven);
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
