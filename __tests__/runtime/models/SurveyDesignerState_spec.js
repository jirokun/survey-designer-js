/* eslint-env jest */
import { json2ImmutableState } from '../../../lib/runtime/store';
import CheckboxQuestionDefinition from '../../../lib/runtime/models/definitions/questions/CheckboxQuestionDefinition';
import sample1 from './sample1.json';

describe('SurveyDesignerState', () => {
  let state;
  beforeAll(() => {
    state = json2ImmutableState(sample1);
  });

  describe('getCurrentNodeId', () => {
    it('currentNodeIdが取得できる', () => {
      expect(state.getCurrentNodeId()).toBe('F001');
    });
  });

  describe('getBranches', () => {
    it('branchesが取得できる', () => {
      const branches = state.getBranches();
      expect(branches.size).toBe(1);
      expect(branches.get(0).constructor.name).toBe('BranchDefinition');
    });
  });

  describe('getPages', () => {
    it('pagesが取得できる', () => {
      const pages = state.getPages();
      expect(pages.size).toBe(2);
      expect(pages.get(0).constructor.name).toBe('PageDefinition');
    });

    it('存在しないpageIdを指定すると例外が発生する', () => {
      expect(() => state.findPage('NONE')).toThrow();
    });
  });

  describe('getNodes', () => {
    it('nodesが取得できる', () => {
      const nodes = state.getNodes();
      expect(nodes.size).toBe(3);
      expect(nodes.get(0).constructor.name).toBe('NodeDefinition');
    });

    it('存在しないnodeIdを指定すると例外が発生する', () => {
      expect(() => state.findNode('NONE')).toThrow();
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

  describe('findNode', () => {
    it('nodeIdからnodeを取得できる', () => {
      const node = state.findNode('F002');
      expect(node).not.toBeNull();
      expect(node.getId()).toBe('F002');
    });
  });

  describe('findBranchFromNode', () => {
    it('nodeIdからbranchを取得できる', () => {
      const branch = state.findBranchFromNode('F002');
      expect(branch).not.toBeNull();
      expect(branch.getId()).toBe('B001');
    });

    it('存在しないnodeIdを指定しbranch取得を行うと例外が発生する', () => {
      expect(() => state.findBranchFromNode('NONE')).toThrow();
    });
  });

  describe('findPageFromNode', () => {
    it('nodeIdからpageを取得できる', () => {
      const page = state.findPageFromNode('F001');
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P001');
    });

    it('存在しないnodeIdを指定しpage取得を行うと例外が発生する', () => {
      expect(() => state.findPageFromNode('NONE')).toThrow('');
    });
  });

  describe('findCurrentPage', () => {
    it('現在のpageを返す', () => {
      const page = state.findCurrentPage();
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P001');
    });
  });

  describe('findCurrentNode', () => {
    it('現在のnodeを返す', () => {
      const node = state.findCurrentNode();
      expect(node).not.toBeNull();
      expect(node.getId()).toBe('F001');
    });
  });

  describe('findCurrentBranch', () => {
    it('現在のbranchを返す', () => {
      const newState = state.setCurrentNodeId('F002');
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

  describe('deleteNode', () => {
    it('nodeを削除すると対応するpageも削除される', () => {
      const newState = state.deleteNode('F001');
      expect(newState.getNodes().size).toBe(2);
      expect(newState.getPages().size).toBe(1);
    });

    it('nodeを削除すると対応するbranchも削除される', () => {
      const newState = state.deleteNode('F002');
      expect(newState.getNodes().size).toBe(2);
      expect(newState.getBranches().size).toBe(0);
    });
  });

  describe('addNode', () => {
    it('先頭にpageを挿入できる', () => {
      const newState = state.addNode(0, 'page');
      expect(newState.getNodes().size).toBe(4);
      expect(newState.getPages().size).toBe(3);
      expect(newState.getNodes().get(0).getNextNodeId()).toBe(newState.getNodes().get(1).getId());
    });

    it('先頭にbranchを挿入できる', () => {
      const newState = state.addNode(0, 'branch');
      expect(newState.getNodes().size).toBe(4);
      expect(newState.getBranches().size).toBe(2);
      expect(newState.getNodes().get(0).getNextNodeId()).toBe(newState.getNodes().get(1).getId());
    });

    it('途中にpageを挿入すると一つ前のnextNodeIdも同時に書き換わる', () => {
      const newState = state.addNode(1, 'page');
      expect(newState.getNodes().size).toBe(4);
      expect(newState.getPages().size).toBe(3);
      expect(newState.getNodes().get(0).getNextNodeId()).toBe(newState.getNodes().get(1).getId());
      expect(newState.getNodes().get(1).getNextNodeId()).toBe(newState.getNodes().get(2).getId());
    });
  });

  describe('findQuestion', () => {
    it('questionIdからquestionを取得できる', () => {
      const result = state.findQuestion('2');
      expect(result.getId()).toBe('2');
    });
  });

  describe('submitPage', () => {
    it('入力値が追加される', () => {
      const result1 = state.submitPage({ q1: 'abc' });
      expect(result1.getInputValues().get('q1')).toBe('abc');
      const result2 = result1.submitPage({ q2: 'def' });
      expect(result2.getInputValues().get('q1')).toBe('abc');
      expect(result2.getInputValues().get('q2')).toBe('def');
    });
  });

  describe('getPageNo', () => {
    it('ページ番号を取得できる', () => {
      const result = state.calcPageNo('P001');
      expect(result).toBe('1');
    });

    it('ブランチが間に入っていても正しくページ番号を取得できる', () => {
      const result = state.calcPageNo('P002');
      expect(result).toBe('2');
    });
  });

  describe('getQuestionNo', () => {
    it('page番号も含めたquestion番号を取得できる', () => {
      const result = state.calcQuestionNo('P001', '2');
      expect(result).toBe('1-2');
    });

    it('page番号を含めいないquestion番号を取得できる', () => {
      const result = state.calcQuestionNo('P001', '2', true);
      expect(result).toBe('2');
    });
  });

  describe('swapCondition', () => {
    it('指定したconditionを入れ替えることができる', () => {
      expect(state.getIn(['survey', 'branches', 0, 'conditions', 0, 'nextNodeId'])).toBe('F001');
      expect(state.getIn(['survey', 'branches', 0, 'conditions', 2, 'nextNodeId'])).toBe('F003');
      const result = state.swapCondition('B001', 0, 2);
      expect(result.getIn(['survey', 'branches', 0, 'conditions', 0, 'nextNodeId'])).toBe('F003');
      expect(result.getIn(['survey', 'branches', 0, 'conditions', 2, 'nextNodeId'])).toBe('F001');
    });
  });

  describe('findPrecedingPageNodeIds', () => {
    it('branchのnodeIdを指定し先行するページを指し示すnodeIdを一覧することができる', () => {
      const result = state.findPrecedingPageNodeIds('F002');
      expect(result.length).toBe(1);
      expect(result[0]).toBe('F001');
    });

    it('pageのnodeIdを指定し先行するページを指し示すnodeIdを一覧することができる', () => {
      const result = state.findPrecedingPageNodeIds('F003');
      expect(result.length).toBe(2);
      expect(result[0]).toBe('F001');
      expect(result[1]).toBe('F003');
    });
  });


  describe('findFollowingPageNodeIds', () => {
    it('branchのnodeIdを指定し以降のページを指し示すnodeIdを一覧することができる', () => {
      const result = state.findFollowingPageNodeIds('F002');
      expect(result.length).toBe(1);
      expect(result[0]).toBe('F003');
    });

    it('pageのnodeIdを指定し以降のページを指し示すnodeIdを一覧することができる', () => {
      const result = state.findFollowingPageNodeIds('F001');
      expect(result.length).toBe(2);
      expect(result[0]).toBe('F001');
      expect(result[1]).toBe('F003');
    });
  });

});
