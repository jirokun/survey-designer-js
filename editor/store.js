import { createStore } from 'redux'
import rootReducer from './reducers'
const nextReducer = require('./reducers');

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, window.devToolsExtension ? window.devToolsExtension() : undefined);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
