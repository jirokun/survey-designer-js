/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import EnqueteEditorApp from './containers/EnqueteEditorApp';
import { configureStore } from './store';
import { json2ImmutableState } from '../runtime/store';
import ParsleyInit from '../ParsleyInit';
import './css/editor.scss';

ParsleyInit();
$.getJSON('sample.json').done((json) => {
  const initialState = json2ImmutableState(json);
  const store = configureStore(initialState);

  const rootElement = document.getElementById('root');
  render(
    <Provider store={store}>
      <EnqueteEditorApp />
    </Provider>,
    rootElement,
  );
});
