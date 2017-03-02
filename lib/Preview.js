/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnquetePreviewApp from './runtime/containers/EnquetePreviewApp';
import { configureStore } from './editor/store';
import { json2ImmutableState } from './runtime/store';
import ParsleyInit from './ParsleyInit';
import './runtime/css/runtime.scss';

/**
 * プレビューのエントリポイント
 */
export function Preview(el, json) {
  ParsleyInit();
  const initialState = json2ImmutableState(json);
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnquetePreviewApp />
    </Provider>,
    el,
  );
}
