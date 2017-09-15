/* eslint-env jest */
import { List } from 'immutable';
import MatrixQuestionDefinition from '../../../../../lib/runtime/models/survey/questions/MatrixQuestionDefinition';
import ItemDefinition from '../../../../../lib/runtime/models/survey/questions/internal/ItemDefinition';


describe('MatrixQuestionDefinition', () => {
  describe('getOutputDefinition', () => {
    function createItems(idPrefix, labelPrefix) {
      return List()
        .push(new ItemDefinition({ _id: `${idPrefix}1`, index: 0, plainLabel: `${labelPrefix}1` }))
        .push(new ItemDefinition({ _id: `${idPrefix}2`, index: 1, plainLabel: `${labelPrefix}2` }));
    }

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
      expect(result.size).toBe(6);
      expect(result.get(4).getId()).toBe('row1_column1_additional_input');
      expect(result.get(4).getName()).toBe('matrix1_value1_1__text');
      expect(result.get(4).getLabel()).toBe('行1-列1-入力欄');
      expect(result.get(4).getOutputType()).toBe('text');
      expect(result.get(4).getOutputNo()).toBe('1-1-1-1-additional');

      expect(result.get(5).getId()).toBe('row2_column1_additional_input');
      expect(result.get(5).getName()).toBe('matrix1_value2_1__text');
      expect(result.get(5).getLabel()).toBe('行2-列1-入力欄');
      expect(result.get(5).getOutputType()).toBe('text');
      expect(result.get(5).getOutputNo()).toBe('1-1-2-1-additional');
    });

    it('matrixTypeがcheckboxで入力欄をonにしたときのOutputDefinitionも取得できる(列でグルーピング)', () => {
      const matrixType = 'checkbox';
      const rows = createItems('row', '行').update(0, item => item.set('additionalInput', true));
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns, matrixReverse: true });

      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(6);
      expect(result.get(4).getId()).toBe('column1_row1_additional_input');
      expect(result.get(4).getName()).toBe('matrix1_value1_1__text');
      expect(result.get(4).getLabel()).toBe('列1-行1-入力欄');
      expect(result.get(4).getOutputType()).toBe('text');
      expect(result.get(4).getOutputNo()).toBe('1-1-1-1-additional');

      expect(result.get(5).getId()).toBe('column2_row1_additional_input');
      expect(result.get(5).getName()).toBe('matrix1_value2_1__text');
      expect(result.get(5).getLabel()).toBe('列2-行1-入力欄');
      expect(result.get(5).getOutputType()).toBe('text');
      expect(result.get(5).getOutputNo()).toBe('1-1-2-1-additional');
    });

    it('matrixTypeがradioで入力欄をonにしたときのOutputDefinitionも取得できる', () => {
      const matrixType = 'radio';
      const rows = createItems('row', '行');
      const columns = createItems('column', '列').update(0, item => item.set('additionalInput', true));
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns });

      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(4);
      expect(result.get(2).getId()).toBe('row1_column1_additional_input');
      expect(result.get(2).getName()).toBe('matrix1_value1_1__text');
      expect(result.get(2).getLabel()).toBe('行1-列1-入力欄');
      expect(result.get(2).getOutputType()).toBe('text');
      expect(result.get(2).getOutputNo()).toBe('1-1-1-1-additional');

      expect(result.get(3).getId()).toBe('row2_column1_additional_input');
      expect(result.get(3).getName()).toBe('matrix1_value2_1__text');
      expect(result.get(3).getLabel()).toBe('行2-列1-入力欄');
      expect(result.get(3).getOutputType()).toBe('text');
      expect(result.get(3).getOutputNo()).toBe('1-1-2-1-additional');
    });

    it('matrixTypeがradioで入力欄をonにしたときのOutputDefinitionも取得できる(列でグルーピング)', () => {
      const matrixType = 'radio';
      const rows = createItems('row', '行').update(0, item => item.set('additionalInput', true));
      const columns = createItems('column', '列');
      const def = new MatrixQuestionDefinition({ _id: 'matrix1', dataType: 'Matrix', matrixType, items: rows, subItems: columns, matrixReverse: true });

      const result = def.getOutputDefinitions('1', '1');
      expect(result.size).toBe(4);
      expect(result.get(2).getId()).toBe('column1_row1_additional_input');
      expect(result.get(2).getName()).toBe('matrix1_value1_1__text');
      expect(result.get(2).getLabel()).toBe('列1-行1-入力欄');
      expect(result.get(2).getOutputType()).toBe('text');
      expect(result.get(2).getOutputNo()).toBe('1-1-1-1-additional');

      expect(result.get(3).getId()).toBe('column2_row1_additional_input');
      expect(result.get(3).getName()).toBe('matrix1_value2_1__text');
      expect(result.get(3).getLabel()).toBe('列2-行1-入力欄');
      expect(result.get(3).getOutputType()).toBe('text');
      expect(result.get(3).getOutputNo()).toBe('1-1-2-1-additional');
    });
  });

  describe('getOutputDevId', () => {
    it('通常入力のdev-idを返す', () => {
      const question = new MatrixQuestionDefinition();
      expect(question.getOutputDevId('ww1_xx1_yy1', 'ww1_xx1_yy2', false)).toBe('ww1_xx1_yy1_yy2');
    });

    it('追加記入のdev-idを返す', () => {
      const question = new MatrixQuestionDefinition();
      expect(question.getOutputDevId('ww1_xx1_yy1', 'ww1_xx1_yy2', true)).toBe('ww1_xx1_yy1_yy2_text');
    });
  });

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
});
