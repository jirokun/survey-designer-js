/* eslint-env jest */
import SurveyDesignerState from '../../../lib/runtime/models/SurveyDesignerState';
import CheckboxQuestionDefinition from '../../../lib/runtime/models/survey/questions/CheckboxQuestionDefinition';
import sample1 from './sample1.json';

describe('SurveyDesignerState', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
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
      expect(nodes.size).toBe(4);
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

  describe('removeNode', () => {
    it('nodeを削除すると対応するpageも削除される', () => {
      const newState = state.removeNode('F001');
      expect(newState.getNodes().size).toBe(3);
      expect(newState.getPages().size).toBe(1);
    });

    it('nodeを削除すると対応するbranchも削除される', () => {
      const newState = state.removeNode('F002');
      expect(newState.getNodes().size).toBe(3);
      expect(newState.getBranches().size).toBe(0);
    });

    it('nodeを削除すると対応するfinisherも削除される', () => {
      expect(state.getFinishers().size).toBe(1);
      const newState = state.removeNode('F004');
      expect(newState.getNodes().size).toBe(3);
      expect(newState.getFinishers().size).toBe(0);
    });

    it('先頭のnodeを削除することができる', () => {
      const newState = state.removeNode('F001');
      expect(newState.getNodes().size).toBe(3);
    });

    it('途中のnodeを削除するとそこを参照しているnodeのnextNodeIdが削除したnodeのnextNodeIdに変更される', () => {
      const newState = state.removeNode('F003');
      expect(newState.findNode('F002').getNextNodeId()).toBe('F004');
    });

    it('最後のnodeを削除するとそこを参照しているnodeのnextNodeIdが削除したnodeのnextNodeIdに変更される', () => {
      const newState = state.removeNode('F004');
      expect(newState.findNode('F003').getNextNodeId()).toBe(null);
    });

    it('conditionの中で参照しているnodeIdも合わせて削除される', () => {
      const newState = state.removeNode('F003');
      expect(newState.getIn(['survey', 'branches', 0, 'conditions', 2, 'nextNodeId'])).toBe('');
    });
  });

  describe('addNode', () => {
    it('先頭にpageを挿入できる', () => {
      const newState = state.addNode(0, 'page');
      expect(newState.getNodes().size).toBe(5);
      expect(newState.getPages().size).toBe(3);
      expect(newState.getNodes().get(0).getNextNodeId()).toBe(newState.getNodes().get(1).getId());
    });

    it('先頭にbranchを挿入できる', () => {
      const newState = state.addNode(0, 'branch');
      expect(newState.getNodes().size).toBe(5);
      expect(newState.getBranches().size).toBe(2);
      expect(newState.getNodes().get(0).getNextNodeId()).toBe(newState.getNodes().get(1).getId());
    });

    it('途中にpageを挿入すると一つ前のnextNodeIdも同時に書き換わる', () => {
      const newState = state.addNode(1, 'page');
      expect(newState.getNodes().size).toBe(5);
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
      expect(result1.getAnswers().get('q1')).toBe('abc');
      const result2 = result1.submitPage({ q2: 'def' });
      expect(result2.getAnswers().get('q1')).toBe('abc');
      expect(result2.getAnswers().get('q2')).toBe('def');
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

    it('postfixを含めたquestion番号を取得できる', () => {
      const result = state.calcQuestionNo('P001', '2', 'text');
      expect(result).toBe('1-2-text');
    });
  });

  describe('swapCondition', () => {
    it('指定したconditionを入れ替えることができる', () => {
      expect(state.getIn(['survey', 'branches', 0, 'conditions', 0, 'nextNodeId'])).toBe('F001');
      expect(state.getIn(['survey', 'branches', 0, 'conditions', 2, 'nextNodeId'])).toBe('F003');
      const result = state.swapCondition('F002', 'C001', 'C003');
      expect(result.getIn(['survey', 'branches', 0, 'conditions', 0, 'nextNodeId'])).toBe('F003');
      expect(result.getIn(['survey', 'branches', 0, 'conditions', 2, 'nextNodeId'])).toBe('F001');
    });
  });

  describe('swapItem', () => {
    it('指定したitemを入れ替えることができる', () => {
      const result = state.swapItem('P001', '1', 'I001', 'I003');
      expect(result.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 0, '_id'])).toBe('I003');
      expect(result.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 1, '_id'])).toBe('I002');
      expect(result.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 2, '_id'])).toBe('I001');
      expect(result.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 0, 'index'])).toBe(0);
      expect(result.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 1, 'index'])).toBe(1);
      expect(result.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 2, 'index'])).toBe(2);
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
    it('branchのnodeIdを指定し以降のpageとfinisherを指し示すnodeIdを一覧することができる', () => {
      const result = state.findFollowingPageAndFinisherNodeIds('F002');
      expect(result.length).toBe(2);
      expect(result[0]).toBe('F003');
      expect(result[1]).toBe('F004');
    });

    it('pageのnodeIdを指定し以降のpageとfinisherを指し示すnodeIdを一覧することができる', () => {
      const result = state.findFollowingPageAndFinisherNodeIds('F001');
      expect(result.length).toBe(3);
      expect(result[0]).toBe('F001');
      expect(result[1]).toBe('F003');
      expect(result[2]).toBe('F004');
    });
  });

  describe('updateConditionAttribute', () => {
    it('conditionの属性を更新できる', () => {
      expect(state.getIn(['survey', 'branches', 0, 'conditions', 1, 'conditionType'])).toBe('some');
      const result = state.updateConditionAttribute('B001', 'C002', 'conditionType', 'all');
      expect(result.getIn(['survey', 'branches', 0, 'conditions', 1, 'conditionType'])).toBe('all');
    });
  });

  describe('updateChildConditionAttribute', () => {
    it('childConditionの属性を更新できる', () => {
      expect(state.getIn(['survey', 'branches', 0, 'conditions', 1, 'childConditions', 0, 'operator'])).toBe('==');
      const result = state.updateChildConditionAttribute('B001', 'C002', 'CC002', 'operator', '!=');
      expect(result.getIn(['survey', 'branches', 0, 'conditions', 1, 'childConditions', 0, 'operator'])).toBe('!=');
    });
  });

  describe('updateItemAttribute', () => {
    it('itemの属性を更新できる', () => {
      expect(state.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 0, 'label'])).toBe('通常の選択肢');
      const result = state.updateItemAttribute('P001', '1', 'I001', 'label', 'ABC');
      expect(result.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 0, 'label'])).toBe('ABC');
    });
  });

  describe('getAllQuestions', () => {
    it('すべてのquestion定義を取得できる', () => {
      const result = state.getAllQuestions();
      expect(result.size).toBe(3);
    });
  });

  describe('getAllOutputDefinitionMap', () => {
    it('すべてのoutputDefinitionを取得できる', () => {
      const result = state.getAllOutputDefinitionMap();
      expect(result.size).toBe(7);
      expect(result.get('I001')).not.toBe(undefined);
      expect(result.get('I002')).not.toBe(undefined);
      expect(result.get('I002__text')).not.toBe(undefined);
      expect(result.get('I003')).not.toBe(undefined);
      expect(result.get('I004')).not.toBe(undefined);
      expect(result.get('I004')).not.toBe(undefined);
      expect(result.get('I006')).not.toBe(undefined);
    });
  });

  describe('addChildCondition', () => {
    it('childConditionを追加できる', () => {
      expect(state.getIn(['survey', 'branches', 0, 'conditions', 1, 'childConditions']).size).toBe(1);
      const result = state.addChildCondition('B001', 'C002', 1);
      expect(result.getIn(['survey', 'branches', 0, 'conditions', 1, 'childConditions']).size).toBe(2);
      expect(result.getIn(['survey', 'branches', 0, 'conditions', 1, 'childConditions', 1, 'outputId'])).toBe('');
    });
  });

  describe('removeChildCondition', () => {
    it('指定したchildConditionが削除できること', () => {
      const result = state.addChildCondition('B001', 'C002', 1);
      const childConditionId = result.getIn(['survey', 'branches', 0, 'conditions', 1, 'childConditions', 1, '_id']);
      const result2 = result.removeChildCondition('B001', 'C002', childConditionId);
      expect(result2.getIn(['survey', 'branches', 0, 'conditions', 1, 'childConditions']).size).toBe(1);
      expect(result2.getIn(['survey', 'branches', 0, 'conditions', 1, 'childConditions', 0, '_id'])).toBe('CC002');
    });
  });

  describe('removeItem', () => {
    it('指定したitemを削除でき、indexが更新されること', () => {
      const result1 = state.removeItem('P001', '1', 'I002');
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items']).size).toBe(2);
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 0, '_id'])).toBe('I001');
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 1, '_id'])).toBe('I003');
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 0, 'index'])).toBe(0);
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 1, 'index'])).toBe(1);
    });
  });

  describe('addItem', () => {
    it('指定したindexにitemを追加でき、indexが更新されること', () => {
      const result1 = state.addItem('P001', '1', 1);
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items']).size).toBe(4);
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 0, '_id'])).toBe('I001');
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 2, '_id'])).toBe('I002');
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 3, '_id'])).toBe('I003');
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 0, 'index'])).toBe(0);
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 1, 'index'])).toBe(1);
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 2, 'index'])).toBe(2);
      expect(result1.getIn(['survey', 'pages', 0, 'questions', 0, 'items', 3, 'index'])).toBe(3);
    });
  });

  describe('swapNode', () => {
    it('0番目と1番目のnodeの入れ替えができること', () => {
      const result = state.swapNode('F001', 'F002');
      expect(result.getIn(['survey', 'nodes', 0, '_id'])).toBe('F002');
      expect(result.getIn(['survey', 'nodes', 0, 'nextNodeId'])).toBe('F001');
      expect(result.getIn(['survey', 'nodes', 1, '_id'])).toBe('F001');
      expect(result.getIn(['survey', 'nodes', 1, 'nextNodeId'])).toBe('F003');
    });

    it('1番目と2番目のnodeの入れ替えができること', () => {
      const result = state.swapNode('F002', 'F003');
      expect(result.getIn(['survey', 'nodes', 0, '_id'])).toBe('F001');
      expect(result.getIn(['survey', 'nodes', 0, 'nextNodeId'])).toBe('F003');
      expect(result.getIn(['survey', 'nodes', 1, '_id'])).toBe('F003');
      expect(result.getIn(['survey', 'nodes', 1, 'nextNodeId'])).toBe('F002');
      expect(result.getIn(['survey', 'nodes', 2, '_id'])).toBe('F002');
      expect(result.getIn(['survey', 'nodes', 2, 'nextNodeId'])).toBe('F004');
    });

    it('2番目と3番目(最後)のnodeの入れ替えができること', () => {
      const result = state.swapNode('F003', 'F004');
      expect(result.getIn(['survey', 'nodes', 1, '_id'])).toBe('F002');
      expect(result.getIn(['survey', 'nodes', 1, 'nextNodeId'])).toBe('F004');
      expect(result.getIn(['survey', 'nodes', 2, '_id'])).toBe('F004');
      expect(result.getIn(['survey', 'nodes', 2, 'nextNodeId'])).toBe('F003');
      expect(result.getIn(['survey', 'nodes', 3, '_id'])).toBe('F003');
      expect(result.getIn(['survey', 'nodes', 3, 'nextNodeId'])).toBe(null);
    });

    it('連続しないnodeの入れ替え(1番目と3番目)ができること', () => {
      const result = state.swapNode('F002', 'F004');
      expect(result.getIn(['survey', 'nodes', 0, '_id'])).toBe('F001');
      expect(result.getIn(['survey', 'nodes', 0, 'nextNodeId'])).toBe('F004');
      expect(result.getIn(['survey', 'nodes', 1, '_id'])).toBe('F004');
      expect(result.getIn(['survey', 'nodes', 1, 'nextNodeId'])).toBe('F003');
      expect(result.getIn(['survey', 'nodes', 2, '_id'])).toBe('F003');
      expect(result.getIn(['survey', 'nodes', 2, 'nextNodeId'])).toBe('F002');
      expect(result.getIn(['survey', 'nodes', 3, '_id'])).toBe('F002');
      expect(result.getIn(['survey', 'nodes', 3, 'nextNodeId'])).toBe(null);
    });
  });

  describe('swapQuestion', () => {
    it('同じページ内で0番目と1番目のquestionの入れ替えができること', () => {
      const result = state.swapQuestion('F001', '1', '2');
      expect(result.getIn(['survey', 'pages', 0, 'questions', 0, '_id'])).toBe('2');
      expect(result.getIn(['survey', 'pages', 0, 'questions', 1, '_id'])).toBe('1');
    });
  });
});
