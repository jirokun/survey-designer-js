/* eslint-env jest */
import RadioQuestionDefinition from '../../../../../lib/runtime/models/survey/questions/RadioQuestionDefinition';

describe('RadioQuestionDefinition', () => {
  describe('getOutputDevId', () => {
    it('通常のdev-idを返す', () => {
      const question = new RadioQuestionDefinition({});
      expect(question.getOutputDevId('dev-id1', false)).toBe('dev-id1');
    });

    it('追加記入用のdev-idを返す', () => {
      const question = new RadioQuestionDefinition();
      expect(question.getOutputDevId('dev-id1', true)).toBe('dev-id1_text');
    });
  });
});
