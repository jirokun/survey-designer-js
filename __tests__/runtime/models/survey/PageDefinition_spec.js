/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
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

  describe('bulkAddItem', () => {
    it('一括でitemが追加されindexも正しい値が設定されていること', () => {
      const result1 = state.getSurvey().findPage('P001').bulkAddItems('1', 'a\nb');
      expect(result1.getIn(['questions', 0, 'items']).size).toBe(5);
      expect(result1.getIn(['questions', 0, 'items', 3, 'label'])).toBe('a');
      expect(result1.getIn(['questions', 0, 'items', 3, 'index'])).toBe(3);
      expect(result1.getIn(['questions', 0, 'items', 4, 'label'])).toBe('b');
      expect(result1.getIn(['questions', 0, 'items', 4, 'index'])).toBe(4);
    });

    it('空行は追加されないこと', () => {
      const result1 = state.getSurvey().findPage('P001').bulkAddItems('1', 'a\n\nb');
      expect(result1.getIn(['questions', 0, 'items']).size).toBe(5);
      expect(result1.getIn(['questions', 0, 'items', 3, 'label'])).toBe('a');
      expect(result1.getIn(['questions', 0, 'items', 4, 'label'])).toBe('b');
    });

    it('HTMLタグは削除されてplainLabelに設定されること', () => {
      const result1 = state.getSurvey().findPage('P001').bulkAddItems('1', '<span>a</span>\n<span>b</span>');
      expect(result1.getIn(['questions', 0, 'items']).size).toBe(5);
      expect(result1.getIn(['questions', 0, 'items', 3, 'label'])).toBe('<span>a</span>');
      expect(result1.getIn(['questions', 0, 'items', 3, 'plainLabel'])).toBe('a');
      expect(result1.getIn(['questions', 0, 'items', 4, 'label'])).toBe('<span>b</span>');
      expect(result1.getIn(['questions', 0, 'items', 4, 'plainLabel'])).toBe('b');
    });

    it('文字列はtrimされること', () => {
      const result1 = state.getSurvey().findPage('P001').bulkAddItems('1', ` a
b 
 c 
\td\t
 <span> e </span> 
`);
      expect(result1.getIn(['questions', 0, 'items']).size).toBe(8);
      expect(result1.getIn(['questions', 0, 'items', 3, 'label'])).toBe('a');
      expect(result1.getIn(['questions', 0, 'items', 3, 'plainLabel'])).toBe('a');
      expect(result1.getIn(['questions', 0, 'items', 4, 'label'])).toBe('b');
      expect(result1.getIn(['questions', 0, 'items', 4, 'plainLabel'])).toBe('b');
      expect(result1.getIn(['questions', 0, 'items', 5, 'label'])).toBe('c');
      expect(result1.getIn(['questions', 0, 'items', 5, 'plainLabel'])).toBe('c');
      expect(result1.getIn(['questions', 0, 'items', 6, 'label'])).toBe('d');
      expect(result1.getIn(['questions', 0, 'items', 6, 'plainLabel'])).toBe('d');
      expect(result1.getIn(['questions', 0, 'items', 7, 'label'])).toBe('<span> e </span>');
      expect(result1.getIn(['questions', 0, 'items', 7, 'plainLabel'])).toBe('e');
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
      const replacer = survey.refreshReplacer();
      const result = state.getSurvey().findPage('P001').updateItemAttribute('1', 'I001', 'label', 'ABC', replacer);
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

  describe('validateLogicalVariable', () => {
    it('オペレータが選択されていない箇所があるときエラーが返る', () => {
      const survey = state.getSurvey().setIn(['pages', 0, 'logicalVariables', 0, 'operators', 0], '');
      survey.refreshReplacer();
      const result = survey.findPage('P001').validate(survey);
      expect(result.size).toBe(1);
      expect(result.get(0)).toBe('1-L-000で選択されていない演算子があります');
    });
    it('参照する回答が存在しないときエラーが返る', () => {
      const survey = state.getSurvey().setIn(['pages', 0, 'logicalVariables', 0, 'operands', 0], '');
      survey.refreshReplacer();
      const result = survey.findPage('P001').validate(survey);
      expect(result.size).toBe(1);
      expect(result.get(0)).toBe('1-L-000で選択されていない設問があります');
    });
  });

  describe('validateQuestion', () => {
    it('再掲で参照している値が存在していない場合にエラーが返る', () => {
      const survey = state.getSurvey().setIn(['pages', 0, 'questions', 0, 'title'], '{{1.answer}}');
      survey.refreshReplacer();
      const result = survey.findPage('P001').validate(survey);
      expect(result.size).toBe(1);
      expect(result.get(0)).toBe('設問 1-1 タイトルで存在しない参照があります');
    });
  });
});
