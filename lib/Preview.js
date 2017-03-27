/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import browser from 'detect-browser';
import 'tooltipster/dist/css/tooltipster.bundle.min.css';
import EnquetePreviewApp from './runtime/containers/EnquetePreviewApp';
import { configureStore } from './runtime/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyWrapper from './ParsleyWrapper';
import * as plainUtils from './plainUtils';
import './runtime/css/runtime.scss';

/**
 * プレビューのエントリポイント
 */
export function Preview(el, json) {
  if (browser.name === 'ie' && parseInt(browser.version.substr(0, browser.version.indexOf('.')), 10) < 9) {
    render(
      <div>
        <p>
        ご利用の環境ではこのページを表示することができません。<br />
        以下のいずれかのブラウザをご利用ください。</p>
        <ul>
          <li>Google Chrome 最新版</li>
          <li>Firefox 最新版</li>
          <li>Microsoft Edge</li>
          <li>Microsoft Internet Explorer 9以上</li>
        </ul>
      </div>,
      el,
    );
    return;
  }

  // Reactを使わないコンポーネントを定義する
  plainUtils.defineNumericInput(el);

  const parsleyWrapper = new ParsleyWrapper(el);
  const initialState = SurveyDesignerState.createFromJson(json);
  const store = configureStore(initialState);
  el.innerHTML = ''; // 一度削除

  render(
    <Provider store={store}>
      <EnquetePreviewApp parsleyWrapper={parsleyWrapper} />
    </Provider>,
    el,
  );
}
