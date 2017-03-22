/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import browser from 'detect-browser';
import EnqueteEditorApp from './editor/containers/EnqueteEditorApp';
import { configureStore } from './editor/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyInit from './ParsleyInit';
import './editor/css/editor.scss';

/** Editorのエントリポイント */
export function Editor(el, json) {
  if (browser.name === 'ie' && parseInt(browser.version.substr(0, browser.version.indexOf('.')), 10) < 11) {
    render(
      <div>
        <p>
        ご利用の環境ではこのページを表示することができません。<br />
        以下のいずれかのブラウザをご利用ください。</p>
        <ul>
          <li>Google Chrome 最新版</li>
          <li>Firefox 最新版</li>
          <li>Microsoft Edge</li>
          <li>Microsoft Internet Explorer 11</li>
        </ul>
      </div>,
      el,
    );
    return;
  }
  ParsleyInit();
  let initialState = SurveyDesignerState.createFromJson(json);
  if (initialState.getSurvey().getNodes().size === 0) {
    // nodesがない場合には初期データを追加する
    initialState = initialState.update('survey', survey => survey.addNode(0, 'page').addNode(1, 'finisher'));
  }
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnqueteEditorApp />
    </Provider>,
    el,
  );
}
