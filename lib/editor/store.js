/* eslint-env browser */
import { createStore } from 'redux';
import reducer from './reducers';

const nextReducer = require('./reducers');

export function configureStore(initialState) {
  const store = createStore(
    reducer,
    initialState.setIn(['runtime', 'currentNodeId'], initialState.getNodes().get(0).getId()),
    window.devToolsExtension ? window.devToolsExtension() : undefined,
  );
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
