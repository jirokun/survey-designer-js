/* eslint-env jest */
import Immutable, { List } from 'immutable';
import Replacer from '../lib/Replacer';
import OutputDefinition from '../lib/runtime/models/survey/questions/internal/OutputDefinition';
import ChoiceDefinition from '../lib/runtime/models/survey/questions/internal/ChoiceDefinition';
import RadioQuestionDefinition from '../lib/runtime/models/survey/questions/RadioQuestionDefinition';
import ItemDefinition from '../lib/runtime/models/survey/questions/internal/ItemDefinition';
import SurveyDesignerState from '../lib/runtime/models/SurveyDesignerState';
import sample1 from './runtime/models/sample1.json';

describe('Replacer', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
  });

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
      const replacer = new Replacer(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(replacer.name2Value('abc{{abcdefg.answer}}def')).toBe('abc入力値def');
    });

    it('choiceが正しく置換されること', () => {
      const allOutputDefinitionMap = Immutable.fromJS({
        abcdefg: new OutputDefinition({
          _id: 'unique_id',
          name: 'abcdefg',
          label: 'ラベル',
          outputNo: '1-1-1',
          choices: List().push(new ChoiceDefinition({ _id: 'unique_id1', label: 'label1', value: 'value1' })),
        }),
      });
      const replacer = new Replacer(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(replacer.name2Value('abc {{abcdefg.choice.unique_id1.value}} def')).toBe('abc value1 def');
      expect(replacer.name2Value('abc {{abcdefg.choice.unique_id1.label}} def')).toBe('abc label1 def');
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
      const replacer = new Replacer(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(replacer.name2Value('abc{{abcdefg.label}}def')).toBe('abcラベルdef');
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
      const replacer = new Replacer(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(replacer.outputNo2Name('abc{{1-1-1.label}}def')).toBe('abc{{abcdefg.label}}def');
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
      const replacer = new Replacer(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      const result1 = replacer.outputNo2Name('{{1-1-1.answer}}');
      const result2 = replacer.name2Value(result1);
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
      const replacer = new Replacer(
        allOutputDefinitionMap,
        { '1-1-1': 'abcdefg' },
        { abcdefg: '入力値' },
      );
      expect(replacer.name2OutputNo('{{abcdefg.answer}}')).toBe('{{1-1-1.answer}}');
    });
  });

  describe('validate', () => {
    it('参照文字列が含まれていない', () => {
      const replacer = state.getSurvey().getReplacer();
      expect(replacer.validate('{{aaa.labe}}')).toBe(true);
    });

    it('存在する設問の参照文字列が含まれている(answer, label, choice-label, choice-value)', () => {
      const replacer = state.getSurvey().updateIn(['pages', 0, 'questions'], questions =>
        questions.push(new RadioQuestionDefinition(
          {
            _id: 'r1',
            index: 0,
            items: List().push(new ItemDefinition({
              _id: 'item1',
              plainLabel: 'label1',
              value: 'value1',
            })),
          },
        ))).getReplacer();
      expect(replacer.validate(`{{1__value1.answer}}
        {{2__value1.label}}
        {{r1.choice.item1.label}}
        {{r1.choice.item1.value}}`)).toBe(true);
    });

    it('存在しない設問の参照文字列が含まれている(answer, label, choice-label, choice-value)', () => {
      const replacer = state.getSurvey().updateIn(['pages', 0, 'questions'], questions =>
        questions.push(new RadioQuestionDefinition(
          {
            _id: 'r1',
            index: 0,
            items: List().push(new ItemDefinition({
              _id: 'item1',
              plainLabel: 'label1',
              value: 'value1',
            })),
          },
        ))).getReplacer();
      expect(replacer.validate('{{9__value1.answer}}')).toBe(false);
      expect(replacer.validate('{{9__value1.label}}')).toBe(false);
      expect(replacer.validate('{{r9.choice.item1.label}}')).toBe(false);
      expect(replacer.validate('{{r9.choice.item1.value}}')).toBe(false);
    });
  });
});
