/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import EnqueteEditorApp from './containers/EnqueteEditorApp';
import { configureStore } from './store';
import SurveyDesignerState from '../runtime/models/SurveyDesignerState';
import ParsleyInit from '../ParsleyInit';
import './css/editor.scss';

$.getJSON('sample.json').done((json) => {
  ParsleyInit();
  const initialState = SurveyDesignerState.createFromJson(json);
  const store = configureStore(initialState);
  const rootElement = document.getElementById('root');

  render(
    <Provider store={store}>
      <EnqueteEditorApp />
    </Provider>,
    rootElement,
  );
});
