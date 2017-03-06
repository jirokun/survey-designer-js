/* eslint-env jest */
import Immutable from 'immutable';
import ReplaceUtil from '../lib/ReplaceUtil';
import OutputDefinition from '../lib/runtime/models/survey/questions/OutputDefinition';

describe('ReplaceUtil', () => {
  describe('name2Value', () => {
    it('answerが正しく置換されること', () => {
      const allOutputDefinitionMap = Immutable.fromJS({
        abcdefg: new OutputDefinition({
          _id: 'unique_id',
          name: 'abcdefg',
          label: 'ラベル',
          outputNo: '1-1-1',
        }),
      });
      const ru = new ReplaceUtil(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(ru.name2Value('abc${abcdefg#answer}def')).toBe('abc入力値def');
    });

    it('labelが正しく置換されること', () => {
      const allOutputDefinitionMap = Immutable.fromJS({
        abcdefg: new OutputDefinition({
          _id: 'unique_id',
          name: 'abcdefg',
          label: 'ラベル',
          outputNo: '1-1-1',
        }),
      });
      const ru = new ReplaceUtil(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(ru.name2Value('abc${abcdefg#label}def')).toBe('abcラベルdef');
    });
  });

  describe('outputNo2Name', () => {
    it('outputNoで入力した値がnameに置換される', () => {
      const allOutputDefinitionMap = Immutable.fromJS({
        abcdefg: new OutputDefinition({
          _id: 'unique_id',
          name: 'abcdefg',
          label: 'ラベル',
          outputNo: '1-1-1',
        }),
      });
      const ru = new ReplaceUtil(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(ru.outputNo2Name('abc${Q1-1-1#label}def')).toBe('abc${abcdefg#label}def');
    });
  });

  describe('outputNo2Nameとname2Valueの組み合わせ', () => {
    it('エディタで入力した値が正しく変換される', () => {
      const allOutputDefinitionMap = Immutable.fromJS({
        abcdefg: new OutputDefinition({
          _id: 'unique_id',
          name: 'abcdefg',
          label: 'ラベル',
          outputNo: '1-1-1',
        }),
      });
      const ru = new ReplaceUtil(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      const result1 = ru.outputNo2Name('${Q1-1-1#answer}');
      const result2 = ru.name2Value(result1);
      expect(result2).toBe('入力値');
    });
  });

  describe('name2OutputNo', () => {
    it('nameが正しくoutputNoに変換される', () => {
      const allOutputDefinitionMap = Immutable.fromJS({
        abcdefg: new OutputDefinition({
          _id: 'unique_id',
          name: 'abcdefg',
          label: 'ラベル',
          outputNo: '1-1-1',
        }),
      });
      const ru = new ReplaceUtil(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(ru.name2OutputNo('${abcdefg#answer}')).toBe('${Q1-1-1#answer}');
    });
  });
});
