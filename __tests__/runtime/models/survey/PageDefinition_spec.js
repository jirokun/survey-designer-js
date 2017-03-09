/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import CheckboxQuestionDefinition from '../../../../lib/runtime/models/survey/questions/CheckboxQuestionDefinition';
import sample1 from '../sample1.json';

describe('PageDefinition', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
  });

  describe('removeItem', () => {
    it('指定したitemを削除でき、indexが更新されること', () => {
      const result1 = state.getSurvey().findPage('P001').removeItem('1', 'I002');
      expect(result1.getIn(['questions', 0, 'items']).size).toBe(2);
      expect(result1.getIn(['questions', 0, 'items', 0, '_id'])).toBe('I001');
      expect(result1.getIn(['questions', 0, 'items', 1, '_id'])).toBe('I003');
      expect(result1.getIn(['questions', 0, 'items', 0, 'index'])).toBe(0);
      expect(result1.getIn(['questions', 0, 'items', 1, 'index'])).toBe(1);
    });
  });

  describe('addItem', () => {
    it('指定したindexにitemを追加でき、indexが更新されること', () => {
      const result1 = state.getSurvey().findPage('P001').addItem('1', 1);
      expect(result1.getIn(['questions', 0, 'items']).size).toBe(4);
      expect(result1.getIn(['questions', 0, 'items', 0, '_id'])).toBe('I001');
      expect(result1.getIn(['questions', 0, 'items', 2, '_id'])).toBe('I002');
      expect(result1.getIn(['questions', 0, 'items', 3, '_id'])).toBe('I003');
      expect(result1.getIn(['questions', 0, 'items', 0, 'index'])).toBe(0);
      expect(result1.getIn(['questions', 0, 'items', 1, 'index'])).toBe(1);
      expect(result1.getIn(['questions', 0, 'items', 2, 'index'])).toBe(2);
      expect(result1.getIn(['questions', 0, 'items', 3, 'index'])).toBe(3);
    });
  });

  describe('swapQuestion', () => {
    it('同じページ内で0番目と1番目のquestionの入れ替えができること', () => {
      const result = state.getSurvey().findPage('P001').swapQuestion('1', '2');
      expect(result.getIn(['questions', 0, '_id'])).toBe('2');
      expect(result.getIn(['questions', 1, '_id'])).toBe('1');
    });
  });

  describe('updateItemAttribute', () => {
    it('itemの属性を更新できる', () => {
      const survey = state.getSurvey();
      const replaceUtil = survey.createReplaceUtil({});
      const result = state.getSurvey().findPage('P001').updateItemAttribute('1', 'I001', 'label', 'ABC', replaceUtil);
      expect(result.getIn(['questions', 0, 'items', 0, 'label'])).toBe('ABC');
    });
  });

  describe('swapItem', () => {
    it('指定したitemを入れ替えることができる', () => {
      const result = state.getSurvey().findPage('P001').swapItem('1', 'I001', 'I003');
      expect(result.getIn(['questions', 0, 'items', 0, '_id'])).toBe('I003');
      expect(result.getIn(['questions', 0, 'items', 1, '_id'])).toBe('I002');
      expect(result.getIn(['questions', 0, 'items', 2, '_id'])).toBe('I001');
      expect(result.getIn(['questions', 0, 'items', 0, 'index'])).toBe(0);
      expect(result.getIn(['questions', 0, 'items', 1, 'index'])).toBe(1);
      expect(result.getIn(['questions', 0, 'items', 2, 'index'])).toBe(2);
    });
  });
});
