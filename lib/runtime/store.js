/* eslint-env browser */
import { createStore } from 'redux';
import reducer from './reducers';

export function configureStore(initialState) {
  const store = createStore(
    reducer,
    // currentNodeIdは最初のnodeにしておく
    initialState.setIn(['runtime', 'currentNodeId'], initialState.getSurvey().getNodes().get(0).getId()),
    window.devToolsExtension ? window.devToolsExtension() : undefined,
  );

  return store;
}
