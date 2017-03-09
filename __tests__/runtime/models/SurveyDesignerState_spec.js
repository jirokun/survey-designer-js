/* eslint-env jest */
import SurveyDesignerState from '../../../lib/runtime/models/SurveyDesignerState';
import CheckboxQuestionDefinition from '../../../lib/runtime/models/survey/questions/CheckboxQuestionDefinition';
import sample1 from './sample1.json';

describe('SurveyDesignerState', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
  });

  describe('getCurrentNodeId', () => {
    it('currentNodeIdが取得できる', () => {
      expect(state.getCurrentNodeId()).toBe('F001');
    });
  });


});
