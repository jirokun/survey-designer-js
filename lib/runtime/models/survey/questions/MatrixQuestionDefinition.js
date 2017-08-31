import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';

/** 設問定義：複数選択肢 */
export default class MatrixQuestionDefinition extends BaseQuestionDefinition {
  static create(pageDevId) {
    const questionDevId = surveyDevIdGeneratorInstance.generateForQuestion(pageDevId);
    const itemDevId = surveyDevIdGeneratorInstance.generateForItem(questionDevId);
    const subIDevItemId = surveyDevIdGeneratorInstance.generateForItem(questionDevId);
    return new MatrixQuestionDefinition({
      _id: cuid(),
      devId: questionDevId,
      dataType: 'Matrix',
      matrixType: 'radio',
      items: List().push(ItemDefinition.create(itemDevId, 0)),
      subItems: List().push(ItemDefinition.create(subIDevItemId, 0)),
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

  /** タイプごとの出力値を取得する */
  getOutputValue(subItem) {
    const matrixType = this.getMatrixType();
    switch (matrixType) {
      case 'radio':
        return `${subItem.getIndex() + 1}`;
      case 'checkbox':
        return '1';
      case 'text':
      case 'number':
        return '';
      default:
        throw new Error(`不明なmatrixTypeです: ${matrixType}`);
    }
  }

  /** 追加エレメントの data-dev-idの値を取得する */
  getAdditionalOutputDevId(itemDevId, subItemDevId) {
    if (this.isMatrixReverse()) {
      return this.getInnerOutputDevId(subItemDevId, itemDevId, true);
    }
    return this.getInnerOutputDevId(itemDevId, subItemDevId, true);
  }

  /** 出力に使用する data-dev-id の値を取得する */
  getOutputDevId(itemDevId, subItemDevId) {
    if (this.isMatrixReverse()) {
      return this.getInnerOutputDevId(subItemDevId, itemDevId, false);
    }
    return this.getInnerOutputDevId(itemDevId, subItemDevId, false);
  }

  /** data-dev-id の値の取得の内部処理 */
  getInnerOutputDevId(itemDevId, subItemDevId, isAdditional) {
    if (itemDevId == null || subItemDevId == null) { // devIdが指定されていない場合はnullを返す
      return null;
    }

    const subItemLastDevId = subItemDevId.split('_').slice(-1)[0];

    if (isAdditional) {
      return `${itemDevId}_${subItemLastDevId}_text`;
    }
    return `${itemDevId}_${subItemLastDevId}`;
  }

  /** 出力に使用する行合計値の devId を取得する */
  getOutputTotalRowDevId(itemDevId) {
    return `${itemDevId}_total_row`;
  }

  /** 出力に使用する列合計値の devId を取得する */
  getOutputTotalColDevId(itemDevId) {
    return `${itemDevId}_total_column`;
  }

  /** checkbox, text, numberでoutputDefinitionの処理が共通な部分を切り出したメソッド */
  getOutputDefinitionsCommon(pageNo, questionNo) {
    const items = this.isMatrixReverse() ? this.getSubItems() : this.getItems();
    const subItems = this.isMatrixReverse() ? this.getItems() : this.getSubItems();
    return items.flatMap(item =>
      subItems.map((subItem) => {
        const row = item;
        const col = subItem;
        return new OutputDefinition({
          _id: `${item.getId()}_${subItem.getId()}`,
          questionId: this.getId(),
          devId: this.getOutputDevId(row.getDevId(), col.getDevId()),
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
        questionId: this.getId(),
        devId: this.getOutputTotalRowDevId(item.getDevId()),
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
        questionId: this.getId(),
        devId: this.getOutputTotalColDevId(item.getDevId()),
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
        const label = `${row.getPlainLabel()}-${column.getPlainLabel()}-入力欄`;
        const dlLabel = `${this.getPlainTitle()}-${row.getPlainLabel()}-${column.getPlainLabel()}-入力欄`;
        return new OutputDefinition({
          _id: `${row.getId()}_${column.getId()}_additional_input`,
          questionId: this.getId(),
          devId: this.getAdditionalOutputDevId(row.getDevId(), column.getDevId()),
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
          questionId: this.getId(),
          devId: item.getDevId(),
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
        if (this.isMatrixReverse()) {
          return commonOutputDefinitions.concat(sumColumnsOutputDefinitions).concat(rowColumnsOutputDefinitions);
        }
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

  /** 正しく設定されているかチェックする */
  validate(survey) {
    let errors = super.validate(survey);
    const page = survey.findPageFromQuestion(this.getId());
    const node = survey.findNodeFromRefId(page.getId());
    this.getItems().forEach((item) => {
      const itemErrors = item.validate(survey, node, page, this).map(itemError => `行${item.getIndex() + 1} ${itemError}`);
      itemErrors.forEach((error) => { errors = errors.push(error); });
    });
    this.getSubItems().forEach((item) => {
      const itemErrors = item.validate(survey, node, page, this).map(itemError => `列${item.getIndex() + 1} ${itemError}`);
      itemErrors.forEach((error) => { errors = errors.push(error); });
    });

    return errors;
  }
}
