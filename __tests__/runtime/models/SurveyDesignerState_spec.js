/* eslint-env jest */
import SurveyDesignerState from '../../../lib/runtime/models/SurveyDesignerState';
import PageDefinition from '../../../lib/runtime/models/survey/PageDefinition';
import json from './SurveyDesignerState.json';

describe('SurveyDesignerState', () => {
  describe('createFromJson', () => {
    it('ロードできる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: json }).getSurvey();
      const pages = survey.getPages();
      pages.forEach(page => expect(page instanceof PageDefinition).toBe(true));

      // NumberValidationRuleが復元できている
      const numberValidationRuleMap = pages.get(0).getQuestions().get(0).getNumberValidationRuleMap().get('cj6kee1sg00073j68j2v9clne').get(0);
      expect(numberValidationRuleMap.getId()).toBe('cj6kr0dn000163j685rrx2x7g');
      expect(numberValidationRuleMap.getNumberValidations().get(0).getId()).toBe('cj6kr0dn000173j68jniau8a5');
      expect(numberValidationRuleMap.getNumberValidations().get(0).getValue()).toBe('1');
      expect(numberValidationRuleMap.getNumberValidations().get(0).getOperator()).toBe('==');
    });
  });
});
