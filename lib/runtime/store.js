/* eslint-env browser */
import { createStore } from 'redux';
import Immutable from 'immutable';
import reducer from './reducers';
import BranchDefinition from '../runtime/models/definitions/BranchDefinition';
import ChildConditionDefinition from '../runtime/models/definitions/ChildConditionDefinition';
import ItemDefinition from '../runtime/models/definitions/questions/ItemDefinition';
import ConditionDefinition from '../runtime/models/definitions/ConditionDefinition';
import FlowDefinition from '../runtime/models/definitions/FlowDefinition';
import PageDefinition from '../runtime/models/definitions/PageDefinition';
import { findQuestionDefinitionClass } from '../runtime/models/definitions/questions/QuestionDefinitions';
import RuntimeValue from '../runtime/models/runtime/RuntimeValue';
import SurveyDefinition from '../runtime/models/definitions/SurveyDefinition';
import SurveyDesignerState from '../runtime/models/SurveyDesignerState';
import ViewSetting from '../runtime/models/view/ViewSetting';

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
        return value.map((v) => {
          const type = v.get('type');
          const Model = findQuestionDefinitionClass(type);
          if (!Model) throw new Error(`question type="${type}"に対応するクラスが見つかりません。`);
          return new Model(v);
        }).toList();
      case 'items':
        return value.map(v => new ItemDefinition(v)).toList();
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
