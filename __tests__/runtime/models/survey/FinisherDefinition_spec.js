/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import sample1 from '../sample1.json';

describe('FinisherDefinition', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
  });

  describe('validate', () => {
    it('再掲で参照している値が存在していない場合にエラーメッセージが返る', () => {
      const survey = state.getSurvey().setIn(['finishers', 0, 'html'], '{{a.answer}}');
      survey.refreshReplacer();
      const result = survey.getFinishers().get(0).validate(survey);
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('存在しない参照があります');
    });
  });
});
