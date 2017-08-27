/* eslint-env jest */
import { List, Set, is } from 'immutable';
import SurveyDesignerState from '../../../../../lib/runtime/models/SurveyDesignerState';
import BaseQuestionDefinition from '../../../../../lib/runtime/models/survey/questions/internal/BaseQuestionDefinition';
import ItemDefinition from '../../../../../lib/runtime/models/survey/questions/internal/ItemDefinition';
import NumberValidationRuleDefinition from '../../../../../lib/runtime/models/survey/questions/internal/NumberValidationRuleDefinition';
import NumberValidationDefinition from '../../../../../lib/runtime/models/survey/questions/internal/NumberValidationDefinition';
import MultiNumberQuestionDefinition from '../../../../../lib/runtime/models/survey/questions/MultiNumberQuestionDefinition';
import json from './BaseQuestionDefinition.json';

const ID_LENGTH = 25;

describe('BaseQuestionDefinition', () => {
  describe('addNumberValidation', () => {
    it('存在しないnumberValidationRuleMapのnumverValidationを追加できる', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' });
      const newQuestion = question.addNumberValidation('ODID');
      expect(newQuestion.getIn(['numberValidationRuleMap', 'ODID'])).not.toBeNull();
      expect(newQuestion.getIn(['numberValidationRuleMap', 'ODID']).size).toBe(1);
      expect(newQuestion.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations']).size).toBe(1);
      expect(newQuestion.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0]).getId()).not.toBeNull();
      expect(newQuestion.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0]).getValue()).toBe('');
      expect(newQuestion.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0]).getOperator()).toBe('');
    });

    it('存在しているnumberValidationRuleMapのnumverValidationを追加できる', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' });
      const newQuestion1 = question.addNumberValidation('ODID');
      const firstNumberValidationId = newQuestion1.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0]).getId();
      const newQuestion2 = newQuestion1.addNumberValidation('ODID');
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID'])).not.toBeNull();
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID']).size).toBe(1);
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations']).size).toBe(2);
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0]).getId()).toBe(firstNumberValidationId);
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 1]).getId()).not.toBe(firstNumberValidationId);
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 1]).getValue()).toBe('');
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 1]).getOperator()).toBe('');
    });

    it('存在しているnumberValidationRuleMapとは異なるoutputDefinitionIdのnumverValidationを追加できる', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' });
      const newQuestion1 = question.addNumberValidation('ODID1');
      const newQuestion2 = newQuestion1.addNumberValidation('ODID2');
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID1']).size).toBe(1);
      expect(newQuestion2.getIn(['numberValidationRuleMap', 'ODID2']).size).toBe(1);
    });
  });

  describe('removeNumberValidation', () => {
    it('1つしかないNumberValidationを削除するとnumberValidationRuleMapが削除される', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' });
      const question1 = question.addNumberValidation('ODID');
      const numberValidationId = question1.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0, '_id']);
      const question2 = question1.removeNumberValidation('ODID', numberValidationId);
      expect(question2.getIn(['numberValidationRuleMap', 'ODID'])).toBeUndefined();
    });

    it('2つあるNumberValidationを1つ削除することができる', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' });
      const question1 = question.addNumberValidation('ODID').addNumberValidation('ODID');
      const numberValidation1Id = question1.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0, '_id']);
      const numberValidation2Id = question1.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 1, '_id']);

      const question2 = question1.removeNumberValidation('ODID', numberValidation1Id);
      expect(question2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations']).size).toBe(1);
      expect(question2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0, '_id'])).not.toBe(numberValidation1Id);

      const question3 = question1.removeNumberValidation('ODID', numberValidation2Id);
      expect(question3.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations']).size).toBe(1);
      expect(question3.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0, '_id'])).not.toBe(numberValidation2Id);
    });
  });

  describe('updateNumberValidationAttribute', () => {
    it('指定したNumberValidationの属性が更新できる', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' }).addNumberValidation('ODID').addNumberValidation('ODID');
      const numberValidationId1 = question.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0, '_id']);
      const numberValidationId2 = question.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 1, '_id']);
      const question2 = question
        .updateNumberValidationAttribute('ODID', numberValidationId1, 'value', 'HOGE1')
        .updateNumberValidationAttribute('ODID', numberValidationId2, 'value', 'HOGE2');
      expect(question2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 0, 'value'])).toBe('HOGE1');
      expect(question2.getIn(['numberValidationRuleMap', 'ODID', 0, 'numberValidations', 1, 'value'])).toBe('HOGE2');
    });

    it('validationTypeInQuestionが正しく裁判される', () => {
      let question = new MultiNumberQuestionDefinition({ _id: 'dummy' })
        .update('items', items => items.push(new ItemDefinition({ _id: 'ODID1' })))
        .update('items', items => items.push(new ItemDefinition({ _id: 'ODID2' })))
        .update('items', items => items.push(new ItemDefinition({ _id: 'ODID3' })));
      question = question.addNumberValidation('ODID1').addNumberValidation('ODID2').addNumberValidation('ODID3');
      const numberValidationRule1 = question.getNumberValidationRuleMap().get('ODID1').get(0);
      const numberValidationRule2 = question.getNumberValidationRuleMap().get('ODID2').get(0);
      const numberValidationRule3 = question.getNumberValidationRuleMap().get('ODID3').get(0);
      expect(numberValidationRule1.getValidationTypeInQuestion()).toBe(1);
      expect(numberValidationRule2.getValidationTypeInQuestion()).toBe(1);
      expect(numberValidationRule3.getValidationTypeInQuestion()).toBe(1);
      question = question.updateNumberValidationAttribute('ODID1', numberValidationRule1.getNumberValidations().get(0).getId(), 'value', '1');
      expect(question.getNumberValidationRuleMap().get('ODID1').get(0).getValidationTypeInQuestion()).toBe(2);
      expect(question.getNumberValidationRuleMap().get('ODID2').get(0).getValidationTypeInQuestion()).toBe(1);
      expect(question.getNumberValidationRuleMap().get('ODID3').get(0).getValidationTypeInQuestion()).toBe(1);

      question = question.updateNumberValidationAttribute('ODID2', numberValidationRule1.getNumberValidations().get(0).getId(), 'value', '1');
      expect(question.getNumberValidationRuleMap().get('ODID1').get(0).getValidationTypeInQuestion()).toBe(2);
      expect(question.getNumberValidationRuleMap().get('ODID2').get(0).getValidationTypeInQuestion()).toBe(2);
      expect(question.getNumberValidationRuleMap().get('ODID3').get(0).getValidationTypeInQuestion()).toBe(1);

      question = question.updateNumberValidationAttribute('ODID2', numberValidationRule1.getNumberValidations().get(0).getId(), 'value', '2');
      expect(question.getNumberValidationRuleMap().get('ODID1').get(0).getValidationTypeInQuestion()).toBe(2);
      expect(question.getNumberValidationRuleMap().get('ODID2').get(0).getValidationTypeInQuestion()).toBe(3);
      expect(question.getNumberValidationRuleMap().get('ODID3').get(0).getValidationTypeInQuestion()).toBe(1);
    });
  });

  describe('findNumberValidationRule', () => {
    it('Questionに紐付くNumberValidationRuleをnumberValidationIdから検索できる', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' })
        .addNumberValidation('ODID1')
        .addNumberValidation('ODID2')
        .addNumberValidation('ODID1');
      const rule = question.getIn(['numberValidationRuleMap', 'ODID1', 0]);
      const actual = question.findNumberValidationRule(rule.getId());
      expect(is(rule, actual)).toBe(true);
    });
  });

  describe('getUniquedNumberValidationRules', () => {
    it('validationTypeInQuestionでユニーク化したNumberValidatinoRuleのListを取得できる ', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' }).addNumberValidation('ODID1').addNumberValidation('ODID2');
      expect(question.getUniquedNumberValidationRules().size).toBe(1);
      const question2 = question.setIn(['numberValidationRuleMap', 'ODID2', 0, 'numberValidations', 0, 'value'], 'hoge');
      expect(question2.getUniquedNumberValidationRules().size).toBe(2);
    });
  });

  describe('copyNumberValidationRules', () => {
    it('コピーできる', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: json }).getSurvey();
      let question = survey.getPages().get(0).getQuestions().get(0);
      const ods = question.getOutputDefinitions();
      question = question.copyNumberValidationRules(survey, [
        { sourceNumberValidationRuleId: 'cj6kr0dn000163j685rrx2x7g', targetOutputDefinitionId: ods.get(1).getId() },
        { sourceNumberValidationRuleId: 'cj6kr0dn000163j685rrx2x7g', targetOutputDefinitionId: ods.get(2).getId() },
      ]);
      expect(question.getNumberValidationRuleMap().get(ods.get(1).getId())).not.toBe(undefined);
      const numberValidationRule1 = question.getNumberValidationRuleMap().get(ods.get(1).getId()).get(0);
      expect(numberValidationRule1.getNumberValidations().get(0).getId()).not.toBe('cj6kr0dn000173j68jniau8a5');
      expect(numberValidationRule1.getNumberValidations().get(0).getId().length).toBe(ID_LENGTH);
      expect(numberValidationRule1.getNumberValidations().get(0).getOperator()).toBe('==');
      expect(numberValidationRule1.getNumberValidations().get(0).getValue()).toBe('1');

      const numberValidationRule2 = question.getNumberValidationRuleMap().get(ods.get(2).getId()).get(0);
      expect(numberValidationRule2.getNumberValidations().get(0).getId()).not.toBe('cj6kr0dn000173j68jniau8a5');
      expect(numberValidationRule2.getNumberValidations().get(0).getId().length).toBe(ID_LENGTH);
      expect(numberValidationRule2.getNumberValidations().get(0).getOperator()).toBe('==');
      expect(numberValidationRule2.getNumberValidations().get(0).getValue()).toBe('1');
    });
  });

  describe('equals', () => {
    it('値が同じであればisがtrueを返す', () => {
      expect(is(NumberValidationRuleDefinition.create(), NumberValidationRuleDefinition.create())).toBe(true);
    });

    it('Setにequalsがtrueのものを渡すと同値として判断する', () => {
      let set = Set();
      set = set.add((NumberValidationRuleDefinition.create()));
      set = set.add((NumberValidationRuleDefinition.create()));
      set = set.add((NumberValidationRuleDefinition.create().update('numberValidations', v => v.push(NumberValidationDefinition.create()))));
      expect(set.size).toBe(2);
    });
  });

  describe('validate', () => {
    it('NumberValidationRuleの値が設定されていない場合にvalidateでエラーが返る', () => {
      let survey = SurveyDesignerState.createFromJson({ survey: json }).getSurvey();
      const question = survey.getPages().get(0).getQuestions().get(0);
      const ods = question.getOutputDefinitions();
      survey = survey.updateIn(['pages', 0, 'questions', 0], q => q.updateNumberValidationAttribute(ods.get(0).getId(), 'cj6kr0dn000173j68jniau8a5', 'value', ''));
      survey.refreshReplacer();
      const result = survey.validate();
      expect(result.size).toBe(2);
      expect(result.get(1)).toBe('設問 1-1 数値制限で値が設定されていません');
    });

    it('NumberValidationRuleの比較方法が設定されていない場合にvalidateでエラーが返る', () => {
      let survey = SurveyDesignerState.createFromJson({ survey: json }).getSurvey();
      const question = survey.getPages().get(0).getQuestions().get(0);
      const ods = question.getOutputDefinitions();
      survey = survey.updateIn(['pages', 0, 'questions', 0], q => q.updateNumberValidationAttribute(ods.get(0).getId(), 'cj6kr0dn000173j68jniau8a5', 'operator', ''));
      survey.refreshReplacer();
      const result = survey.validate();
      expect(result.size).toBe(2);
      expect(result.get(1)).toBe('設問 1-1 数値制限で比較方法が設定されていません');
    });

    it('NumberValidationRuleの値が存在しない参照の場合にvalidateでエラーが返る', () => {
      let survey = SurveyDesignerState.createFromJson({ survey: json }).getSurvey();
      const question = survey.getPages().get(0).getQuestions().get(0);
      const ods = question.getOutputDefinitions();
      survey = survey.updateIn(['pages', 0, 'questions', 0], q => q.updateNumberValidationAttribute(ods.get(0).getId(), 'cj6kr0dn000173j68jniau8a5', 'value', '{{dummy.answer}}'));
      survey.refreshReplacer();
      const result = survey.validate();
      expect(result.size).toBe(2);
      expect(result.get(1)).toBe('設問 1-1 数値制限で不正な参照が設定されています');
    });
  });
});
