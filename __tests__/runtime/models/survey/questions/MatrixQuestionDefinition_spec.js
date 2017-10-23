/* eslint-env jest */
import { List } from 'immutable';
import $ from 'jquery';
import MatrixQuestionDefinition from '../../../../../lib/runtime/models/survey/questions/MatrixQuestionDefinition';
import ItemDefinition from '../../../../../lib/runtime/models/survey/questions/internal/ItemDefinition';
import SurveyDesignerState from '../../../../../lib/runtime/models/SurveyDesignerState';
import freeModeRowSpanSurvey from './MatrixQuestionDefinition_freeModeRowSpan.json';
import freeModeColSpanSurvey from './MatrixQuestionDefinition_freeModeColSpan.json';

describe('MatrixQuestionDefinition', () => {
  function createItems(idPrefix, labelPrefix) {
    return List()
      .push(new ItemDefinition({ _id: `${idPrefix}1`, index: 0, plainLabel: `${labelPrefix}1` }))
      .push(new ItemDefinition({ _id: `${idPrefix}2`, index: 1, plainLabel: `${labelPrefix}2` }));
  }

  function createItemsWithAdditionalInput(idPrefix, labelPrefix) {
    return List()
      .push(new ItemDefinition({ _id: `${idPrefix}1`, index: 0, plainLabel: `${labelPrefix}1`, additionalInput: true }))
      .push(new ItemDefinition({ _id: `${idPrefix}2`, index: 1, plainLabel: `${labelPrefix}2`, additionalInput: false }));
  }

  describe('getOutputDefinition', () => {
    function validateNormalOutputDefinition(matrixType) {
      const rows = createItems('row', '行');
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns });
      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(4);
      expect(result.get(0).getId()).toBe('row1_column1');
      expect(result.get(0).getName()).toBe('matrix1_value1_1');
      expect(result.get(0).getLabel()).toBe('行1-列1');
      expect(result.get(0).getOutputType()).toBe(matrixType);
      expect(result.get(0).getOutputNo()).toBe('1-1-1-1');

      expect(result.get(1).getId()).toBe('row1_column2');
      expect(result.get(1).getName()).toBe('matrix1_value1_2');
      expect(result.get(1).getLabel()).toBe('行1-列2');
      expect(result.get(1).getOutputType()).toBe(matrixType);
      expect(result.get(1).getOutputNo()).toBe('1-1-1-2');

      expect(result.get(2).getId()).toBe('row2_column1');
      expect(result.get(2).getName()).toBe('matrix1_value2_1');
      expect(result.get(2).getLabel()).toBe('行2-列1');
      expect(result.get(2).getOutputType()).toBe(matrixType);
      expect(result.get(2).getOutputNo()).toBe('1-1-2-1');

      expect(result.get(3).getId()).toBe('row2_column2');
      expect(result.get(3).getName()).toBe('matrix1_value2_2');
      expect(result.get(3).getLabel()).toBe('行2-列2');
      expect(result.get(3).getOutputType()).toBe(matrixType);
      expect(result.get(3).getOutputNo()).toBe('1-1-2-2');
    }

    it('matrixTypeがtextの場合itemsとsubItemsの分のOutputDefinitionが取得できる', () => {
      validateNormalOutputDefinition('text');
    });

    it('matrixTypeがnumberの場合itemsとsubItemsの分のOutputDefinitionが取得できる', () => {
      validateNormalOutputDefinition('number');
    });

    it('matrixTypeがcheckboxの場合itemsとsubItemsの分のOutputDefinitionが取得できる', () => {
      validateNormalOutputDefinition('checkbox');
    });

    it('matrixTypeがradioの場合itemsとsubItemsの分のOutputDefinitionが取得できる', () => {
      const matrixType = 'radio';
      const rows = createItems('row', '行');
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns });
      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(2);
      expect(result.get(0).getId()).toBe('row1');
      expect(result.get(0).getName()).toBe('matrix1_value1');
      expect(result.get(0).getLabel()).toBe('行1');
      expect(result.get(0).getOutputType()).toBe(matrixType);
      expect(result.get(0).getOutputNo()).toBe('1-1-1');

      expect(result.get(1).getId()).toBe('row2');
      expect(result.get(1).getName()).toBe('matrix1_value2');
      expect(result.get(1).getLabel()).toBe('行2');
      expect(result.get(1).getOutputType()).toBe(matrixType);
      expect(result.get(1).getOutputNo()).toBe('1-1-2');
    });

    it('matrixTypeがnumberで行合計を表示する場合合計値のOutputDefinitionも取得できる', () => {
      const matrixType = 'number';
      const rows = createItems('row', '行');
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns, matrixSumRows: true });
      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(6);
      expect(result.get(4).getId()).toBe('row1_total_row');
      expect(result.get(4).getName()).toBe('matrix1_row1_total');
      expect(result.get(4).getLabel()).toBe('行1-合計値');
      expect(result.get(4).getOutputType()).toBe(matrixType);
      expect(result.get(4).getOutputNo()).toBe('1-1-row1-total');

      expect(result.get(5).getId()).toBe('row2_total_row');
      expect(result.get(5).getName()).toBe('matrix1_row2_total');
      expect(result.get(5).getLabel()).toBe('行2-合計値');
      expect(result.get(5).getOutputType()).toBe(matrixType);
      expect(result.get(5).getOutputNo()).toBe('1-1-row2-total');
    });

    it('matrixTypeがnumberで列合計を表示する場合合計値のOutputDefinitionも取得できる', () => {
      const matrixType = 'number';
      const rows = createItems('row', '行');
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns, matrixSumCols: true });
      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(6);
      expect(result.get(4).getId()).toBe('column1_total_column');
      expect(result.get(4).getName()).toBe('matrix1_column1_total');
      expect(result.get(4).getLabel()).toBe('列1-合計値');
      expect(result.get(4).getOutputType()).toBe(matrixType);
      expect(result.get(4).getOutputNo()).toBe('1-1-column1-total');

      expect(result.get(5).getId()).toBe('column2_total_column');
      expect(result.get(5).getName()).toBe('matrix1_column2_total');
      expect(result.get(5).getLabel()).toBe('列2-合計値');
      expect(result.get(5).getOutputType()).toBe(matrixType);
      expect(result.get(5).getOutputNo()).toBe('1-1-column2-total');
    });

    it('matrixTypeがcheckboxで入力欄をonにしたときのOutputDefinitionも取得できる', () => {
      const matrixType = 'checkbox';
      const rows = createItems('row', '行');
      const columns = createItems('column', '列').update(0, item => item.set('additionalInput', true));
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns });

      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(5);
      expect(result.get(4).getId()).toBe('column1_additional_input');
      expect(result.get(4).getName()).toBe('column1__text');
      expect(result.get(4).getLabel()).toBe('列1-入力欄');
      expect(result.get(4).getOutputType()).toBe('text');
      expect(result.get(4).getOutputNo()).toBe('1-1-column1-additional');
    });

    it('matrixTypeがcheckboxで入力欄をonにしたときのOutputDefinitionも取得できる(列でグルーピング)', () => {
      const matrixType = 'checkbox';
      const rows = createItems('row', '行').update(0, item => item.set('additionalInput', true));
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns, matrixReverse: true });

      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(5);
      expect(result.get(4).getId()).toBe('row1_additional_input');
      expect(result.get(4).getName()).toBe('row1__text');
      expect(result.get(4).getLabel()).toBe('行1-入力欄');
      expect(result.get(4).getOutputType()).toBe('text');
      expect(result.get(4).getOutputNo()).toBe('1-1-row1-additional');
    });

    it('matrixTypeがradioで入力欄をonにしたときのOutputDefinitionも取得できる', () => {
      const matrixType = 'radio';
      const rows = createItems('row', '行');
      const columns = createItems('column', '列').update(0, item => item.set('additionalInput', true));
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns });

      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(3);
      expect(result.get(2).getId()).toBe('column1_additional_input');
      expect(result.get(2).getName()).toBe('column1__text');
      expect(result.get(2).getLabel()).toBe('列1-入力欄');
      expect(result.get(2).getOutputType()).toBe('text');
      expect(result.get(2).getOutputNo()).toBe('1-1-column1-additional');
    });

    it('matrixTypeがradioで入力欄をonにしたときのOutputDefinitionも取得できる(列でグルーピング)', () => {
      const matrixType = 'radio';
      const rows = createItems('row', '行').update(0, item => item.set('additionalInput', true));
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns, matrixReverse: true });

      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(3);
      expect(result.get(2).getId()).toBe('row1_additional_input');
      expect(result.get(2).getName()).toBe('row1__text');
      expect(result.get(2).getLabel()).toBe('行1-入力欄');
      expect(result.get(2).getOutputType()).toBe('text');
      expect(result.get(2).getOutputNo()).toBe('1-1-row1-additional');
    });
  });

  describe('getOutputDevId', () => {
    it('通常入力のdev-idを返す', () => {
      const question = new MatrixQuestionDefinition();
      expect(question.getOutputDevId('ww1_xx1_yy1', 'ww1_xx1_yy2')).toBe('ww1_xx1_yy1_yy2');
    }); });

  describe('getOutputTotalRowDevId', () => {
    it('追加記入のdev-idを返す', () => {
      const question = new MatrixQuestionDefinition();
      expect(question.getOutputTotalRowDevId('ww1_xx1_yy1')).toBe('ww1_xx1_yy1_total_row');
    });
  });

  describe('getOutputTotalColDevId', () => {
    it('追加記入のdev-idを返す', () => {
      const question = new MatrixQuestionDefinition();
      expect(question.getOutputTotalColDevId('ww1_xx1_yy2')).toBe('ww1_xx1_yy2_total_column');
    });
  });

  describe('getOutputDefinitionForSum', () => {
    it('typeにcolumnsを指定した場合、列の合計値のOutputDefinitionを返す', () => {
      const rows = createItems('row', '行');
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType: 'number', items: rows, subItems: columns, matrixSumCols: true });
      const outputDefinitions = def.getOutputDefinitionForSum('columns', '1', '1');
      expect(outputDefinitions.size).toBe(2);
      expect(outputDefinitions.get(0).getId()).toBe('column1_total_column');
      expect(outputDefinitions.get(0).getOutputNo()).toBe('1-1-column1-total');
    });

    it('typeにrowsを指定した場合、列の合計値のOutputDefinitionを返す', () => {
      const rows = createItems('row', '行');
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType: 'number', items: rows, subItems: columns, matrixSumRows: true });
      const outputDefinitions = def.getOutputDefinitionForSum('rows', '1', '1');
      expect(outputDefinitions.size).toBe(2);
      expect(outputDefinitions.get(0).getId()).toBe('row1_total_row');
      expect(outputDefinitions.get(0).getOutputNo()).toBe('1-1-row1-total');
    });
  });

  describe('getOutputDefinitionForAdditionalInput', () => {
    it('列にadditionalInputがある場合、追加入力のOutputDefinitionが取得できる', () => {
      const rows = createItems('row', '行');
      const columns = createItemsWithAdditionalInput('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType: 'checkbox', items: rows, subItems: columns });

      const result = def.getOutputDefinitionForAdditionalInput();
      expect(result.size).toBe(1);
      expect(result.get(0).getLabel()).toBe('列1-入力欄');
    });

    it('行にadditionalInputがある場合、追加入力のOutputDefinitionが取得できる', () => {
      const rows = createItemsWithAdditionalInput('row', '行');
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType: 'checkbox', items: rows, subItems: columns });

      const result = def.getOutputDefinitionForAdditionalInput();
      expect(result.size).toBe(1);
      expect(result.get(0).getLabel()).toBe('行1-入力欄');
    });

    it('行列の両方にadditionalInputがある場合、行、列の順序でデータが並ぶ(matrixReverse=false)', () => {
      const rows = createItemsWithAdditionalInput('row', '行');
      const columns = createItemsWithAdditionalInput('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType: 'checkbox', items: rows, subItems: columns, matrixReverse: false });

      const result = def.getOutputDefinitionForAdditionalInput();
      expect(result.size).toBe(2);
      expect(result.get(0).getLabel()).toBe('行1-入力欄');
      expect(result.get(1).getLabel()).toBe('列1-入力欄');
    });

    it('行列の両方にadditionalInputがある場合、行、列の順序でデータが並ぶ(matrixReverse=true)', () => {
      const rows = createItemsWithAdditionalInput('row', '行');
      const columns = createItemsWithAdditionalInput('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType: 'checkbox', items: rows, subItems: columns, matrixReverse: true });

      const result = def.getOutputDefinitionForAdditionalInput();
      expect(result.size).toBe(2);
      expect(result.get(0).getLabel()).toBe('列1-入力欄');
      expect(result.get(1).getLabel()).toBe('行1-入力欄');
    });
  });

  describe('getOutputDefinitionFromItemAndSubItem', () => {
    function createMatrixDefinition(matrixType, matrixReverse) {
      const rows = createItemsWithAdditionalInput('row', '行');
      const columns = createItemsWithAdditionalInput('column', '列');
      return new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns, matrixReverse });
    }

    ['checkbox', 'text', 'number'].forEach((matrixType) => {
      describe(`matrixTypeが${matrixType}の場合`, () => {
        describe('matrixReverseがfalseの場合', () => {
          it('セルのOutputDefinitionが返る', () => {
            const question = createMatrixDefinition(matrixType, false);
            const result = question.getOutputDefinitionFromItemAndSubItem(question.getItems().get(1), question.getSubItems().get(1));
            expect(result.getLabel()).toBe('行2-列2');
          });
        });

        describe('matrixReverseがtrueの場合', () => {
          it('セルのOutputDefinitionが返る', () => {
            const question = createMatrixDefinition(matrixType, true);
            const result = question.getOutputDefinitionFromItemAndSubItem(question.getItems().get(1), question.getSubItems().get(1));
            expect(result.getLabel()).toBe('列2-行2');
          });
        });
      });
    });

    describe('matrixTypeがradioの場合', () => {
      describe('matrixReverseがfalseの場合', () => {
        it('セルのOutputDefinitionが返る', () => {
          const question = createMatrixDefinition('radio', false);
          const result = question.getOutputDefinitionFromItemAndSubItem(question.getItems().get(1), question.getSubItems().get(1));
          expect(result.getLabel()).toBe('行2');
        });
      });

      describe('matrixReverseがtrueの場合', () => {
        it('セルのOutputDefinitionが返る', () => {
          const question = createMatrixDefinition('radio', true);
          const result = question.getOutputDefinitionFromItemAndSubItem(question.getItems().get(1), question.getSubItems().get(1));
          expect(result.getLabel()).toBe('列2');
        });
      });
    });
  });

  describe('validate', () => {
    it('pageがfreeModeかつ行項目をランダム表示かつテーブルにrowspanがある場合エラーが返る', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: freeModeRowSpanSurvey }).getSurvey();
      const result = survey.validate();
      expect(result.size).toBe(2);
      expect(result.get(1).getType()).toBe('WARNING');
      expect(result.get(1).getMessage()).toBe('設問 1-1 表形式で行項目をランダム表示を選択していますが、列が結合されており正しく動作しない可能性があります');
    });

    it('pageがfreeModeかつ列項目をランダム表示かつテーブルにcolspanがある場合エラーが返る', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: freeModeColSpanSurvey }).getSurvey();
      const result = survey.validate();
      expect(result.size).toBe(2);
      expect(result.get(1).getType()).toBe('WARNING');
      expect(result.get(1).getMessage()).toBe('設問 1-1 表形式で列項目をランダム表示を選択していますが、行が結合されており正しく動作しない可能性があります');
    });

    it('pageがfreeModeかつitemIdに対応する行がテーブルに存在していない場合エラーが返る', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: freeModeColSpanSurvey }).getSurvey().updateIn(['pages', 0, 'html'], (html) => {
        const $html = $(html);
        $html.find('tr#cj7jyh2g700053j7159so1lad').remove();
        return $html.prop('outerHTML');
      });
      survey.refreshReplacer();
      const result = survey.validate();
      expect(result.size).toBe(3);
      expect(result.get(1).getType()).toBe('WARNING');
      expect(result.get(1).getMessage()).toBe('設問 1-1 テーブルの行ラベル「名称未設定」に対応する行が存在していません');
      expect(result.get(2).getType()).toBe('WARNING');
      expect(result.get(2).getMessage()).toBe('1-1-1に対応するフォームフィールドが存在しません');
      survey.validate();
    });

    it('pageがfreeModeかつsubItemIdに対応する列がテーブルに存在していない場合エラーが返る', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: freeModeColSpanSurvey }).getSurvey().updateIn(['pages', 0, 'html'], (html) => {
        const $html = $(html);
        $html.find('td#cj7jysdj7000a3j71fha5t1ad').remove();
        return $html.prop('outerHTML');
      }).setIn(['pages', 0, 'questions', 0, 'subItemsRandom'], false);
      survey.refreshReplacer();
      const result = survey.validate();
      expect(result.size).toBe(2);
      expect(result.get(1).getType()).toBe('WARNING');
      expect(result.get(1).getMessage()).toBe('設問 1-1 テーブルの列ラベル「名称未設定」に対応する列が存在していません');
    });

    it('テーブルカスタマイズでHTMLが登録されていないとき、itemIdに関するエラーが出力されない', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: freeModeColSpanSurvey })
        .getSurvey()
        .setIn(['pages', 0, 'freeMode'], false)
        .setIn(['pages', 0, 'questions', 0, 'matrixHtmlEnabled'], true);
      survey.refreshReplacer();
      const result = survey.validate();
      expect(result.size).toBe(1);
      expect(result.get(0).getType()).toBe('ERROR');
      expect(result.get(0).getMessage()).toBe('パネルが選択されていません');
    });

    it('テーブルカスタマイズでHTMLが登録されているとき、itemIdに関するエラーが出力される', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: freeModeColSpanSurvey })
        .getSurvey()
        .setIn(['pages', 0, 'freeMode'], false)
        .setIn(['pages', 0, 'questions', 0, 'matrixHtml'], '<div></div>')
        .setIn(['pages', 0, 'questions', 0, 'matrixHtmlEnabled'], true);
      survey.refreshReplacer();
      const result = survey.validate().filter(error => error.getType() === 'WARNING');
      expect(result.size).toBe(6);
      expect(result.get(0).getMessage()).toBe('設問 1-1 テーブルの行ラベル「名称未設定」に対応する行が存在していません');
      expect(result.get(1).getMessage()).toBe('設問 1-1 テーブルの行ラベル「名称未設定」に対応する行が存在していません');
      expect(result.get(2).getMessage()).toBe('設問 1-1 テーブルの列ラベル「名称未設定」に対応する列が存在していません');
      expect(result.get(3).getMessage()).toBe('設問 1-1 テーブルの列ラベル「名称未設定」に対応する列が存在していません');
      expect(result.get(4).getMessage()).toBe('1-1-1に対応するフォームフィールドが存在しません');
      expect(result.get(5).getMessage()).toBe('1-1-2に対応するフォームフィールドが存在しません');
    });

    it('行項目で存在しない参照がある', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: freeModeColSpanSurvey })
        .getSurvey()
        .setIn(['pages', 0, 'freeMode'], false)
        .setIn(['pages', 0, 'questions', 0, 'items', 0, 'label'], '{{dummy.answer}}');
      survey.refreshReplacer();
      const result = survey.validate();
      expect(result.size).toBe(2);
      expect(result.get(1).getType()).toBe('ERROR');
      expect(result.get(1).getMessage()).toBe('設問 1-1 行項目で存在しない参照があります');
    });

    it('列項目で存在しない参照がある', () => {
      const survey = SurveyDesignerState.createFromJson({ survey: freeModeColSpanSurvey })
        .getSurvey()
        .setIn(['pages', 0, 'freeMode'], false)
        .setIn(['pages', 0, 'questions', 0, 'subItems', 0, 'label'], '{{dummy.answer}}');
      survey.refreshReplacer();
      const result = survey.validate();
      expect(result.size).toBe(2);
      expect(result.get(1).getType()).toBe('ERROR');
      expect(result.get(1).getMessage()).toBe('設問 1-1 列項目で存在しない参照があります');
    });
  });
});
