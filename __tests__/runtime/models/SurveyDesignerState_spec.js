/* eslint-env jest */
import { json2ImmutableState } from '../../../lib/editor/store';
import sample1 from './sample1.json';

describe('SurveyDesignerState', () => {
  let state;
  beforeAll(() => {
    state = json2ImmutableState(sample1);
  });

  describe('getCurrentFlowId', () => {
    it('currentFlowIdが取得できる', () => {
      expect(state.getCurrentFlowId()).toBe('F001');
    });
  });

  describe('getBranchDefs', () => {
    it('branchDefsが取得できる', () => {
      const branchDefs = state.getBranchDefs();
      expect(branchDefs.size).toBe(1);
      expect(branchDefs.get(0).constructor.name).toBe('BranchDefinition');
    });
  });

  describe('getPageDefs', () => {
    it('pageDefsが取得できる', () => {
      const pageDefs = state.getPageDefs();
      expect(pageDefs.size).toBe(2);
      expect(pageDefs.get(0).constructor.name).toBe('PageDefinition');
    });

    it('存在しないpageIdを指定すると例外が発生する', () => {
      expect(() => state.findPage('NONE')).toThrow();
    });
  });

  describe('getFlowDefs', () => {
    it('flowDefsが取得できる', () => {
      const flowDefs = state.getFlowDefs();
      expect(flowDefs.size).toBe(2);
      expect(flowDefs.get(0).constructor.name).toBe('FlowDefinition');
    });

    it('存在しないflowIdを指定すると例外が発生する', () => {
      expect(() => state.findFlow('NONE')).toThrow();
    });
  });

  describe('findBranch', () => {
    it('branchIdからbranchを取得できる', () => {
      const branch = state.findBranch('B001');
      expect(branch).not.toBeNull();
      expect(branch.getId()).toBe('B001');
    });

    it('存在しないbranchIdを指定すると例外が発生する', () => {
      expect(() => state.findBranch('NONE')).toThrow();
    });
  });

  describe('findPage', () => {
    it('pageIdからpageを取得できる', () => {
      const page = state.findPage('P002');
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P002');
    });
  });

  describe('findFlow', () => {
    it('flowIdからflowを取得できる', () => {
      const flow = state.findFlow('F002');
      expect(flow).not.toBeNull();
      expect(flow.getId()).toBe('F002');
    });
  });

  describe('findBranchFromFlow', () => {
    it('flowIdからbranchを取得できる', () => {
      const branch = state.findBranchFromFlow('F002');
      expect(branch).not.toBeNull();
      expect(branch.getId()).toBe('B001');
    });

    it('存在しないflowIdを指定しbranch取得を行うと例外が発生する', () => {
      expect(() => state.findBranchFromFlow('NONE')).toThrow();
    });
  });

  describe('findPageFromFlow', () => {
    it('flowIdからpageを取得できる', () => {
      const page = state.findPageFromFlow('F001');
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P001');
    });

    it('存在しないflowIdを指定しpage取得を行うと例外が発生する', () => {
      expect(() => state.findPageFromFlow('NONE')).toThrow('');
    });
  });

  describe('findCurrentPage', () => {
    it('現在のページを返す', () => {
      const page = state.findCurrentPage();
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P001');
    });
  });
});
