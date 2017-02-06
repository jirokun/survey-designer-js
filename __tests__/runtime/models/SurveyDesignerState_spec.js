/* eslint-env jest */
import { json2ImmutableState } from '../../../lib/runtime/store';
import CheckboxQuestionDefinition from '../../../lib/runtime/models/definitions/questions/CheckboxQuestionDefinition';
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
      expect(flowDefs.size).toBe(3);
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
    it('現在のpageを返す', () => {
      const page = state.findCurrentPage();
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P001');
    });
  });

  describe('findCurrentFlow', () => {
    it('現在のflowを返す', () => {
      const flow = state.findCurrentFlow();
      expect(flow).not.toBeNull();
      expect(flow.getId()).toBe('F001');
    });
  });

  describe('findCurrentBranch', () => {
    it('現在のbranchを返す', () => {
      const newState = state.setCurrentFlowId('F002');
      const branch = newState.findCurrentBranch();
      expect(branch).not.toBeNull();
      expect(branch.getId()).toBe('B001');
    });
  });

  describe('updateQuestion', () => {
    it('questionを更新できる', () => {
      const newQuestion = CheckboxQuestionDefinition.create();
      const newState = state.updateQuestion('P001', '1', newQuestion);
      expect(newState.findPage('P001').getIn(['questions', 0]).getId()).toBe(newQuestion.getId());
    });
  });

  describe('deleteFlow', () => {
    it('flowを削除すると対応するpageも削除される', () => {
      const newState = state.deleteFlow('F001');
      expect(newState.getFlowDefs().size).toBe(2);
      expect(newState.getPageDefs().size).toBe(1);
    });

    it('flowを削除すると対応するbranchも削除される', () => {
      const newState = state.deleteFlow('F002');
      expect(newState.getFlowDefs().size).toBe(2);
      expect(newState.getBranchDefs().size).toBe(0);
    });
  });

  describe('addFlow', () => {
    it('先頭にpageを挿入できる', () => {
      const newState = state.addFlow(0, 'page');
      expect(newState.getFlowDefs().size).toBe(4);
      expect(newState.getPageDefs().size).toBe(3);
      expect(newState.getFlowDefs().get(0).getNextFlowId()).toBe(newState.getFlowDefs().get(1).getId());
    });

    it('先頭にbranchを挿入できる', () => {
      const newState = state.addFlow(0, 'branch');
      expect(newState.getFlowDefs().size).toBe(4);
      expect(newState.getBranchDefs().size).toBe(2);
      expect(newState.getFlowDefs().get(0).getNextFlowId()).toBe(newState.getFlowDefs().get(1).getId());
    });

    it('途中にpageを挿入すると一つ前のnextFlowIdも同時に書き換わる', () => {
      const newState = state.addFlow(1, 'page');
      expect(newState.getFlowDefs().size).toBe(4);
      expect(newState.getPageDefs().size).toBe(3);
      expect(newState.getFlowDefs().get(0).getNextFlowId()).toBe(newState.getFlowDefs().get(1).getId());
      expect(newState.getFlowDefs().get(1).getNextFlowId()).toBe(newState.getFlowDefs().get(2).getId());
    });
  });

  describe('findQuestion', () => {
    it('questionIdからquestionを取得できる', () => {
      const result = state.findQuestion('2');
      expect(result.getId()).toBe('2');
    });
  });
});
