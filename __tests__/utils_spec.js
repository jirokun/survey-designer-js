/* eslint-env jest */
import { Record } from 'immutable';
import BaseQuestionDefinition from '../lib/runtime/models/survey/questions/internal/BaseQuestionDefinition';
import NumberValidationDefinition from '../lib/runtime/models/survey/questions/internal/NumberValidationDefinition';
import NumberValidationRuleDefinition from '../lib/runtime/models/survey/questions/internal/NumberValidationRuleDefinition';
import { cloneRecord } from '../lib/utils';

const ID_SIZE = 25;
describe('utils', () => {
  describe('cloneRecord', () => {
    it('複数層のrecordをコピーできる', () => {
      const record = new NumberValidationRuleDefinition({ _id: 'NVRD' })
        .update('numberValidations', list => list.push(new NumberValidationDefinition({ _id: 'NV', value: 'HOGE' })));
      const result = cloneRecord(record);
      expect(result.getId()).not.toBe('NVRD');
      expect(result.getId().length).toBe(ID_SIZE);
      expect(result.getIn(['numberValidations', 0, '_id'])).not.toBe('NV');
      expect(result.getIn(['numberValidations', 0, '_id']).length).toBe(ID_SIZE);
      expect(result.getIn(['numberValidations', 0, 'value'])).toBe('HOGE');
    });

    it('コピーしたデータの中にIDの参照がある場合は書き換えたものに置き換わる', () => {
      const record = new NumberValidationRuleDefinition({ _id: 'NVRD' })
        .update('numberValidations', list => list.push(new NumberValidationDefinition({ _id: 'NV', value: '{{NVRD}}{{NVRD}}{{NV}}' })));
      const result = cloneRecord(record);
      const newNvId = result.getIn(['numberValidations', 0, '_id']);
      expect(result.getIn(['numberValidations', 0, 'value'])).toBe(`{{${result.getId()}}}{{${result.getId()}}}{{${newNvId}}}`);
    });

    it('Mapの項目がある場合も問題なく変換できる', () => {
      const question = new BaseQuestionDefinition({ _id: 'dummy' })
        .addNumberValidation('ODID1');
      const result = cloneRecord(question);
      expect(result.getIn(['numberValidationRuleMap', 'ODID1', 0, 'numberValidations', 0, '_id'])).not.toBe(
        question.getIn(['numberValidationRuleMap', 'ODID1', 0, 'numberValidations', 0, '_id']),
      );
      expect(result.getIn(['numberValidationRuleMap', 'ODID1', 0, 'numberValidations', 0, '_id']).length).toBe(ID_SIZE);
    });
  });
});
