/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import EnqueteEditorApp from './editor/containers/EnqueteEditorApp';
import EnquetePreviewApp from './runtime/containers/EnquetePreviewApp';
import EnqueteRuntimeApp from './runtime/containers/EnqueteRuntimeApp';
import { configureStore } from './editor/store';
import { json2ImmutableState } from './runtime/store';
import ParsleyInit from './ParsleyInit';
import './editor/css/editor.scss';

export function Designer(el, json) {
  ParsleyInit();
  const initialState = json2ImmutableState(json);
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnqueteEditorApp />
    </Provider>,
    el,
  );
}

export function Preview(el, initialState) {
  ParsleyInit();
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnquetePreviewApp />
    </Provider>,
    el,
  );
}

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
