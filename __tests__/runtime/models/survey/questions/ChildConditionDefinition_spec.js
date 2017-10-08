/* eslint-env jest */
import { Map, List } from 'immutable';
import ChildConditionDefinition from '../../../../../lib/runtime/models/survey/ChildConditionDefinition';
import OutputDefinition from '../../../../../lib/runtime/models/survey/questions/internal/OutputDefinition';
import SurveyDefinition from '../../../../../lib/runtime/models/survey/SurveyDefinition';
import NodeDefinition from '../../../../../lib/runtime/models/survey/NodeDefinition';
import ChoiceDefinition from '../../../../../lib/runtime/models/survey/questions/internal/ChoiceDefinition';

describe('ChildConditionDefinition', () => {
  describe('validate', () => {
    it('outputIdが設定されていない場合エラーとなる', () => {
      const survey = new SurveyDefinition();
      const result = new ChildConditionDefinition({ _id: 'ccd1' }).validate(survey, 'dummyBranchId');
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('設定されていない分岐条件があります');
    });

    it('outputTypeがnumberかつvalueが空の場合エラーとなる', () => {
      const survey = new SurveyDefinition();
      survey.getAllOutputDefinitionMap = () => Map({
        od1: new OutputDefinition({
          _id: 'od1',
          outputType: 'number',
        }),
      });
      survey.findNodeFromRefId = () => new NodeDefinition({ _id: 'node1' });
      survey.findPrecedingOutputDefinition = () => survey.getAllOutputDefinitionMap().toList();
      const result = new ChildConditionDefinition({
        _id: 'ccd1',
        outputId: 'od1',
      }).validate(survey, 'dummyBranchId');
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('分岐条件の入力値が空欄です');
    });

    it('outputTypeがradioかつvalueが空の場合エラーとなる', () => {
      const survey = new SurveyDefinition();
      survey.getAllOutputDefinitionMap = () => Map({
        od1: new OutputDefinition({
          _id: 'od1',
          outputType: 'radio',
        }),
      });
      survey.findNodeFromRefId = () => new NodeDefinition({ _id: 'node1' });
      survey.findPrecedingOutputDefinition = () => survey.getAllOutputDefinitionMap().toList();
      const result = new ChildConditionDefinition({
        _id: 'ccd1',
        outputId: 'od1',
      }).validate(survey, 'dummyBranchId');
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('分岐条件の入力値が選択されていません');
    });

    it('outputTypeがselectかつvalueが空の場合エラーとなる', () => {
      const survey = new SurveyDefinition();
      survey.getAllOutputDefinitionMap = () => Map({
        od1: new OutputDefinition({
          _id: 'od1',
          outputType: 'radio',
        }),
      });
      survey.findNodeFromRefId = () => new NodeDefinition({ _id: 'node1' });
      survey.findPrecedingOutputDefinition = () => survey.getAllOutputDefinitionMap().toList();
      const result = new ChildConditionDefinition({
        _id: 'ccd1',
        outputId: 'od1',
      }).validate(survey, 'dummyBranchId');
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('分岐条件の入力値が選択されていません');
    });

    it('outputTypeがnumberかつvalueの参照地がない場合エラーとなる', () => {
      const survey = new SurveyDefinition();
      survey.getAllOutputDefinitionMap = () => Map({
        od1: new OutputDefinition({
          _id: 'od1',
          outputType: 'radio',
          choices: List([new ChoiceDefinition()]),
        }),
      });
      survey.findNodeFromRefId = () => new NodeDefinition({ _id: 'node1' });
      survey.findPrecedingOutputDefinition = () => survey.getAllOutputDefinitionMap().toList();
      survey.refreshReplacer();
      const result = new ChildConditionDefinition({
        _id: 'ccd1',
        outputId: 'od1',
        value: '{{od2.answer}}',
        choices: List([new ChoiceDefinition()]),
      }).validate(survey, 'dummyBranchId');
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('分岐条件の参照先が存在しません');
    });

    it('outputTypeがnumberかつvalueの参照地がある場合エラーとならない', () => {
      const survey = new SurveyDefinition();
      survey.getAllOutputDefinitionMap = () => Map({
        od1: new OutputDefinition({
          _id: 'od1',
          outputType: 'radio',
          choices: List([new ChoiceDefinition()]),
        }),
      });
      survey.findNodeFromRefId = () => new NodeDefinition({ _id: 'node1' });
      survey.findPrecedingOutputDefinition = () => survey.getAllOutputDefinitionMap().toList();
      survey.refreshReplacer();
      const result = new ChildConditionDefinition({
        _id: 'ccd1',
        outputId: 'od1',
        value: '{{od1.chioce_value}}',
      }).validate(survey, 'dummyBranchId');
      expect(result.size).toBe(0);
    });
  });
});
