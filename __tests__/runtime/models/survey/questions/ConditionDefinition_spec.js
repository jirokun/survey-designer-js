/* eslint-env jest */
import { Map, List } from 'immutable';
import SurveyDesignerState from '../../../../../lib/runtime/models/SurveyDesignerState';
import nextNodeIdIsPreviousPageJson from './ConditionDefinition_nextNodeIdIsPreviousPage.json';

describe('ConditionDefinition', () => {
  describe('validate', () => {
    it('ConditionDefinitionよりも前のページに遷移しようとした場合エラーが返る', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: nextNodeIdIsPreviousPageJson }).getSurvey();
      const branch = survey.getIn(['branches', 0]);
      const condition = branch.getIn(['conditions', 0]);
      const result = condition.validate(survey, branch.getId());
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('分岐設定の遷移先が存在しません');
    });

    it('ConditionDefinitionよりも後のページに遷移しようとした場合成功する', () => {
      const survey = SurveyDesignerState
        .createFromJson({ survey: nextNodeIdIsPreviousPageJson })
        .getSurvey()
        .setIn(['branches', 0, 'conditions', 0, 'nextNodeId'], 'cj98d9exg00033j731183r8mj');
      const branch = survey.getIn(['branches', 0]);
      const condition = branch.getIn(['conditions', 0]);
      const result = condition.validate(survey, branch.getId());
      expect(result.size).toBe(0);
    });

    it('遷移先のページが存在しない場合エラーが返る', () => {
      const survey = SurveyDesignerState
        .createFromJson({ survey: nextNodeIdIsPreviousPageJson })
        .getSurvey()
        .setIn(['branches', 0, 'conditions', 0, 'nextNodeId'], 'dummy');
      const branch = survey.getIn(['branches', 0]);
      const condition = branch.getIn(['conditions', 0]);
      const result = condition.validate(survey, branch.getId());
      expect(result.size).toBe(1);
      expect(result.get(0).getMessage()).toBe('分岐設定の遷移先が存在しません');
    });
  });
});
