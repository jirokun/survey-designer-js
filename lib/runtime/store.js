/* eslint-env browser */
import { createStore } from 'redux';
import reducer from './reducers';

export function configureStore(initialState) {
  const store = createStore(
    reducer,
    // currentNodeIdは最初のnodeにしておく
    initialState.setIn(['runtime', 'currentNodeId'], initialState.getNodes().get(0).getId()),
  );

  return store;
}
