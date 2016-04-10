import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import EnqueteRuntimeApp from './containers/EnqueteRuntimeApp'
import configureStore from './store/configureStore'

const store = configureStore();

const rootElement = document.getElementById('root')
render(
  <Provider store={store}>
    <EnqueteRuntimeApp />
  </Provider>,
  rootElement
)
