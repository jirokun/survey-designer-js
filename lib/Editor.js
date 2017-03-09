/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import EnqueteEditorApp from './editor/containers/EnqueteEditorApp';
import { configureStore } from './editor/store';
import SurveyDesignerState from './runtime/models/SurveyDesignerState';
import ParsleyInit from './ParsleyInit';
import './editor/css/editor.scss';

/** Editorのエントリポイント */
export function Editor(el, json) {
  ParsleyInit();
  let initialState = SurveyDesignerState.createFromJson(json);
  if (initialState.getNodes().size === 0) {
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
