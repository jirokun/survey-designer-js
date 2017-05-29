/* eslint-env jest */
import { Map } from 'immutable';
import SurveyDesignerState from '../../../../../../lib/runtime/models/SurveyDesignerState';
import VisibilityConditionDefinition from '../../../../../../lib/runtime/models/survey/questions/internal/VisibilityConditionDefinition';
import allOutputTypeJson from './ItemDefinition_allOutputType.json';

describe('ItemDefinition', () => {
  describe('matchesVisibilityCondition', () => {
    describe('条件設問で選択しているOutputDefinitionのoutputTypeがcheckbox', () => {
      it('選択しているが選ばれている場合', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        const outputDefinitions = survey.getAllOutputDefinitions();
        const targetOutputDefinition = outputDefinitions.get(0);
        const visibilityCondition = new VisibilityConditionDefinition({
          _id: 'vcd1',
          outputDefinitionId: targetOutputDefinition.getId(),
          operator: '!!',
          value: 'true',
        });
        survey = survey.updateIn(['pages', 0, 'questions', 1, 'items', 0], item => item.set('visibilityCondition', visibilityCondition));
        survey.refreshReplacer({});
        const item = survey.getIn(['pages', 0, 'questions', 1, 'items', 0]);
        expect(targetOutputDefinition.getOutputType()).toBe('checkbox');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '1' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '0' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(false);
      });

      it('選択していないが選ばれている場合', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        const outputDefinitions = survey.getAllOutputDefinitions();
        const targetOutputDefinition = outputDefinitions.get(0);
        const visibilityCondition = new VisibilityConditionDefinition({
          _id: 'vcd1',
          outputDefinitionId: targetOutputDefinition.getId(),
          operator: '!',
          value: null,
        });
        survey = survey.updateIn(['pages', 0, 'questions', 1, 'items', 0], item => item.set('visibilityCondition', visibilityCondition));
        survey.refreshReplacer({});
        const item = survey.getIn(['pages', 0, 'questions', 1, 'items', 0]);
        expect(targetOutputDefinition.getOutputType()).toBe('checkbox');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '1' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '0' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(true);
      });
    });

    describe('条件設問で選択しているOutputDefinitionのoutputTypeがradio', () => {
      it('選択しているが選ばれている場合', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        const outputDefinitions = survey.getAllOutputDefinitions();
        const targetOutputDefinition = outputDefinitions.get(1);
        const visibilityCondition = new VisibilityConditionDefinition({
          _id: 'vcd1',
          outputDefinitionId: targetOutputDefinition.getId(),
          operator: '!!',
          value: 'true',
        });
        survey = survey.updateIn(['pages', 0, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', visibilityCondition));
        survey.refreshReplacer({});
        const item = survey.getIn(['pages', 0, 'questions', 0, 'items', 0]);
        expect(targetOutputDefinition.getOutputType()).toBe('radio');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '1' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '0' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(false);
      });

      it('選択していないが選ばれている場合', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        const outputDefinitions = survey.getAllOutputDefinitions();
        const targetOutputDefinition = outputDefinitions.get(1);
        const visibilityCondition = new VisibilityConditionDefinition({
          _id: 'vcd1',
          outputDefinitionId: targetOutputDefinition.getId(),
          operator: '!',
          value: null,
        });
        survey = survey.updateIn(['pages', 0, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', visibilityCondition));
        survey.refreshReplacer({});
        const item = survey.getIn(['pages', 0, 'questions', 0, 'items', 0]);
        expect(targetOutputDefinition.getOutputType()).toBe('radio');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '1' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '0' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(true);
      });
    });

    describe('条件設問で選択しているOutputDefinitionのoutputTypeがnumber', () => {
      function getTargetOutputDefinition(survey) {
        const outputDefinitions = survey.getAllOutputDefinitions();
        return outputDefinitions.get(2);
      }
      function getSurvey(comparisonType, operator, value) {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        const targetOutputDefinition = getTargetOutputDefinition(survey);
        const visibilityCondition = new VisibilityConditionDefinition({
          _id: 'vcd1',
          outputDefinitionId: targetOutputDefinition.getId(),
          comparisonType,
          operator,
          value,
        });
        survey = survey.updateIn(['pages', 0, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', visibilityCondition));
        survey.refreshReplacer({});
        return survey;
      }
      function getItem(survey) {
        return survey.getIn(['pages', 0, 'questions', 0, 'items', 0]);
      }

      it('fixedValueと==が選ばれている場合', () => {
        const survey = getSurvey('fixedValue', '==', '10');
        const item = getItem(survey);
        const targetOutputDefinition = getTargetOutputDefinition(survey);
        expect(targetOutputDefinition.getOutputType()).toBe('number');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '10' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '0' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(false);
      });

      it('fixedValueと!=が選ばれている場合', () => {
        const survey = getSurvey('fixedValue', '!=', '10');
        const item = getItem(survey);
        const targetOutputDefinition = getTargetOutputDefinition(survey);
        expect(targetOutputDefinition.getOutputType()).toBe('number');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '10' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '0' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(true);
      });

      it('fixedValueと<が選ばれている場合', () => {
        const survey = getSurvey('fixedValue', '<', '10');
        const item = getItem(survey);
        const targetOutputDefinition = getTargetOutputDefinition(survey);
        expect(targetOutputDefinition.getOutputType()).toBe('number');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '10' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '9' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '9.9' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '0' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(false);
      });

      it('fixedValueと<=が選ばれている場合', () => {
        const survey = getSurvey('fixedValue', '<=', '10');
        const item = getItem(survey);
        const targetOutputDefinition = getTargetOutputDefinition(survey);
        expect(targetOutputDefinition.getOutputType()).toBe('number');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '11' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '10' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '9.9' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(false);
      });

      it('fixedValueと>が選ばれている場合', () => {
        const survey = getSurvey('fixedValue', '>', '10');
        const item = getItem(survey);
        const targetOutputDefinition = getTargetOutputDefinition(survey);
        expect(targetOutputDefinition.getOutputType()).toBe('number');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '11' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '10' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(false);
      });

      it('fixedValueと>=が選ばれている場合', () => {
        const survey = getSurvey('fixedValue', '>=', '10');
        const item = getItem(survey);
        const targetOutputDefinition = getTargetOutputDefinition(survey);
        expect(targetOutputDefinition.getOutputType()).toBe('number');
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '11' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '10' }))).toBe(true);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '9.9' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: '' }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map({ [targetOutputDefinition.getName()]: null }))).toBe(false);
        expect(item.matchesVisibilityCondition(survey, Map())).toBe(false);
      });

      it('answerValueと==が選ばれている場合', () => {
        const survey = getSurvey('answerValue', '==', '{{cj2xe2p3a000q3k67smqup7ic.answer}}');
        const item = getItem(survey);
        const targetOutputDefinition = getTargetOutputDefinition(survey);
        const answers = {
          [targetOutputDefinition.getName()]: '10',
        };
        survey.refreshReplacer(answers);
        expect(targetOutputDefinition.getOutputType()).toBe('number');
        expect(item.matchesVisibilityCondition(survey, Map(answers))).toBe(true);
      });
    });
  });
});

