/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import sample1 from '../sample1.json';

describe('NodeDefinition', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
  });

  describe('addChildCondition', () => {
    it('childConditionを追加できる', () => {
      const result = state.getSurvey().findBranch('B001').addChildCondition('C002', 1);
      expect(result.getIn(['conditions', 1, 'childConditions']).size).toBe(2);
      expect(result.getIn(['conditions', 1, 'childConditions', 1, 'outputId'])).toBe('');
    });
  });

  describe('removeChildCondition', () => {
    it('指定したchildConditionが削除できること', () => {
      const branch = state.getSurvey().findBranch('B001');
      const result = branch.addChildCondition('C002', 1);
      const childConditionId = result.getIn(['conditions', 1, 'childConditions', 1, '_id']);
      const result2 = result.removeChildCondition('C002', childConditionId);
      expect(result2.getIn(['conditions', 1, 'childConditions']).size).toBe(1);
      expect(result2.getIn(['conditions', 1, 'childConditions', 0, '_id'])).toBe('CC002');
    });
  });

  describe('findSource', () => {
    it('conditionで指定された遷移元を取得できる', () => {
      expect(true).toBe(false);
    });
  });
});
