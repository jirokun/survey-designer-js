/* eslint-env jest */
import { List } from 'immutable';
import SurveyDesignerState from '../../../../../../lib/runtime/models/SurveyDesignerState';
import SurveyDefinition from '../../../../../../lib/runtime/models/survey/SurveyDefinition';
import OutputDefinition from '../../../../../../lib/runtime/models/survey/questions/internal/OutputDefinition';
import ChoiceDefinition from '../../../../../../lib/runtime/models/survey/questions/internal/ChoiceDefinition';
import VisibilityConditionDefinition from '../../../../../../lib/runtime/models/survey/questions/internal/VisibilityConditionDefinition';
import * as ItemVisibility from '../../../../../../lib/constants/ItemVisibility';
import allOutputTypeJson from './VisibilityConditionDefinition_allOutputType.json';

describe('VisibilityConditionDefinition', () => {
  describe('updateProperties', () => {
    // テストには実際には使わないがダミーとして
    const survey = new SurveyDefinition();
    survey.refreshReplacer();

    it('すべての項目が更新されること', () => {
      const vcd = new VisibilityConditionDefinition({
        _id: 'id1',
        outputDefinitionId: 'od1',
        comparisonType: 'fixedValue',
        value: '10',
        operator: '==',
        visibilityType: 'show',
      });

      const outputDefinitions = List([
        new OutputDefinition({ _id: 'od1', outputType: 'number' }),
        new OutputDefinition({ _id: 'od2', outputType: 'number' }),
      ]);

      const result = vcd.updateProperties(survey, outputDefinitions, {
        outputDefinitionId: 'od2',
        comparisonType: 'answerValue',
        value: '{{od1.answer_value}}',
        operator: '!=',
        visibilityType: 'hide',
      });
      expect(result.getId()).toBe('id1');
      expect(result.getOutputDefinitionId()).toBe('od2');
      expect(result.getComparisonType()).toBe('answerValue');
      expect(result.getValue()).toBe('{{od1.answer_value}}');
      expect(result.getOperator()).toBe('!=');
      expect(result.getVisibilityType()).toBe('hide');
    });

    it('条件設問がemptyならVisibilityConditionDefinition自体がnullになる', () => {
      const vcd = new VisibilityConditionDefinition({
        _id: 'id1',
        outputDefinitionId: 'outputDefinitionId1',
        comparisonType: 'fixedValue',
        value: '10',
        operator: '==',
        visibilityType: 'show',
      });
      const outputDefinitions = List();
      const result = vcd.updateProperties(survey, outputDefinitions, {
        outputDefinitionId: '',
      });
      expect(result).toBe(null);
    });

    it('存在しないoutputDefinitionIdを指定した場合はVisibilityConditionDefinition自体がnullになる', () => {
      const vcd = new VisibilityConditionDefinition({
        _id: 'id1',
        outputDefinitionId: 'outputDefinitionId1',
        comparisonType: 'fixedValue',
        value: '10',
        operator: '==',
        visibilityType: 'show',
      });
      const outputDefinitions = List();
      const result = vcd.updateProperties(survey, outputDefinitions, {
        outputDefinitionId: 'abce',
      });
      expect(result).toBe(null);
    });

    it('条件設問が変更され指定できない比較値タイプが設定されていた場合は比較値タイプ,value,operatorが空になる(outputTypeがradio,select以外)', () => {
      const vcd = new VisibilityConditionDefinition({
        _id: 'id1',
        outputDefinitionId: 'od1',
        comparisonType: 'fixedValue',
        value: '10',
        operator: '==',
        visibilityType: 'show',
      });
      const outputDefinitions = List([
        new OutputDefinition({ _id: 'od1', outputType: 'number' }),
        new OutputDefinition({ _id: 'od2', outputType: 'checkbox' }),
      ]);
      const result = vcd.updateProperties(survey, outputDefinitions, {
        outputDefinitionId: 'od2',
      });
      expect(result.getId()).toBe('id1');
      expect(result.getOutputDefinitionId()).toBe('od2');
      expect(result.getComparisonType()).toBe(null);
      expect(result.getValue()).toBe(null);
      expect(result.getOperator()).toBe(null);
      expect(result.getVisibilityType()).toBe('show');
    });

    ['radio', 'select'].forEach((type) => {
      it(`条件設問が変更され指定できない比較値タイプが設定されていた場合は比較値タイプ,valueが空にならない(outputTypが${type})`, () => {
        const vcd = new VisibilityConditionDefinition({
          _id: 'id1',
          outputDefinitionId: 'od1',
          comparisonType: null,
          value: '{{od1.answer_value}}',
          operator: '==',
          visibilityType: 'show',
        });
        const outputDefinitions = List([
          new OutputDefinition({ _id: 'od1', outputType: 'number' }),
          new OutputDefinition({ _id: 'od2', outputType: type }),
        ]);
        const result = vcd.updateProperties(survey, outputDefinitions, {
          outputDefinitionId: 'od2',
        });
        expect(result.getId()).toBe('id1');
        expect(result.getOutputDefinitionId()).toBe('od2');
        expect(result.getComparisonType()).toBe(null);
        expect(result.getValue()).toBe('{{od1.answer_value}}');
        expect(result.getOperator()).toBe('==');
        expect(result.getVisibilityType()).toBe('show');
      });

      it(`outputTypeが${type}の場合、比較値に選択肢を設定できる`, () => {
        const vcd = new VisibilityConditionDefinition({
          _id: 'id1',
          outputDefinitionId: 'od2',
          comparisonType: null,
          value: null,
          operator: '==',
          visibilityType: 'show',
        });
        const outputDefinitions = List([
          new OutputDefinition({
            _id: 'od1',
            outputType: 'number',
            name: 'odName1',
            outputNo: '1-1',
          }),
          new OutputDefinition({
            _id: 'od2',
            outputType: type,
            name: 'odName2',
            outputNo: '1-2',
            choices: List([new ChoiceDefinition({
              _id: 'choice1',
              label: 'ChoiceLabel',
              value: '1',
            })]),
          }),
        ]);
        // mock
        survey.getAllOutputDefinitions = () => outputDefinitions;
        survey.refreshReplacer();
        const result = vcd.updateProperties(survey, outputDefinitions, {
          value: '{{choice1.choice_value}}',
        });
        expect(result.getId()).toBe('id1');
        expect(result.getOutputDefinitionId()).toBe('od2');
        expect(result.getComparisonType()).toBe(null);
        expect(result.getValue()).toBe('{{choice1.choice_value}}');
        expect(result.getOperator()).toBe('==');
        expect(result.getVisibilityType()).toBe('show');
      });
    });

    it('comparisonTypeがfixedValueかつvalueに数値以外が入力された場合valueが空になる', () => {
      const vcd = new VisibilityConditionDefinition({
        _id: 'id1',
        outputDefinitionId: 'od1',
        comparisonType: 'fixedValue',
        value: '10',
        operator: '==',
        visibilityType: 'show',
      });
      const outputDefinitions = List([
        new OutputDefinition({ _id: 'od1', outputType: 'number' }),
        new OutputDefinition({ _id: 'od2', outputType: 'checkbox' }),
      ]);
      const result = vcd.updateProperties(survey, outputDefinitions, {
        value: 'a',
      });
      expect(result.getId()).toBe('id1');
      expect(result.getOutputDefinitionId()).toBe('od1');
      expect(result.getComparisonType()).toBe('fixedValue');
      expect(result.getValue()).toBe(null);
      expect(result.getOperator()).toBe('==');
      expect(result.getVisibilityType()).toBe('show');
    });

    it('comparisonTypeがanswerValueかつvalueに存在する参照値が入力された場合入力値が設定される', () => {
      const vcd = new VisibilityConditionDefinition({
        _id: 'id1',
        outputDefinitionId: 'od1',
        comparisonType: 'fixedValue',
        value: '10',
        operator: '==',
        visibilityType: 'show',
      });
      const outputDefinitions = List([
        new OutputDefinition({ _id: 'od1', outputType: 'number' }),
        new OutputDefinition({ _id: 'od2', outputType: 'checkbox' }),
      ]);
      const result = vcd.updateProperties(survey, outputDefinitions, {
        comparisonType: 'answerValue',
        value: '{{od1.answer_value}}',
      });
      expect(result.getId()).toBe('id1');
      expect(result.getOutputDefinitionId()).toBe('od1');
      expect(result.getComparisonType()).toBe('answerValue');
      expect(result.getValue()).toBe('{{od1.answer_value}}');
      expect(result.getOperator()).toBe('==');
      expect(result.getVisibilityType()).toBe('show');
    });

    it('comparisonTypeがanswerValueかつvalueに存在しない参照値が入力された場合valueが空になる', () => {
      const vcd = new VisibilityConditionDefinition({
        _id: 'id1',
        outputDefinitionId: 'od1',
        comparisonType: 'fixedValue',
        value: '10',
        operator: '==',
        visibilityType: 'show',
      });
      const outputDefinitions = List([
        new OutputDefinition({ _id: 'od1', outputType: 'number' }),
        new OutputDefinition({ _id: 'od2', outputType: 'checkbox' }),
      ]);
      const result = vcd.updateProperties(survey, outputDefinitions, {
        comparisonType: 'answerValue',
      });
      expect(result.getId()).toBe('id1');
      expect(result.getOutputDefinitionId()).toBe('od1');
      expect(result.getComparisonType()).toBe('answerValue');
      expect(result.getValue()).toBe(null);
      expect(result.getOperator()).toBe('==');
      expect(result.getVisibilityType()).toBe('show');
    });

    it('comparisonTypeに不正な文字列を設定した場合nullになる', () => {
      const vcd = new VisibilityConditionDefinition({
        _id: 'id1',
        outputDefinitionId: 'od1',
        comparisonType: 'fixedValue',
        value: '10',
        operator: '==',
        visibilityType: 'show',
      });
      const outputDefinitions = List([
        new OutputDefinition({ _id: 'od1', outputType: 'number' }),
        new OutputDefinition({ _id: 'od2', outputType: 'checkbox' }),
      ]);
      const result = vcd.updateProperties(survey, outputDefinitions, {
        comparisonType: 'abc',
      });
      expect(result.getId()).toBe('id1');
      expect(result.getComparisonType()).toBe(null);
    });
  });

  describe('validate', () => {
    it('条件設問が存在しない場合', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey()
        .updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: 'dummy',
        })));
      survey.refreshReplacer();
      const errors = survey.validate();
      expect(errors.size).toBe(2);
      expect(errors.get(0).getType()).toBe('ERROR');
      expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      expect(errors.get(1).getType()).toBe('ERROR');
      expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で条件設問の値が不正です');
    });

    it('比較方法が選択されていない場合', () => {
      let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
      survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
        outputDefinitionId: survey.getAllOutputDefinitions().get(0).getId(),
      })));
      survey.refreshReplacer();
      const errors = survey.validate();
      expect(errors.size).toBe(2);
      expect(errors.get(0).getType()).toBe('ERROR');
      expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      expect(errors.get(1).getType()).toBe('ERROR');
      expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で比較方法が不正です');
    });

    it('動作種別が選択されていない場合', () => {
      let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
      survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item =>
        item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(0).getId(),
          visibilityType: null,
        })),
      );
      survey.refreshReplacer();
      const errors = survey.validate();
      expect(errors.size).toBe(3);
      expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      expect(errors.get(1).getType()).toBe('ERROR');
      expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で比較方法が不正です');
      expect(errors.get(2).getType()).toBe('ERROR');
      expect(errors.get(2).getMessage()).toBe('設問 2-1 選択肢1 表示条件で動作種別が不正です');
    });

    it('CheckboxQuestionDefinitionの場合「選択肢」という表現でエラーが生成される', () => {
      const questionIndex = 0;
      const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey()
        .updateIn(['pages', 1, 'questions', questionIndex, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: 'dummy',
        })));
      survey.refreshReplacer();
      expect(survey.getIn(['pages', 0, 'questions', questionIndex]).constructor.toString()).toContain('CheckboxQuestionDefinition');

      const errors = survey.validate();
      expect(errors.size).toBe(2);
      expect(errors.get(0).getType()).toBe('ERROR');
      expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      expect(errors.get(1).getType()).toBe('ERROR');
      expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で条件設問の値が不正です');
    });

    it('RadioQuestionDefinitionの場合「選択肢」という表現でエラーが生成される', () => {
      const questionIndex = 1;
      const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey()
        .updateIn(['pages', 1, 'questions', questionIndex, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: 'dummy',
        })));
      survey.refreshReplacer();
      expect(survey.getIn(['pages', 0, 'questions', questionIndex]).constructor.toString()).toContain('RadioQuestionDefinition');

      const errors = survey.validate();
      expect(errors.size).toBe(2);
      expect(errors.get(0).getType()).toBe('ERROR');
      expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      expect(errors.get(1).getType()).toBe('ERROR');
      expect(errors.get(1).getMessage()).toBe('設問 2-2 選択肢1 表示条件で条件設問の値が不正です');
    });

    it('MultiNumberQuestionDefinitionの場合「項目」という表現でエラーが生成される', () => {
      const questionIndex = 2;
      const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey()
        .updateIn(['pages', 1, 'questions', questionIndex, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: 'dummy',
        })));
      survey.refreshReplacer();
      expect(survey.getIn(['pages', 0, 'questions', questionIndex]).constructor.toString()).toContain('MultiNumberQuestionDefinition');

      const errors = survey.validate();
      expect(errors.size).toBe(2);
      expect(errors.get(0).getType()).toBe('ERROR');
      expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      expect(errors.get(1).getType()).toBe('ERROR');
      expect(errors.get(1).getMessage()).toBe('設問 2-3 項目1 表示条件で条件設問の値が不正です');
    });

    it('MatrixQuestionDefinitionの場合「行」「列」という表現でエラーが生成される', () => {
      const questionIndex = 3;
      const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey()
        .updateIn(['pages', 1, 'questions', questionIndex, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: 'dummy',
        })))
        .updateIn(['pages', 1, 'questions', questionIndex, 'subItems', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: 'dummy',
        })));
      survey.refreshReplacer();
      expect(survey.getIn(['pages', 0, 'questions', questionIndex]).constructor.toString()).toContain('MatrixQuestionDefinition');

      const errors = survey.validate();
      expect(errors.size).toBe(3);
      expect(errors.get(0).getType()).toBe('ERROR');
      expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      expect(errors.get(1).getType()).toBe('ERROR');
      expect(errors.get(1).getMessage()).toBe('設問 2-4 行1 表示条件で条件設問の値が不正です');
      expect(errors.get(2).getType()).toBe('ERROR');
      expect(errors.get(2).getMessage()).toBe('設問 2-4 列1 表示条件で条件設問の値が不正です');
    });

    describe('outputTypeがcheckboxの場合', () => {
      const outputDefinitionIndex = 0;

      it('選択したoutputDefinitionのタイプがcheckbox', () => {
        const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        expect(survey.getAllOutputDefinitions().get(outputDefinitionIndex).getOutputType()).toBe('checkbox');
      });

      it('比較値タイプを選択していない場合なにもエラーがでない', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: null,
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(1);
        expect(errors.get(0).getType()).toBe('ERROR');
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      });
      it('比較値を選択していない場合なにもエラーがでない', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: null,
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(1);
        expect(errors.get(0).getType()).toBe('ERROR');
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      });
      it('比較方法を選択していない場合エラーとなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: null,
          operator: '',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getType()).toBe('ERROR');
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getType()).toBe('ERROR');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で比較方法が不正です');
      });
      it('動作種別を選択していない場合エラーとなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: null,
          operator: '!!',
          visibilityType: '',
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getType()).toBe('ERROR');
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getType()).toBe('ERROR');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で動作種別が不正です');
      });
    });

    describe('outputTypeがradioの場合', () => {
      const outputDefinitionIndex = 1;

      it('選択したoutputDefinitionのタイプがradio', () => {
        const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        expect(survey.getAllOutputDefinitions().get(outputDefinitionIndex).getOutputType()).toBe('radio');
      });

      it('比較値タイプを選択していない場合なにもエラーがでない', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: `{{${survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId()}.answer}}`,
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(1);
        expect(errors.get(0).getType()).toBe('ERROR');
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      });

      it('比較値を選択していない場合なにもエラーとなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: null,
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getType()).toBe('ERROR');
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getType()).toBe('ERROR');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で比較値が不正です');
      });

      it('比較方法を選択していない場合エラーとなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: `{{${survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId()}.answer}}`,
          operator: '',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で比較方法が不正です');
      });

      it('動作種別を選択していない場合エラーとなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: `{{${survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId()}.answer}}`,
          operator: '!!',
          visibilityType: '',
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で動作種別が不正です');
      });

      it('存在するchoiceのvalueを設定している場合、エラーとならない', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: '{{cj2xe2lhr000m3k67px7ghq2z.choice_value}}',
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(1);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      });

      it('存在しないchoiceのvalueを設定している場合、エラーなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: '{{dummy.choice_value}}',
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      });
    });

    describe('outputTypeがnumberの場合', () => {
      const outputDefinitionIndex = 2;

      it('選択したoutputDefinitionのタイプがnumber', () => {
        const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        expect(survey.getAllOutputDefinitions().get(outputDefinitionIndex).getOutputType()).toBe('number');
      });

      it('比較値タイプを選択していない場合なにもエラーがでない', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: '10',
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で比較値タイプが不正です');
      });

      it('比較値を選択していない場合なにもエラーとなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: 'fixedValue',
          value: null,
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で比較値が不正です');
      });

      it('比較方法を選択していない場合エラーとなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: 'fixedValue',
          value: '10',
          operator: '',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で比較方法が不正です');
      });

      it('動作種別を選択していない場合エラーとなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: 'fixedValue',
          value: '10',
          operator: '!!',
          visibilityType: '',
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で動作種別が不正です');
      });
    });

    describe('outputTypeがselectの場合', () => {
      const outputDefinitionIndex = 4;

      it('選択したoutputDefinitionのタイプがselect', () => {
        const survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        expect(survey.getAllOutputDefinitions().get(outputDefinitionIndex).getOutputType()).toBe('select');
      });

      it('比較値タイプを選択していない場合なにもエラーがでない', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: `{{${survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId()}.answer}}`,
          operator: '!!',
          visibilityType: '',
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
        expect(errors.get(1).getMessage()).toBe('設問 2-1 選択肢1 表示条件で動作種別が不正です');
      });

      it('存在するchoiceのvalueを設定している場合、エラーとならない', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: '{{cj2xe2lhr000m3k67px7ghq2z.choice_value}}',
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(1);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      });

      it('存在しないchoiceのvalueを設定している場合、エラーなる', () => {
        let survey = SurveyDesignerState.createFromJson({ survey: allOutputTypeJson }).getSurvey();
        survey = survey.updateIn(['pages', 1, 'questions', 0, 'items', 0], item => item.set('visibilityCondition', new VisibilityConditionDefinition({
          outputDefinitionId: survey.getAllOutputDefinitions().get(outputDefinitionIndex).getId(),
          comparisonType: null,
          value: '{{dummy.choice_value}}',
          operator: '!!',
          visibilityType: ItemVisibility.HIDE,
        })));
        survey.refreshReplacer();
        const errors = survey.validate();
        expect(errors.size).toBe(2);
        expect(errors.get(0).getMessage()).toBe('パネルが選択されていません');
      });
    });
  });
});
