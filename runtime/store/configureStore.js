import { createStore } from 'redux'
import rootReducer from '../reducers'

var defaultState = {
  defs: {
    choiceDefs: [],
    itemDefs: [],
    questionDefs: [],
    pageDefs: [],
    conditionDefs: [],
    flowDefs: []
  },
  values: {
    flowStack: [],
    inputValues: {}
  }
};
export default function configureStore(initialState = defaultState) {
  const store = createStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
