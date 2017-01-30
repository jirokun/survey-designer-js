import { createStore } from 'redux';
import Immutable from 'immutable';
import reducer from './reducers';
import BranchDefinition from '../runtime/models/BranchDefinition';
import ChildConditionDefinition from '../runtime/models/ChildConditionDefinition';
import ChoiceDefinition from '../runtime/models/ChoiceDefinition';
import ConditionDefinition from '../runtime/models/ConditionDefinition';
import FlowDefinition from '../runtime/models/FlowDefinition';
import PageDefinition from '../runtime/models/PageDefinition';
import QuestionDefinition from '../runtime/models/QuestionDefinition';
import RuntimeValue from '../runtime/models/RuntimeValue';
import SurveyDefinition from '../runtime/models/SurveyDefinition';
import SurveyDesignerState from '../runtime/models/SurveyDesignerState';
import ViewSetting from '../runtime/models/ViewSetting';

const nextReducer = require('./reducers');

export function configureStore(initialState) {
  const store = createStore(reducer, initialState, window.devToolsExtension ? window.devToolsExtension() : undefined);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export function json2ImmutableState(json) {
  const surveyDesignerStateWrapper = {
    wrapper: json,
  };
  return Immutable.fromJS(surveyDesignerStateWrapper, (key, value) => {
    switch (key) {
      case 'wrapper':
        return new SurveyDesignerState(value);
      case 'viewSettings':
        return new ViewSetting(value);
      case 'runtimeValues':
        return new RuntimeValue(value);
      case 'defs':
        return new SurveyDefinition(value);
      case 'pageDefs':
        return value.map(v => new PageDefinition(v)).toList();
      case 'questions':
        return value.map(v => new QuestionDefinition(v)).toList();
      case 'choices':
        return value.map(v => new ChoiceDefinition(v)).toList();
      case 'branchDefs':
        return value.map(v => new BranchDefinition(v)).toList();
      case 'conditions':
        return value.map(v => new ConditionDefinition(v)).toList();
      case 'childConditions':
        return value.map(v => new ChildConditionDefinition(v)).toList();
      case 'flowDefs':
        return value.map(v => new FlowDefinition(v)).toList();
      default:
        return value;
    }
  }).get('wrapper');
}
