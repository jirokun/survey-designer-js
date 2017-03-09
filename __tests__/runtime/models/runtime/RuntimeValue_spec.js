/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import sample1 from '../sample1.json';

describe('RuntimeValue', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
  });

  describe('findCurrentPage', () => {
    it('現在のpageを返す', () => {
      const runtime = state.getRuntime();
      const page = runtime.findCurrentPage(state.getSurvey());
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P001');
    });
  });

  describe('findCurrentNode', () => {
    it('現在のnodeを返す', () => {
      const runtime = state.getRuntime();
      const node = runtime.findCurrentNode(state.getSurvey());
      expect(node).not.toBeNull();
      expect(node.getId()).toBe('F001');
    });
  });

  describe('findCurrentBranch', () => {
    it('現在のbranchを返す', () => {
      const runtime = state.getRuntime().setCurrentNodeId('F002');
      const branch = runtime.findCurrentBranch(state.getSurvey());
      expect(branch).not.toBeNull();
      expect(branch.getId()).toBe('B001');
    });
  });

  describe('submitPage', () => {
    it('入力値が追加される', () => {
      const result1 = state.getRuntime().submitPage(state.getSurvey(), { '1__value1': 'abc' });
      expect(result1.getAnswers().get('1__value1')).toBe('abc');
      const result2 = result1.submitPage(state.getSurvey(), { q2: 'def' });
      expect(result2.getAnswers().get('1__value1')).toBe('abc');
      expect(result2.getAnswers().get('q2')).toBe('def');
    });
  });
});
