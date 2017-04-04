/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import browser from 'detect-browser';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnqueteRuntimeApp from './runtime/containers/EnqueteRuntimeApp';
import { configureStore } from './runtime/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyWrapper from './ParsleyWrapper';
import { RequireBrowserForRuntime } from './BrowserRequirements';
import './runtime/css/runtime.scss';

/** Runtimeのエントリポイント */
export function Runtime(el, json) {
  if (browser.name === 'ie' && parseInt(browser.version.substr(0, browser.version.indexOf('.')), 10) < 9) {
    render(<RequireBrowserForRuntime />, el);
    return;
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
