import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import EnqueteEditorApp from './containers/EnqueteEditorApp.js';
import { configureStore, json2ImmutableState } from './store';
import state from './state';
import './css/editor.scss';

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
