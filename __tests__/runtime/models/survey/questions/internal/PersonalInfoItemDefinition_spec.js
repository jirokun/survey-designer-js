/* eslint-env jest */
import PersonalInfoQuestionDefinition from '../../../../../../lib/runtime/models/survey/questions/PersonalInfoQuestionDefinition';
import * as FIELDS from '../../../../../../lib/constants/personalInfoFields';

describe('PersonalInfoItemDefinition', () => {
  describe('getDisplayTypeCandidates', () => {
    it('candidates を返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();

      const item = pq.getItems().get(0);
      const candidates = item.getDisplayTypeCandidates();

      expect(candidates.size).toBe(3);
      expect(candidates.get(0).getId()).toBe('none');
      expect(candidates.get(1).getId()).toBe('1input');
      expect(candidates.get(2).getId()).toBe('2input');
    });
  });

  describe('getDisplayTypeCandidates', () => {
    it('fields を返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();

      const item = pq.getItems().find(i => i.getRowType() === 'InterviewRow');
      const fields = item.getFields();

      expect(fields.size).toBe(3);
      expect(fields.get(0).getId()).toBe(FIELDS.interviewContactMobileTel);
      expect(fields.get(1).getId()).toBe(FIELDS.interviewContactHomeTel);
      expect(fields.get(2).getId()).toBe(FIELDS.interviewContactWorkTel);
    });
  });
});
