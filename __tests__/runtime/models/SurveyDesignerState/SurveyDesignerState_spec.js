/* eslint-env jest */
import SurveyDesignerState from '../../../../lib/runtime/models/SurveyDesignerState';
import PageDefinition from '../../../../lib/runtime/models/survey/PageDefinition';
import json from './SurveyDesignerState.json';
import StateWithPersonalInfoQuestionJson from './SurveyDesignerStateWithPersonalInfoQuestion.json';

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

    it('個人情報設問のロードできる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: StateWithPersonalInfoQuestionJson }).getSurvey();
      const pages = survey.getPages();
      pages.forEach(page => expect(page instanceof PageDefinition).toBe(true));

      // PersonalInfoQuestionが復元できている
      const personalInfoQUestion = pages.get(0).getQuestions().get(0);
      expect(personalInfoQUestion.getId()).toBe('cj987gwlo00043h73qdwllvgf');
      const items = personalInfoQUestion.getItems();
      expect(items.size).toBe(23);
      expect(items.get(0).getId()).toBe('cj987gwlp00053h735nqka7dv');
      expect(items.get(0).getRowType()).toBe('NameRow');
      expect(items.get(22).getId()).toBe('cj987gwlp000r3h73n6riir96');
      expect(items.get(22).getRowType()).toBe('InterviewRow');
    });
  });
});
