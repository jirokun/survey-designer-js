import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import EnqueteEditorApp  from './containers/EnqueteEditorApp.js'

const rootElement = document.getElementById('root')
render(
  <EnqueteEditorApp/>,
  rootElement
)
