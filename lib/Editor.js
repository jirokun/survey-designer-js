/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import EnqueteEditorApp from './editor/containers/EnqueteEditorApp';
import { configureStore } from './editor/store';
import { json2ImmutableState, generateInitialData } from './runtime/store';
import ParsleyInit from './ParsleyInit';
import './editor/css/editor.scss';

/** Editorのエントリポイント */
export function Editor(el, json) {
  ParsleyInit();
  // surveyにnodesがない場合には新規作成する
  const initialState = json.survey.nodes ? json2ImmutableState(json) : generateInitialData();
  const store = configureStore(initialState);

  render(
    <Provider store={store}>
      <EnqueteEditorApp />
    </Provider>,
    el,
  );
}
