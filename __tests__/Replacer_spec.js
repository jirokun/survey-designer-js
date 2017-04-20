/* eslint-env jest */
import Immutable, { List } from 'immutable';
import Replacer from '../lib/Replacer';
import OutputDefinition from '../lib/runtime/models/survey/questions/internal/OutputDefinition';
import ChoiceDefinition from '../lib/runtime/models/survey/questions/internal/ChoiceDefinition';
import RadioQuestionDefinition from '../lib/runtime/models/survey/questions/RadioQuestionDefinition';
import ItemDefinition from '../lib/runtime/models/survey/questions/internal/ItemDefinition';
import SurveyDesignerState from '../lib/runtime/models/SurveyDesignerState';
import sample1 from './runtime/models/sample1.json';
import referenceAfterQuestionSurvey from './Replacer_referenceAfterQuestionSurvey.json';

describe('Replacer', () => {
  let state;
  beforeAll(() => {
    state = SurveyDesignerState.createFromJson(sample1);
  });

  describe('id2Value', () => {
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
        { abcdefg: '入力値' },
      );
      expect(replacer.id2Value('abc{{unique_id.answer}}def')).toBe('abc入力値def');
    });

    it('answer_labelが正しく置換されること', () => {
      const allOutputDefinitionMap = Immutable.fromJS({
        abcdefg: new OutputDefinition({
          _id: 'unique_id',
          outputType: 'radio',
          name: 'abcdefg',
          label: 'ラベル',
          outputNo: '1-1-1',
          choices: List().push(new ChoiceDefinition({
            _id: 'unique_id2',
            label: '選択肢1',
            value: 'value1',
          })),
        }),
      });
      const replacer = new Replacer(
        allOutputDefinitionMap,
        { abcdefg: 'value1' },
      );
      expect(replacer.id2Value('abc{{unique_id.answer_label}}def')).toBe('abc選択肢1def');
    });
  });

  describe('no2Id', () => {
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
        { abcdefg: '入力値' },
      );
      expect(replacer.no2Id('abc{{1-1-1.answer}}def')).toBe('abc{{unique_id.answer}}def');
    });
  });

  describe('no2Idとid2Valueの組み合わせ', () => {
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
        { abcdefg: '入力値' },
      );
      const result1 = replacer.no2Id('{{1-1-1.answer}}');
      const result2 = replacer.id2Value(result1);
      expect(result2).toBe('入力値');
    });
  });

  describe('id2No', () => {
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
        { abcdefg: '入力値' },
      );
      expect(replacer.id2No('{{unique_id.answer}}')).toBe('{{1-1-1.answer}}');
    });
  });

  describe('validate', () => {
    it('参照文字列が含まれていない', () => {
      const replacer = state.getSurvey().refreshReplacer();
      expect(replacer.validate('{{aaa.labe}}', state.getSurvey().getAllOutputDefinitions())).toBe(true);
    });

    it('存在する設問の参照文字列が含まれている(answer, answer_label)', () => {
      const newSurvey = state.getSurvey().updateIn(['pages', 0, 'questions'], questions =>
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
        )));
      const replacer = newSurvey.refreshReplacer();
      expect(replacer.validate(`
        {{I001.answer}}
        {{r1.answer_label}}`,
        newSurvey.getAllOutputDefinitions())).toBe(true);
    });

    it('存在しない設問の参照文字列が含まれている(answer, answer_label)', () => {
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
        ))).refreshReplacer();
      expect(replacer.validate('{{9__value1.answer}}', state.getSurvey().getAllOutputDefinitions())).toBe(false);
      expect(replacer.validate('{{9__value1.answer_label}}', state.getSurvey().getAllOutputDefinitions())).toBe(false);
    });

    it('自ページよりも後の設問を参照している', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: referenceAfterQuestionSurvey }).getSurvey();
      const replacer = survey.refreshReplacer();
      expect(replacer.validate('{{cj1qfeifo000f3j66hacqvhg9.answer}}', state.getSurvey().getAllOutputDefinitions())).toBe(false);
    });
  });
});
