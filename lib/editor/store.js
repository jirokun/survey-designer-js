/* eslint-env browser */
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import saveAsync from './middlewares/saveAsync';

const nextReducer = require('./reducers');

export function configureStore(initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducer,
    initialState.setIn(['runtime', 'currentNodeId'], initialState.getNodes().get(0).getId()),
    composeEnhancers(
      applyMiddleware(saveAsync),
    ),
  );
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
