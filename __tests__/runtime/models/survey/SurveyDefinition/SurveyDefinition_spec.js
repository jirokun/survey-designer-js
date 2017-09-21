/* eslint-env jest */
import SurveyDesignerState from '../../../../../lib/runtime/models/SurveyDesignerState';
import VisibilityConditionDefinition from '../../../../../lib/runtime/models/survey/questions/internal/VisibilityConditionDefinition';
import NumberValidationRuleDefinition from '../../../../../lib/runtime/models/survey/questions/internal/NumberValidationRuleDefinition';
import AllJavaScriptCode from '../../../../../lib/editor/models/AllJavaScriptCode';
import sample1 from '../../sample1.json';
import noBranchSurvey from './noBranchSurvey.json';
import hasNotScreeningBranchSurvey from './hasNotScreeningBranchSurvey.json';
import hasScreeningBranchSurvey from './hasScreeningBranchSurvey.json';
import hasReferenceInPageSurvey from './hasReferenceInPageSurvey.json';
import hasReferenceInFinisherSurvey from './hasReferenceInFinisherSurvey.json';
import hasNoReferenceSurvey from './hasNoReferenceSurvey.json';
import hasLogicalVariablesSurvey from './hasLogicalVariablesSurvey.json';
import hasJavaScriptSurvey from './hasJavaScriptSurvey.json';
import isValidPositionOfCompleteFinisherCase1 from './isValidPositionOfCompleteFinisherCase1.json';
import isValidPositionOfCompleteFinisherCase2 from './isValidPositionOfCompleteFinisherCase2.json';
import isValidPositionOfCompleteFinisherCase3 from './isValidPositionOfCompleteFinisherCase3.json';
import isValidPositionOfCompleteFinisherCase4 from './isValidPositionOfCompleteFinisherCase4.json';
import isValidPositionOfCompleteFinisherCase5 from './isValidPositionOfCompleteFinisherCase5.json';
import isValidCompleteFinisherCase1 from './isValidCompleteFinisherCase1.json';
import isValidCompleteFinisherCase2 from './isValidCompleteFinisherCase2.json';
import isValidCompleteFinisherCase3 from './isValidCompleteFinisherCase3.json';
import isValidCompleteFinisherCase4 from './isValidCompleteFinisherCase4.json';
import getFinisherNodesValid from './getFinisherNodesValid.json';
import findNextPageFromRefId from './findNextpageFromRefId.json';
import findOutputDevIdFromName from './findOutputDevIdFromName.json';
import updateAllJavaScript from './updateAllJavaScript.json';
import getAllDevIds from './getAllDevIds.json';
import migrateNumberValidation from './migrateNumberValidation.json';
import migrateScheduleQuestionNoSubItems from './migrateScheduleQuestionNoSubItems.json';
import migrateScheduleQuestionHasSubItems from './migrateScheduleQuestionHasSubItems.json';
import migrateScheduleQuestionHasUndefinedOneSubItems from './migrateScheduleQuestionHasUndefinedOneSubItems.json';

describe('SurveyDefinition', () => {
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

  describe('getFinisherNodes', () => {
    it('finisherのnodesが取得できる', () => {
      const survey = SurveyDesignerState.createFromJson(getFinisherNodesValid).getSurvey();
      const nodes = survey.getFinisherNodes();
      expect(nodes.size).toBe(2);
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

  describe('getAllPageOrFinisherNodeIds', () => {
    it('すべてのPageもしくはFinisherのNodeId一覧を取得できる', () => {
      const result = state.getSurvey().getAllPageOrFinisherNodeIds();
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

  describe('findFollowingPageAndFinisherNodeIds', () => {
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

  describe('findFollowingPageAndBranchNodeIds', () => {
    it('branchのnodeIdを指定し以降のpageを指し示すnodeIdを一覧することができる', () => {
      const result = state.getSurvey().findFollowingPageAndBranchNodeIds('F002');
      expect(result.length).toBe(2);
      expect(result[0]).toBe('F002');
      expect(result[1]).toBe('F003');
    });

    it('pageのnodeIdを指定し以降のpageを指し示すnodeIdを一覧することができる', () => {
      const result = state.getSurvey().findFollowingPageAndBranchNodeIds('F001');
      expect(result.length).toBe(3);
      expect(result[0]).toBe('F001');
      expect(result[1]).toBe('F002');
      expect(result[2]).toBe('F003');
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

  describe('hasNotScreeningBranch', () => {
    it('スクリーニング設問がそもそもない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: noBranchSurvey }).getSurvey();
      expect(survey.hasNotScreeningBranch()).toBe(false);
    });

    it('スクリーニング以外への分岐がある', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasNotScreeningBranchSurvey }).getSurvey();
      expect(survey.hasNotScreeningBranch()).toBe(true);
    });

    it('スクリーニングへの分岐がある', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasScreeningBranchSurvey }).getSurvey();
      expect(survey.hasNotScreeningBranch()).toBe(false);
    });
  });

  describe('hasReferenceInPages', () => {
    it('ページ内に再掲がある', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasReferenceInPageSurvey }).getSurvey();
      survey.refreshReplacer();
      expect(survey.hasReferenceInPages()).toBe(true);
    });

    it('再掲がない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasNoReferenceSurvey }).getSurvey();
      survey.refreshReplacer();
      expect(survey.hasReferenceInPages()).toBe(false);
    });
  });

  describe('hasReferenceInFinishers', () => {
    it('ページ内に再掲がある', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasReferenceInFinisherSurvey }).getSurvey();
      survey.refreshReplacer();
      expect(survey.hasReferenceInFinishers()).toBe(true);
    });

    it('再掲がない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasNoReferenceSurvey }).getSurvey();
      survey.refreshReplacer();
      expect(survey.hasReferenceInFinishers()).toBe(false);
    });
  });

  describe('hasLogicalVariables', () => {
    it('ロジック変数がある', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasLogicalVariablesSurvey }).getSurvey();
      expect(survey.hasLogicalVariables()).toBe(true);
    });

    it('ロジック変数がない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: sample1 }).getSurvey();
      expect(survey.hasLogicalVariables()).toBe(false);
    });
  });

  describe('hasJavaScript', () => {
    it('JavaScriptがある', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasJavaScriptSurvey }).getSurvey();
      expect(survey.hasJavaScript()).toBe(true);
    });

    it('JavaScriptがない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: sample1 }).getSurvey();
      expect(survey.hasJavaScript()).toBe(false);
    });
  });

  describe('hasVisibilityCondition', () => {
    it('visibilityConditionがある', () => {
      const survey = state.getSurvey().updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition()));
      expect(survey.hasVisibilityCondition()).toBe(true);
    });

    it('visibilityConditionがない', () => {
      const survey = state.getSurvey();
      expect(survey.hasVisibilityCondition()).toBe(false);
    });
  });
  describe('hasNumberValidationRules', () => {
    it('numberValidationRuleがある', () => {
      const survey = state.getSurvey().updateIn(['pages', 1, 'questions', 0, 'numberValidationRuleMap'], map => map.set('hoge', NumberValidationRuleDefinition.create()));
      expect(survey.hasNumberValidationRules()).toBe(true);
    });
    it('numberValidationRuleがない', () => {
      const survey = state.getSurvey();
      expect(survey.hasNumberValidationRules()).toBe(false);
    });
  });

  describe('isValidPositionOfCompleteFinisher', () => {
    it('最後のページの次がCOMPLETEである', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidPositionOfCompleteFinisherCase1 }).getSurvey();
      expect(survey.isValidPositionOfCompleteFinisher()).toBe(true);
    });

    it('最後のページの次がCOMPLETEでない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidPositionOfCompleteFinisherCase2 }).getSurvey();
      expect(survey.isValidPositionOfCompleteFinisher()).toBe(false);
    });

    it('PAGE => FINISHER:SCREEN => FINISHER:COMPLETE の場合はNG', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidPositionOfCompleteFinisherCase3 }).getSurvey();
      expect(survey.isValidPositionOfCompleteFinisher()).toBe(false);
    });

    it('BRANCH => FINISHER:COMPLETE => FINISHER:SCREEN の場合はOK', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidPositionOfCompleteFinisherCase4 }).getSurvey();
      expect(survey.isValidPositionOfCompleteFinisher()).toBe(true);
    });

    it('PAGE => BRANCH => FINISHER:SCREEN => FINISHER:COMPLETE の場合はOK', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidPositionOfCompleteFinisherCase5 }).getSurvey();
      expect(survey.isValidPositionOfCompleteFinisher()).toBe(false);
    });
  });

  describe('isValidFinisher', () => {
    it('FINISHER:SCREEN => PAGE => FINISHER:COMPLETE の場合はNG', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidCompleteFinisherCase1 }).getSurvey();
      expect(survey.isValidFinisher()).toBe(false);
    });

    it('FINISHER:COMPLETE => PAGE => FINISHER:SCREEN の場合はNG', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidCompleteFinisherCase2 }).getSurvey();
      expect(survey.isValidFinisher()).toBe(false);
    });

    it('PAGE => FINISHER:COMPLETE => FINISHER:SCREEN の場合はOK', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidCompleteFinisherCase3 }).getSurvey();
      expect(survey.isValidFinisher()).toBe(true);
    });

    it('FINISHER:COMPLETE => BRANCH => FINISHER:SCREEN の場合はNG', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: isValidCompleteFinisherCase4 }).getSurvey();
      expect(survey.isValidFinisher()).toBe(false);
    });
  });

  describe('findNextPageFromRefId', () => {
    it('次のページがあるなら、idを取得できる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: findNextPageFromRefId }).getSurvey();
      expect(survey.findNextPageFromRefId('cj1pzhzdg00023j66pvgv5plq').getId()).toBe('cj1q0g8au001s3j66v7lvbklq');
    });

    it('次のページがないなら、nullを返す', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: findNextPageFromRefId }).getSurvey();
      expect(survey.findNextPageFromRefId('cj1q0g8au001s3j66v7lvbklq')).toBe(null);
    });
  });

  describe('findOutputDevIdFromName', () => {
    it('存在するnameなら、devIdを取得できる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: findOutputDevIdFromName }).getSurvey();
      expect(survey.findOutputDevIdFromName('cj1q0g6p5001o3j66hp2fwios__value1')).toBe('www_xx1_yy1');
    });

    it('存在しないnameなら、nullを返す', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: findOutputDevIdFromName }).getSurvey();
      expect(survey.findOutputDevIdFromName('invalid_name')).toBe(null);
    });
  });

  describe('updateAllJavaScriptCode', () => {
    it('前ページのJavaScriptを更新する', () => {
      const allJavaScriptCode = new AllJavaScriptCode({ code: '// Page Start: ww1\nupdate after 1\n// Page End: ww1\n// Page Start: ww2\nupdate after 2\n// Page End: ww2\n' });

      const survey = SurveyDesignerState.createFromJson({ survey: updateAllJavaScript }).getSurvey();
      const newSurvey = survey.updateAllJavaScriptCode(allJavaScriptCode);
      expect(newSurvey.findPage('cj1pzhzdg00023j66pvgv5plq').getJavaScriptCode()).toBe('update after 1');
      expect(newSurvey.findPage('cj1q0g8au001s3j66v7lvbklq').getJavaScriptCode()).toBe('update after 2');
    });
  });

  describe('getAllPageDevIds', () => {
    it('存在するnameなら、devIdを取得できる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: getAllDevIds }).getSurvey();
      const devIds = survey.getAllPageDevIds();
      expect(devIds.toArray()).toEqual(['ww1', 'ww2']);
    });
  });

  describe('getAllQuestionDevIds', () => {
    it('存在するnameなら、devIdを取得できる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: getAllDevIds }).getSurvey();
      const devIds = survey.getAllQuestionDevIds();
      expect(devIds.toArray()).toEqual(['ww1_xx1', 'ww2_xx2']);
    });
  });

  describe('getAllItemDevIds', () => {
    it('存在するnameなら、devIdを取得できる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: getAllDevIds }).getSurvey();
      const devIds = survey.getAllItemDevIds();
      expect(devIds.toArray()).toEqual(['ww1_xx1_yy1', 'ww2_xx2_yy3']);
    });
  });

  describe('getAllSubItemDevIds', () => {
    it('存在するnameなら、devIdを取得できる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: getAllDevIds }).getSurvey();
      const devIds = survey.getAllSubItemDevIds();
      expect(devIds.toArray()).toEqual(['ww1_xx1_yy2', 'ww2_xx2_yy4']);
    });
  });

  describe('findNumberValidationRuleById', () => {
    it('NumberValidationRuleを取得できる', () => {
      const survey = state.getSurvey().updateIn(['pages', 1, 'questions', 0], question => question.addNumberValidation('DUMMY'));
      const numberValidationRule = survey.getIn(['pages', 1, 'questions', 0, 'numberValidationRuleMap', 'DUMMY', 0]);
      const actual = survey.findNumberValidationRuleById(numberValidationRule.getId());
      expect(actual.equals(numberValidationRule)).toBe(true);
    });
  });

  describe('migrate', () => {
    it('MultiNumberの最小値がNumberValidationRuleに変換される', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateNumberValidation }).getSurvey();
      const result = survey.migrate();
      const targetQuestion = result.getPages().get(0).getQuestions().get(0);

      // 数値の項目1つ目
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000q3k6844u5sckf').size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000q3k6844u5sckf').get(0).getNumberValidations().size).toBe(2);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000q3k6844u5sckf').get(0).getNumberValidations().get(0).getValue()).toBe('10');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000q3k6844u5sckf').get(0).getNumberValidations().get(0).getOperator()).toBe('>=');

      // 数値の項目2つ目
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbbr8000w3k68qjoeqf2r').size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbbr8000w3k68qjoeqf2r').get(0).getNumberValidations().size).toBe(2);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbbr8000w3k68qjoeqf2r').get(0).getNumberValidations().get(0).getValue()).toBe('10');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbbr8000w3k68qjoeqf2r').get(0).getNumberValidations().get(0).getOperator()).toBe('>=');
    });

    it('MultiNumberの最大値がNumberValidationRuleに変換される', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateNumberValidation }).getSurvey();
      const result = survey.migrate();
      const targetQuestion = result.getPages().get(0).getQuestions().get(0);

      // 数値の項目1つ目
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000q3k6844u5sckf').size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000q3k6844u5sckf').get(0).getNumberValidations().size).toBe(2);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000q3k6844u5sckf').get(0).getNumberValidations().get(1).getValue()).toBe('20');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000q3k6844u5sckf').get(0).getNumberValidations().get(1).getOperator()).toBe('<=');

      // 数値の項目2つ目
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbbr8000w3k68qjoeqf2r').size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbbr8000w3k68qjoeqf2r').get(0).getNumberValidations().size).toBe(2);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbbr8000w3k68qjoeqf2r').get(0).getNumberValidations().get(1).getValue()).toBe('20');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbbr8000w3k68qjoeqf2r').get(0).getNumberValidations().get(1).getOperator()).toBe('<=');
    });

    it('MultiNumberの合計値がNumberValidationRuleに変換される', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateNumberValidation }).getSurvey();
      const result = survey.migrate();
      const targetQuestion = result.getPages().get(0).getQuestions().get(0);

      // 数値の合計値
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000p3k68jronwu4m__total').size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000p3k68jronwu4m__total').get(0).getNumberValidations().size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000p3k68jronwu4m__total').get(0).getNumberValidations().get(0).getValue()).toBe('30');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rka444000p3k68jronwu4m__total').get(0).getNumberValidations().get(0).getOperator()).toBe('==');
    });

    it('MatrixQuestionの行の合計値がNumberValidationRuleに変換される', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateNumberValidation }).getSurvey();
      const result = survey.migrate();
      const targetQuestion = result.getPages().get(0).getQuestions().get(1);

      // 行1の合計
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00143k68wgtqptkl_total_row').size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00143k68wgtqptkl_total_row').get(0).getNumberValidations().size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00143k68wgtqptkl_total_row').get(0).getNumberValidations().get(0).getValue()).toBe('3');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00143k68wgtqptkl_total_row').get(0).getNumberValidations().get(0).getOperator()).toBe('==');
      // 行2の合計
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcnz1001a3k68k6s04oki_total_row').get(0).getNumberValidations().size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcnz1001a3k68k6s04oki_total_row').get(0).getNumberValidations().get(0).getValue()).toBe('7');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcnz1001a3k68k6s04oki_total_row').get(0).getNumberValidations().get(0).getOperator()).toBe('==');
    });

    it('MatrixQuestionの列の合計値がNumberValidationRuleに変換される', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateNumberValidation }).getSurvey();
      const result = survey.migrate();
      const targetQuestion = result.getPages().get(0).getQuestions().get(1);

      // 列1の合計
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00153k68t7dgni2y_total_column').size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00153k68t7dgni2y_total_column').get(0).getNumberValidations().size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00153k68t7dgni2y_total_column').get(0).getNumberValidations().get(0).getValue()).toBe('4');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00153k68t7dgni2y_total_column').get(0).getNumberValidations().get(0).getOperator()).toBe('==');
      // 列2の合計
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcol3001c3k68ulxowpfb_total_column').get(0).getNumberValidations().size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcol3001c3k68ulxowpfb_total_column').get(0).getNumberValidations().get(0).getValue()).toBe('8');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcol3001c3k68ulxowpfb_total_column').get(0).getNumberValidations().get(0).getOperator()).toBe('==');
    });

    it('すでに移行済みのものは再度migrate処理を行わない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateNumberValidation }, { rawRecord: true })
        .get('survey')
        .updateIn(['pages', 0, 'questions', 1], question => question.addNumberValidation('cj6rkcol3001c3k68ulxowpfb_total_column', { value: '999', operator: '!=' }));

      const result = survey.migrate();
      const targetQuestion = result.getPages().get(0).getQuestions().get(1);

      // 行1の合計
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkbv0j00153k68t7dgni2y_total_column')).toBe(undefined);
      // 行2の合計
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcol3001c3k68ulxowpfb_total_column').get(0).getNumberValidations().size).toBe(1);
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcol3001c3k68ulxowpfb_total_column').get(0).getNumberValidations().get(0).getValue()).toBe('999');
      expect(targetQuestion.getNumberValidationRuleMap().get('cj6rkcol3001c3k68ulxowpfb_total_column').get(0).getNumberValidations().get(0).getOperator()).toBe('!=');
    });

    it('日程質問でSubItemsがない場合はSubItemsを追加する', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateScheduleQuestionNoSubItems }).getSurvey();
      const targetQuestion = survey.getPages().get(0).getQuestions().get(0);

      expect(targetQuestion.getSubItems().size).toBe(3);
      expect(targetQuestion.getSubItems().get(0).getLabel()).toBe('<b>A.<br />午前<br />9:00～12:00</b>');
      expect(targetQuestion.getSubItems().get(1).getLabel()).toBe('<b>B.<br />午後<br />12:00～16:00</b>');
      expect(targetQuestion.getSubItems().get(2).getLabel()).toBe('<b>C.<br />夜間<br />16:00 以降</b>');
    });

    it('日程質問でSubItemsが1つ「名称未設定」の場合はSubItemsを追加する', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateScheduleQuestionHasUndefinedOneSubItems }).getSurvey();
      const targetQuestion2 = survey.getPages().get(0).getQuestions().get(1);

      expect(targetQuestion2.getSubItems().size).toBe(3);
      expect(targetQuestion2.getSubItems().get(0).getLabel()).toBe('<b>A.<br />午前<br />9:00～12:00</b>');
      expect(targetQuestion2.getSubItems().get(1).getLabel()).toBe('<b>B.<br />午後<br />12:00～16:00</b>');
      expect(targetQuestion2.getSubItems().get(2).getLabel()).toBe('<b>C.<br />夜間<br />16:00 以降</b>');
    });

    it('日程質問でSubItemsがすでにある場合はSubItemsを追加しない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateScheduleQuestionHasSubItems }).getSurvey();
      const targetQuestion = survey.getPages().get(0).getQuestions().get(0);

      expect(targetQuestion.getSubItems().size).toBe(2);
      expect(targetQuestion.getSubItems().get(0).getLabel()).toBe('hoge');
      expect(targetQuestion.getSubItems().get(1).getLabel()).toBe('fuga');
    });
  });

  describe('isOutputDefinitionEqual', () => {
    it('OuputDefinitionが変更されていたらfalseを返す', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateNumberValidation }, { rawRecord: true }).get('survey');
      const question = survey.getIn(['pages', 0, 'questions', 0]);
      const result = survey.isOutputDefinitionEqual(survey.updateIn(['pages', 0], page => page.removeQuestion(question.getId())));
      expect(result).toBe(false);
    });
    it('OuputDefinitionが変更されていない場合trueを返す', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: migrateNumberValidation }, { rawRecord: true }).get('survey');
      const result = survey.isOutputDefinitionEqual(survey);
      expect(result).toBe(true);
    });
  });
});
