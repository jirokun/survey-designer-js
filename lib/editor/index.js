/* eslint-env browser,jquery */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import EnqueteEditorApp from './containers/EnqueteEditorApp';
import { configureStore } from './store';
import SurveyDesignerState from '../runtime/models/SurveyDesignerState';
import ParsleyWrapper from '../ParsleyWrapper';
import './css/editor.scss';

$.getJSON('sample.json').done((json) => {
  const initialState = SurveyDesignerState.createFromJson(json);
  const store = configureStore(initialState);
  const rootElement = document.getElementById('root');
  new ParsleyWrapper(rootElement);

  render(
    <Provider store={store}>
      <EnqueteEditorApp />
    </Provider>,
    rootElement,
  );
});
