/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import sample1 from '../sample1.json';
import multiBranchDestinationJson from './NodeDefinition_multiBranchDestination.json';

describe('NodeDefinition', () => {
  describe('addChildCondition', () => {
    it('childConditionを追加できる', () => {
      const state = SurveyDesignerState.createFromJson(sample1);
      const result = state.getSurvey().findBranch('B001').addChildCondition('C002', 1);
      expect(result.getIn(['conditions', 1, 'childConditions']).size).toBe(2);
      expect(result.getIn(['conditions', 1, 'childConditions', 1, 'outputId'])).toBe('');
    });
  });

  describe('removeChildCondition', () => {
    it('指定したchildConditionが削除できること', () => {
      const state = SurveyDesignerState.createFromJson(sample1);
      const branch = state.getSurvey().findBranch('B001');
      const result = branch.addChildCondition('C002', 1);
      const childConditionId = result.getIn(['conditions', 1, 'childConditions', 1, '_id']);
      const result2 = result.removeChildCondition('C002', childConditionId);
      expect(result2.getIn(['conditions', 1, 'childConditions']).size).toBe(1);
      expect(result2.getIn(['conditions', 1, 'childConditions', 0, '_id'])).toBe('CC002');
    });
  });

  describe('findSource', () => {
    it('先頭のnodeの場合0としてカウントされる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: multiBranchDestinationJson }).getSurvey();
      const node = survey.findNode('cj95oyvtv00013i7324xya3vv');
      const sourceNodes = node.findSourceNodes(survey);
      expect(sourceNodes.size).toBe(0);
    });

    it('conditionのnextNodeIdが次のページになっている場合、branchのnextNodeIdと重複しても一つとしてカウントされる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: multiBranchDestinationJson }).getSurvey();
      const node = survey.findNode('cj95oyypu00093i732mlkvmhl');
      const sourceNodes = node.findSourceNodes(survey);
      expect(sourceNodes.size).toBe(1);
      expect(sourceNodes.get(0).getId()).toBe('cj95oyx8c00073i73g7b1tugb');
    });
    
    it('conditionのnextNodeIdと前のページが遷移元になっている場合2つとしてカウントされる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: multiBranchDestinationJson }).getSurvey();
      const node = survey.findNode('cj95oyvtw00033i732azmhdvi');
      const sourceNodes = node.findSourceNodes(survey);
      expect(sourceNodes.size).toBe(2);
      expect(sourceNodes.get(0).getId()).toBe('cj95oyx8c00073i73g7b1tugb');
      expect(sourceNodes.get(1).getId()).toBe('cj974t0zw00053i73m04ky4mg');
    });

    it('２つのconditionから遷移がある場合、3つとしてカウントされる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: multiBranchDestinationJson }).getSurvey();
      const node = survey.findNode('cj974t0zw00053i73m04ky4mg');
      const sourceNodes = node.findSourceNodes(survey);
      expect(sourceNodes.size).toBe(3);
      expect(sourceNodes.get(0).getId()).toBe('cj95oyx8c00073i73g7b1tugb');
      expect(sourceNodes.get(1).getId()).toBe('cj974t3u100093i73n2qrjkph');
      expect(sourceNodes.get(2).getId()).toBe('cj974t8p5000b3i73niteogk3');
    });

    it('1つ前のnodeがfinisherの場合かつconditionからの遷移元がない場合、0としてカウントされる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: multiBranchDestinationJson }).getSurvey();
      const node = survey.findNode('cj97514gz000f3i73oz8abpfw');
      const sourceNodes = node.findSourceNodes(survey);
      expect(sourceNodes.size).toBe(0);
    });

    it('1つ前のnodeがbranchの場合かつconditionからの遷移元がない場合、1としてカウントされる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: multiBranchDestinationJson }).getSurvey();
      const node = survey.findNode('cj95oyypu00093i732mlkvmhl');
      const sourceNodes = node.findSourceNodes(survey);
      expect(sourceNodes.size).toBe(1);
      expect(sourceNodes.get(0).getId()).toBe('cj95oyx8c00073i73g7b1tugb');
    });
  });
});
