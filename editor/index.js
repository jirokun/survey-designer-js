import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import EnqueteEditorApp  from './containers/EnqueteEditorApp.js'
import configureStore from './store'
import state from './state'
import '../www/css/editor.scss'

const store = configureStore(state);

const rootElement = document.getElementById('root');
const el = render(
  <Provider store={store}>
    <EnqueteEditorApp />
  </Provider>,
  rootElement
)
console.log(el);
