/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnqueteRuntimeApp from './runtime/containers/EnqueteRuntimeApp';
import { configureStore } from './editor/store';
import { json2ImmutableState } from './runtime/store';
import ParsleyInit from './ParsleyInit';
import './runtime/css/runtime.scss';

export function Runtime(el, json) {
  ParsleyInit();
  const initialState = json2ImmutableState(json);
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnqueteRuntimeApp />
    </Provider>,
    el,
  );
}
