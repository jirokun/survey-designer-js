/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import sample1 from '../sample1.json';

describe('PageDefinition', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
  });

  describe('getBranches', () => {
    it('branchesが取得できる', () => {
      const branches = state.getSurvey().getBranches();
      expect(branches.size).toBe(1);
      expect(branches.get(0).constructor.name).toBe('BranchDefinition');
    });
  });

  describe('getPages', () => {
    it('pagesが取得できる', () => {
      const pages = state.getSurvey().getPages();
      expect(pages.size).toBe(2);
      expect(pages.get(0).constructor.name).toBe('PageDefinition');
    });

    it('存在しないpageIdを指定すると例外が発生する', () => {
      expect(() => state.findPage('NONE')).toThrow();
    });
  });

  describe('getNodes', () => {
    it('nodesが取得できる', () => {
      const nodes = state.getSurvey().getNodes();
      expect(nodes.size).toBe(4);
      expect(nodes.get(0).constructor.name).toBe('NodeDefinition');
    });

    it('存在しないnodeIdを指定すると例外が発生する', () => {
      expect(state.getSurvey().findNode('NONE')).toBeNull();
    });
  });

  describe('findBranch', () => {
    it('branchIdからbranchを取得できる', () => {
      const branch = state.getSurvey().findBranch('B001');
      expect(branch).not.toBeNull();
      expect(branch.getId()).toBe('B001');
    });

    it('存在しないbranchIdを指定すると例外が発生する', () => {
      expect(() => state.getSurvey().findBranch('NONE')).toThrow();
    });
  });

  describe('findPage', () => {
    it('pageIdからpageを取得できる', () => {
      const page = state.getSurvey().findPage('P002');
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P002');
    });
  });

  describe('findNode', () => {
    it('nodeIdからnodeを取得できる', () => {
      const node = state.getSurvey().findNode('F002');
      expect(node).not.toBeNull();
      expect(node.getId()).toBe('F002');
    });
  });

  describe('findBranchFromNode', () => {
    it('nodeIdからbranchを取得できる', () => {
      const branch = state.getSurvey().findBranchFromNode('F002');
      expect(branch).not.toBeNull();
      expect(branch.getId()).toBe('B001');
    });

    it('存在しないnodeIdを指定しbranch取得を行うと例外が発生する', () => {
      expect(state.getSurvey().findBranchFromNode('NONE')).toBeNull();
    });
  });

  describe('findPageFromNode', () => {
    it('nodeIdからpageを取得できる', () => {
      const page = state.getSurvey().findPageFromNode('F001');
      expect(page).not.toBeNull();
      expect(page.getId()).toBe('P001');
    });

    it('存在しないnodeIdを指定しpage取得を行うと例外が発生する', () => {
      expect(state.getSurvey().findPageFromNode('NONE')).toBeNull();
    });
  });

  describe('swapNode', () => {
    it('0番目と1番目のnodeの入れ替えができること', () => {
      const result = state.getSurvey().swapNode('F001', 'F002');
      expect(result.getIn(['nodes', 0, '_id'])).toBe('F002');
      expect(result.getIn(['nodes', 0, 'nextNodeId'])).toBe('F001');
      expect(result.getIn(['nodes', 1, '_id'])).toBe('F001');
      expect(result.getIn(['nodes', 1, 'nextNodeId'])).toBe('F003');
    });

    it('1番目と2番目のnodeの入れ替えができること', () => {
      const result = state.getSurvey().swapNode('F002', 'F003');
      expect(result.getIn(['nodes', 0, '_id'])).toBe('F001');
      expect(result.getIn(['nodes', 0, 'nextNodeId'])).toBe('F003');
      expect(result.getIn(['nodes', 1, '_id'])).toBe('F003');
      expect(result.getIn(['nodes', 1, 'nextNodeId'])).toBe('F002');
      expect(result.getIn(['nodes', 2, '_id'])).toBe('F002');
      expect(result.getIn(['nodes', 2, 'nextNodeId'])).toBe('F004');
    });

    it('2番目と3番目(最後)のnodeの入れ替えができること', () => {
      const result = state.getSurvey().swapNode('F003', 'F004');
      expect(result.getIn(['nodes', 1, '_id'])).toBe('F002');
      expect(result.getIn(['nodes', 1, 'nextNodeId'])).toBe('F004');
      expect(result.getIn(['nodes', 2, '_id'])).toBe('F004');
      expect(result.getIn(['nodes', 2, 'nextNodeId'])).toBe('F003');
      expect(result.getIn(['nodes', 3, '_id'])).toBe('F003');
      expect(result.getIn(['nodes', 3, 'nextNodeId'])).toBe(null);
    });

    it('連続しないnodeの入れ替え(1番目と3番目)ができること', () => {
      const result = state.getSurvey().swapNode('F002', 'F004');
      expect(result.getIn(['nodes', 0, '_id'])).toBe('F001');
      expect(result.getIn(['nodes', 0, 'nextNodeId'])).toBe('F004');
      expect(result.getIn(['nodes', 1, '_id'])).toBe('F004');
      expect(result.getIn(['nodes', 1, 'nextNodeId'])).toBe('F003');
      expect(result.getIn(['nodes', 2, '_id'])).toBe('F003');
      expect(result.getIn(['nodes', 2, 'nextNodeId'])).toBe('F002');
      expect(result.getIn(['nodes', 3, '_id'])).toBe('F002');
      expect(result.getIn(['nodes', 3, 'nextNodeId'])).toBe(null);
    });

    it('pagesの順番も入れ替わること', () => {
      const result = state.getSurvey().swapNode('F001', 'F003');
      expect(result.getIn(['pages', 0, '_id'])).toBe('P002');
      expect(result.getIn(['pages', 1, '_id'])).toBe('P001');
    });
  });


  describe('getAllQuestions', () => {
    it('すべてのquestion定義を取得できる', () => {
      const result = state.getSurvey().getAllQuestions();
      expect(result.size).toBe(3);
    });
  });

  describe('getAllOutputDefinitionMap', () => {
    it('すべてのoutputDefinitionを取得できる', () => {
      const result = state.getSurvey().getAllOutputDefinitionMap();
      expect(result.size).toBe(8);
      expect(result.get('I001')).not.toBe(undefined);
      expect(result.get('I002')).not.toBe(undefined);
      expect(result.get('I002__text')).not.toBe(undefined);
      expect(result.get('I003')).not.toBe(undefined);
      expect(result.get('I004')).not.toBe(undefined);
      expect(result.get('I004')).not.toBe(undefined);
      expect(result.get('I006')).not.toBe(undefined);
    });
  });


  describe('findPrecedingPageNodeIds', () => {
    it('branchのnodeIdを指定し先行するページを指し示すnodeIdを一覧することができる', () => {
      const result = state.getSurvey().findPrecedingPageNodeIds('F002');
      expect(result.length).toBe(1);
      expect(result[0]).toBe('F001');
    });

    it('pageのnodeIdを指定し先行するページを指し示すnodeIdを一覧することができる', () => {
      const result = state.getSurvey().findPrecedingPageNodeIds('F003');
      expect(result.length).toBe(2);
      expect(result[0]).toBe('F001');
      expect(result[1]).toBe('F003');
    });
  });

  describe('findFollowingPageNodeIds', () => {
    it('branchのnodeIdを指定し以降のpageとfinisherを指し示すnodeIdを一覧することができる', () => {
      const result = state.getSurvey().findFollowingPageAndFinisherNodeIds('F002');
      expect(result.length).toBe(2);
      expect(result[0]).toBe('F003');
      expect(result[1]).toBe('F004');
    });

    it('pageのnodeIdを指定し以降のpageとfinisherを指し示すnodeIdを一覧することができる', () => {
      const result = state.getSurvey().findFollowingPageAndFinisherNodeIds('F001');
      expect(result.length).toBe(3);
      expect(result[0]).toBe('F001');
      expect(result[1]).toBe('F003');
      expect(result[2]).toBe('F004');
    });
  });


  describe('calcPageNo', () => {
    it('ページ番号を取得できる', () => {
      const result = state.getSurvey().calcPageNo('P001');
      expect(result).toBe('1');
    });

    it('ブランチが間に入っていても正しくページ番号を取得できる', () => {
      const result = state.getSurvey().calcPageNo('P002');
      expect(result).toBe('2');
    });
  });

  describe('calcQuestionNo', () => {
    it('page番号は含めないquestion番号を取得できる', () => {
      const result = state.getSurvey().calcQuestionNo('P001', '2');
      expect(result).toBe(2);
    });
  });

  describe('findQuestion', () => {
    it('questionIdからquestionを取得できる', () => {
      const result = state.getSurvey().findQuestion('2');
      expect(result.getId()).toBe('2');
    });
  });

  describe('removeNode', () => {
    it('nodeを削除すると対応するpageも削除される', () => {
      const newState = state.getSurvey().removeNode('F001');
      expect(newState.getNodes().size).toBe(3);
      expect(newState.getPages().size).toBe(1);
    });

    it('nodeを削除すると対応するbranchも削除される', () => {
      const newState = state.getSurvey().removeNode('F002');
      expect(newState.getNodes().size).toBe(3);
      expect(newState.getBranches().size).toBe(0);
    });

    it('nodeを削除すると対応するfinisherも削除される', () => {
      const newState = state.getSurvey().removeNode('F004');
      expect(newState.getNodes().size).toBe(3);
      expect(newState.getFinishers().size).toBe(0);
    });

    it('先頭のnodeを削除することができる', () => {
      const newState = state.getSurvey().removeNode('F001');
      expect(newState.getNodes().size).toBe(3);
    });

    it('途中のnodeを削除するとそこを参照しているnodeのnextNodeIdが削除したnodeのnextNodeIdに変更される', () => {
      const newState = state.getSurvey().removeNode('F003');
      expect(newState.findNode('F002').getNextNodeId()).toBe('F004');
    });

    it('最後のnodeを削除するとそこを参照しているnodeのnextNodeIdが削除したnodeのnextNodeIdに変更される', () => {
      const newState = state.getSurvey().removeNode('F004');
      expect(newState.findNode('F003').getNextNodeId()).toBe(null);
    });

    it('conditionの中で参照しているnodeIdも合わせて削除される', () => {
      const newState = state.getSurvey().removeNode('F003');
      expect(newState.getIn(['branches', 0, 'conditions', 2, 'nextNodeId'])).toBe('');
    });
  });

  describe('addNode', () => {
    it('先頭にpageを挿入できる', () => {
      const newState = state.getSurvey().addNode(0, 'page');
      expect(newState.getNodes().size).toBe(5);
      expect(newState.getPages().size).toBe(3);
      expect(newState.getNodes().get(0).getNextNodeId()).toBe(newState.getNodes().get(1).getId());
    });

    it('先頭にbranchを挿入できる', () => {
      const newState = state.getSurvey().addNode(0, 'branch');
      expect(newState.getNodes().size).toBe(5);
      expect(newState.getBranches().size).toBe(2);
      expect(newState.getNodes().get(0).getNextNodeId()).toBe(newState.getNodes().get(1).getId());
    });

    it('途中にpageを挿入すると一つ前のnextNodeIdも同時に書き換わる', () => {
      const newState = state.getSurvey().addNode(1, 'page');
      expect(newState.getNodes().size).toBe(5);
      expect(newState.getPages().size).toBe(3);
      expect(newState.getNodes().get(0).getNextNodeId()).toBe(newState.getNodes().get(1).getId());
      expect(newState.getNodes().get(1).getNextNodeId()).toBe(newState.getNodes().get(2).getId());
    });
  });
});
