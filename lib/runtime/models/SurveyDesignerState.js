import { Map, Record, fromJS, List } from 'immutable';
import PageDefinition from './survey/PageDefinition';
import BranchDefinition from './survey/BranchDefinition';
import FinisherDefinition from './survey/FinisherDefinition';
import ConditionDefinition from './survey/ConditionDefinition';
import ChildConditionDefinition from './survey/ChildConditionDefinition';
import NodeDefinition from './survey/NodeDefinition';
import ItemDefinition from './survey/questions/internal/ItemDefinition';
import VisibilityConditionDefinition from './survey/questions/internal/VisibilityConditionDefinition';
import NumberValidationDefinition from './survey/questions/internal/NumberValidationDefinition';
import NumberValidationRuleDefinition from './survey/questions/internal/NumberValidationRuleDefinition';
import LogicalVariableDefinition from './survey/LogicalVariableDefinition';
import SurveyDefinition from './survey/SurveyDefinition';
import RuntimeValue from './runtime/RuntimeValue';
import ViewSetting from './view/ViewSetting';
import Options from './options/Options';
import CssOption from './options/CssOption';
import { findQuestionDefinitionMap } from './survey/questions/QuestionDefinitions';

import PersonalInfoItemDefinition from './survey/questions/internal/PersonalInfoItemDefinition';
import PersonalInfoItemDisplayTypeDefinition from './survey/questions/internal/PersonalInfoItemDisplayTypeDefinition';
import PersonalInfoItemFieldDefinition from './survey/questions/internal/PersonalInfoItemFieldDefinition';

export const SurveyDesignerStateRecord = Record({
  runtime: new RuntimeValue(),   // ランタイム時に使用する値
  survey: null,                  // アンケートの定義
  view: new ViewSetting(),       // エディタの設定
  options: new Options(),        // 外部から指定可能なオプション
});

/** editor, runtimeなどで動作するときにReduxが持つstateのトップレベル定義 */
export default class SurveyDesignerState extends SurveyDesignerStateRecord {
  /**
   * JSONを解析し、stateで扱える方に変換する
   *
   * forTestにtrueを渡すとテストで使用しやすいように値を返す
   */
  static createFromJson(json, opts = {}) {
    let parsedObj = fromJS(json, (key, value) => {
      switch (key) {
        case 'answers':
          return new Map(value);
        case 'view':
          return new ViewSetting(value);
        case 'runtime':
          return new RuntimeValue(value);
        case 'options':
          return new Options(value);
        case 'survey':
          return new SurveyDefinition(value);
        case 'pages':
          return value.map(v => new PageDefinition(v)).toList();
        case 'questions':
          return value.map((v) => {
            const dataType = v.get('dataType');
            const modelObj = findQuestionDefinitionMap(dataType);
            if (!modelObj) throw new Error(`question dataType="${dataType}"に対応するクラスが見つかりません。`);
            const DefinitionClass = modelObj.definitionClass;
            return new DefinitionClass(v);
          }).toList();
        case 'items':
          return value.map((v) => {
            if (v.get('dataType') === 'PersonalInfoItem') { return new PersonalInfoItemDefinition(v); }
            return new ItemDefinition(v);
          });
        case 'subItems':
          return value.map(v => new ItemDefinition(v)).toList();
        case 'visibilityCondition':
          return new VisibilityConditionDefinition(value);
        case 'operators':
          return value.toList();
        case 'operands':
          return value.toList();
        case 'branches':
          return value.map(v => new BranchDefinition(v)).toList();
        case 'finishers':
          return value.map(v => new FinisherDefinition(v)).toList();
        case 'conditions':
          return value.map(v => new ConditionDefinition(v)).toList();
        case 'childConditions':
          return value.map(v => new ChildConditionDefinition(v)).toList();
        case 'nodes':
          return value.map(v => new NodeDefinition(v)).toList();
        case 'logicalVariables':
          return value.map(v => new LogicalVariableDefinition(v)).toList();
        case 'numberValidationRuleMap': {
          let map = Map();
          value.keySeq().forEach((k) => {
            map = map.set(k, List.of(new NumberValidationRuleDefinition(value.get(k).get(0))));
          });
          return map;
        }
        case 'numberValidations':
          return value.map(v => new NumberValidationDefinition(v)).toList();
        case 'defaultCss': {
          return Map(value);
        }
        case 'cssOptions':
          return value.map((v) => CssOption.create(v.get('title'), v.get('runtimeUrls'), v.get('previewUrls'), v.get('detailUrls'))).toList();
        case 'personalItemDisplayTypeCandidates':
          return value.map(v => new PersonalInfoItemDisplayTypeDefinition(v));
        case 'personalItemFields':
          return value.map(v => new PersonalInfoItemFieldDefinition(v));
        default:
          return value;
      }
    });

    if (opts.rawRecord) {
      // testのときは部分的に取り出すことも考えて SurveyDesignerState で包まずに返す
      return parsedObj;
    }

    // surveyがあればmigrateする
    const survey = parsedObj.get('survey');
    if (survey) {
      parsedObj = parsedObj.toMap().set('survey', survey.migrate(parsedObj.get('options')));
    }

    return new SurveyDesignerState(parsedObj);
  }

  // for runtime
  getRuntime() {
    return this.get('runtime');
  }

  // for view
  getViewSetting() {
    return this.get('view');
  }

  // for definitions
  getOptions() {
    return this.get('options');
  }

  getSurvey() {
    return this.get('survey');
  }
}
