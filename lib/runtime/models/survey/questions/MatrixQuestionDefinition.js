import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';

/** 設問定義：複数選択肢 */
export default class MatrixQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new MatrixQuestionDefinition({
      _id: cuid(),
      dataType: 'Matrix',
      matrixType: 'radio',
      items: List().push(ItemDefinition.create(0)),
    });
  }

  /** 出力に使用する追加エレメントの名前を取得する */
  getAdditionalOutputName(item, subItem) {
    return `${this.getId()}_value${item.getIndex() + 1}_${subItem.getIndex() + 1}__text`;
  }

  /** 出力に使用する名前を取得する */
  getOutputName(item, subItem) {
    const matrixType = this.getMatrixType();
    switch (matrixType) {
      case 'radio':
        return `${this.getId()}_value${item.getIndex() + 1}`;
      case 'checkbox':
      case 'text':
      case 'number':
        return `${this.getId()}_value${item.getIndex() + 1}_${subItem.getIndex() + 1}`;
      default:
        throw new Error(`不明なmatrixTypeです: ${matrixType}`);
    }
  }

  /** 出力に使用する行合計値の名前を取得する */
  getOutputTotalRowName(item) {
    return `${this.getId()}_row${item.getIndex() + 1}_total`;
  }

  /** 出力に使用する列合計値の名前を取得する */
  getOutputTotalColName(item) {
    return `${this.getId()}_column${item.getIndex() + 1}_total`;
  }

  /** 出力に使用する名前を取得する */
  getOutputValue(subItem) {
    const matrixType = this.getMatrixType();
    switch (matrixType) {
      case 'radio':
        return `value${subItem.getIndex() + 1}`;
      case 'checkbox':
        return 'on';
      case 'text':
      case 'number':
        return '';
      default:
        throw new Error(`不明なmatrixTypeです: ${matrixType}`);
    }
  }

  /** checkbox, text, numberでoutputDefinitionの処理が共通な部分を切り出したメソッド */
  getOutputDefinitionsCommon(pageNo, questionNo) {
    return this.getItems().flatMap(item =>
      this.getSubItems().map((subItem) => {
        const row = this.isMatrixReverse() ? subItem : item;
        const col = this.isMatrixReverse() ? item : subItem;
        return new OutputDefinition({
          _id: `${item.getId()}_${subItem.getId()}`,
          name: this.getOutputName(row, col),
          label: `${row.getPlainLabel()}-${col.getPlainLabel()}`,
          dlLabel: `${this.getPlainTitle()}-${row.getPlainLabel()}-${col.getPlainLabel()}`,
          question: this,
          outputType: this.getMatrixType(),
          outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, row.getIndex() + 1, col.getIndex() + 1),
        });
      }),
    );
  }

  /** OutputDefinitionの合計値分を追加する */
  getOutputDefinitionForSum(pageNo, questionNo, type) {
    if (type === 'rows' && this.isMatrixSumRows()) {
      const items = this.getItems();
      return items.map(item => new OutputDefinition({
        _id: `${item.getId()}_total_row`,
        name: this.getOutputTotalRowName(item),
        label: `${item.getPlainLabel()}-合計値`,
        dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}-合計値`,
        question: this,
        outputType: this.getMatrixType(),
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, `row${item.getIndex() + 1}`, 'total'),
        downloadable: false,
      }));
    }
    if (type === 'columns' && this.isMatrixSumCols()) {
      const items = this.getSubItems();
      return items.map(item => new OutputDefinition({
        _id: `${item.getId()}_total_column`,
        name: this.getOutputTotalColName(item),
        label: `${item.getPlainLabel()}-合計値`,
        dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}-合計値`,
        question: this,
        outputType: this.getMatrixType(),
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, `column${item.getIndex() + 1}`, 'total'),
        downloadable: false,
      }));
    }
    return List();
  }

  /** 追加入力のためのOutputDefinitionを取得する */
  getOutputDefinitionForAdditionalInput(pageNo, questionNo) {
    const columns = this.isMatrixReverse() ? this.getItems() : this.getSubItems();
    const rows = this.isMatrixReverse() ? this.getSubItems() : this.getItems();

    return columns.filter(item => item.hasAdditionalInput()).flatMap(column =>
      rows.map((row) => {
        const label = `${row.getPlainLabel()}-${column.getPlainLabel()}-追加入力`;
        const dlLabel = `${this.getPlainTitle()}-${row.getPlainLabel()}-${column.getPlainLabel()}-追加入力`;
        return new OutputDefinition({
          _id: `${row.getId()}_${column.getId()}_additional_input`,
          name: this.getAdditionalOutputName(row, column),
          label,
          dlLabel,
          question: this,
          outputType: column.getAdditionalInputType(),
          outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, row.getIndex() + 1, column.getIndex() + 1, 'additional'),
        });
      }),
    );
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    const matrixType = this.getMatrixType();
    switch (matrixType) {
      case 'radio': {
        const rowItems = this.isMatrixReverse() ? this.getSubItems() : this.getItems();
        const columnItems = this.isMatrixReverse() ? this.getItems() : this.getSubItems();
        const choices = columnItems.map(item => item.getChoiceDefinition());
        const commonOutputDefinitions = rowItems.map(item => new OutputDefinition({
          _id: item.getId(),
          name: this.getOutputName(item),
          label: `${item.getPlainLabel()}`,
          dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}`,
          question: this,
          outputType: matrixType,
          outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1),
          choices,
        }));
        const additionalInputOutputDefinitions = this.getOutputDefinitionForAdditionalInput(pageNo, questionNo);
        return commonOutputDefinitions.concat(additionalInputOutputDefinitions);
      }
      case 'checkbox': {
        const commonOutputDefinitions = this.getOutputDefinitionsCommon(pageNo, questionNo);
        const additionalInputOutputDefinitions = this.getOutputDefinitionForAdditionalInput(pageNo, questionNo);
        return commonOutputDefinitions.concat(additionalInputOutputDefinitions);
      }
      case 'text':
        return this.getOutputDefinitionsCommon(pageNo, questionNo);
      case 'number': {
        const sumColumnsOutputDefinitions = this.getOutputDefinitionForSum(pageNo, questionNo, 'columns');
        const rowColumnsOutputDefinitions = this.getOutputDefinitionForSum(pageNo, questionNo, 'rows');
        const commonOutputDefinitions = this.getOutputDefinitionsCommon(pageNo, questionNo);
        return commonOutputDefinitions.concat(rowColumnsOutputDefinitions).concat(sumColumnsOutputDefinitions);
      }
      default:
        throw new Error(`不明なmatrixTypeです: ${matrixType}`);
    }
  }

  /** indexの値を更新する */
  fixItemIndex() {
    return this.set('items', this.getItems().map((item, i) =>
      item
        .set('index', i)
        .set('value', 'on'),
    ).toList());
  }

  /** indexの値を更新する */
  fixSubItemIndex() {
    return this.set('subItems', this.getSubItems().map((item, i) =>
      item
        .set('index', i)
        .set('value', 'on'),
    ).toList());
  }
}
