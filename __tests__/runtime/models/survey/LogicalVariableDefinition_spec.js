/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import hasMultiplePagesAndLogicalVariablesSurvey from './survey_definition/hasMultiplePagesAndLogicalVariablesSurvey.json';

describe('LogicalVariableDefinition', () => {
  describe('createFunction', () => {
    it('同じページの数値記入の足し算の場合', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasMultiplePagesAndLogicalVariablesSurvey }).getSurvey();
      const page = survey.getPages().get(0);
      const logicalVariable = page.getLogicalVariables().get(0);
      const result = logicalVariable.createFunctionCode(survey, page);
      expect(result).toBe(`return (parseInt($('*[name=\"cj6u330kl00063j681zt4zvz1__value1\"]:enabled:visible').val(), 10) || 0)+(parseInt($('*[name=\"cj6u330kl00063j681zt4zvz1__value1\"]:enabled:visible').val(), 10) || 0)`);
    });

    it('前のページの数値記入とロジック変数と現在のページの数値記入の足し算の場合', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: hasMultiplePagesAndLogicalVariablesSurvey }).getSurvey();
      const page = survey.getPages().get(1);
      const logicalVariable = page.getLogicalVariables().get(0);
      const result = logicalVariable.createFunctionCode(survey, page);
      expect(result).toBe(`return (parseInt(answers['cj6u330kl00063j681zt4zvz1__value1'], 10) || 0)+(parseInt(answers['cj6u339cf000i3j68ir0kwb37'], 10) || 0)+(parseInt($('*[name=\"cj6u333tl000c3j686m1gkv3w__value1\"]:enabled:visible').val(), 10) || 0)`);
    });
  });
});
