import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import EnqueteRuntimeApp from './containers/EnqueteRuntimeApp'
import state from './state'
import configureStore from './store/configureStore'

const store = configureStore(state);

const rootElement = document.getElementById('root')
render(
  <Provider store={store}>
    <EnqueteRuntimeApp />
  </Provider>,
  rootElement
)
