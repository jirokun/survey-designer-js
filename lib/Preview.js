/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnquetePreviewApp from './runtime/containers/EnquetePreviewApp';
import { configureStore } from './runtime/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyInit from './ParsleyInit';
import './runtime/css/runtime.scss';

/**
 * プレビューのエントリポイント
 */
export function Preview(el, json) {
  ParsleyInit();
  const initialState = SurveyDesignerState.createFromJson(json);
  const store = configureStore(initialState);
  el.innerHTML = ''; // 一度削除

  render(
    <Provider store={store}>
      <EnquetePreviewApp />
    </Provider>,
    el,
  );
}
