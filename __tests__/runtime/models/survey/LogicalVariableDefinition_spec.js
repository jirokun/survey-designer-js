/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import hasMultiplePagesAndLogicalVariablesSurvey from './survey_definition/hasMultiplePagesAndLogicalVariablesSurvey.json';
import referencePreviousPageQuestion from './LogicalVariableDefinition_referencePreviousPageQuestion.json';

describe('LogicalVariableDefinition', () => {
  describe('createFunction', () => {
    it('同じページの数値記入の足し算の場合', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasMultiplePagesAndLogicalVariablesSurvey }).getSurvey();
      const page = survey.getPages().get(0);
      const logicalVariable = page.getLogicalVariables().get(0);
      const result = logicalVariable.createFunctionCode(survey, page);
      expect(result).toBe("return (parseInt(($('*[name=\"cj6u330kl00063j681zt4zvz1__value1\"]:enabled:visible').val() || '').replace(/[０-９]/g, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 65248); }), 10) || 0)+(parseInt(($('*[name=\"cj6u330kl00063j681zt4zvz1__value1\"]:enabled:visible').val() || '').replace(/[０-９]/g, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 65248); }), 10) || 0)");
    });

    it('前のページの数値記入とロジック変数と現在のページの数値記入の足し算の場合', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasMultiplePagesAndLogicalVariablesSurvey }).getSurvey();
      const page = survey.getPages().get(1);
      const logicalVariable = page.getLogicalVariables().get(0);
      const result = logicalVariable.createFunctionCode(survey, page);
      expect(result).toBe("return (parseInt(answers['cj6u330kl00063j681zt4zvz1__value1'], 10) || 0)+(parseInt(answers['cj6u339cf000i3j68ir0kwb37'], 10) || 0)+(parseInt(($('*[name=\"cj6u333tl000c3j686m1gkv3w__value1\"]:enabled:visible').val() || '').replace(/[０-９]/g, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 65248); }), 10) || 0)");
    });
  });

  describe('validate', () => {
    it('設問の参照が現在のページよりも前のものだった場合、エラーが返る', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: referencePreviousPageQuestion }).getSurvey();
      const page = survey.getPages().get(0);
      const logicalVariable = page.getLogicalVariables().get(0);
      const result = logicalVariable.validate(survey, page);
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('000で選択されていない設問があります');
    });

    it('設問の参照が現在のページのものだった場合エラーが返らない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: referencePreviousPageQuestion }).getSurvey()
        .setIn(['pages', 0, 'logicalVariables', 0, 'operands', 0], 'cj98dru6q00053j73qj6mi3o8')
        .setIn(['pages', 0, 'logicalVariables', 0, 'operands', 1], 'cj98dru6q00053j73qj6mi3o8');
      const page = survey.getPages().get(0);
      const logicalVariable = page.getLogicalVariables().get(0);
      const result = logicalVariable.validate(survey, page);
      expect(result.size).toBe(0);
    });

    it('operandの1つ目が現在のページよりも前のものだった場合、エラーが返る', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: referencePreviousPageQuestion }).getSurvey()
        .setIn(['pages', 0, 'logicalVariables', 0, 'operands', 0], 'cj98dru6q00053j73qj6mi3o8');
      const page = survey.getPages().get(0);
      const logicalVariable = page.getLogicalVariables().get(0);
      const result = logicalVariable.validate(survey, page);
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('000で選択されていない設問があります');
    });

    it('operandの2つ目が現在のページよりも前のものだった場合、エラーが返る', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: referencePreviousPageQuestion }).getSurvey()
        .setIn(['pages', 0, 'logicalVariables', 0, 'operands', 1], 'cj98dru6q00053j73qj6mi3o8');
      const page = survey.getPages().get(0);
      const logicalVariable = page.getLogicalVariables().get(0);
      const result = logicalVariable.validate(survey, page);
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('000で選択されていない設問があります');
    });
  });
});
