/* eslint-env browser,jquery */
import 'babel-polyfill';
import 'classlist-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import EnqueteEditorApp from './editor/containers/EnqueteEditorApp';
import { configureStore } from './editor/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyWrapper from './ParsleyWrapper';
import { RequiredBrowserNoticeForEditor } from './browserRequirements';
import { isIELowerEquals } from './browserUtils';
import './editor/tinymce_plugins/reference';
import './editor/css/editor.scss';

/** 編集画面のエントリポイント */
export function Editor(el, json) {
  if (isIELowerEquals(10)) {
    render(<RequiredBrowserNoticeForEditor />, el);
    return;
  }
  new ParsleyWrapper(el);
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
