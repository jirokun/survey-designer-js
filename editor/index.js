import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import EnqueteEditorApp  from './containers/EnqueteEditorApp.js'
import configureStore from './store'
import state from './state'
import '../www/css/editor.scss'
import MergedReducers from '../rootReducers'

console.log(MergedReducers);
const store = configureStore(state);

const rootElement = document.getElementById('root');
render(
  <Provider store={store}>
    <EnqueteEditorApp />
  </Provider>,
  rootElement
)
