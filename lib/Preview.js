/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnquetePreviewApp from './runtime/containers/EnquetePreviewApp';
import { configureStore } from './editor/store';
import ParsleyInit from './ParsleyInit';
import './runtime/css/runtime.scss';

// 第二引数はinitialiStateでjsonでないことに注意
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
