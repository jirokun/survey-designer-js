import cuid from 'cuid';
import { List, OrderedMap } from 'immutable';
import $ from 'jquery';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';
import ValidationErrorDefinition from '../../ValidationErrorDefinition';
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

  /** 出力に使用する data-dev-id の値を取得する */
  getOutputDevId(rowDevId, columnDevId) {
    if (rowDevId == null || columnDevId == null) { // devIdが指定されていない場合はnullを返す
      return null;
    }

    const columnLastDevId = columnDevId.split('_').slice(-1)[0];
    return `${rowDevId}_${columnLastDevId}`;
  }

  /** 出力に使用する行合計値の devId を取得する */
  getOutputTotalRowDevId(itemDevId) {
    return `${itemDevId}_total_row`;
  }

  /** 出力に使用する列合計値の devId を取得する */
  getOutputTotalColDevId(itemDevId) {
    return `${itemDevId}_total_column`;
  }

  /** itemの行のOutputDefinitionのListを返す */
  getOutputDefinitionsFromItem(item, pageNo = '0', questionNo = '0') {
    return this.getSubItems().map(subItem => this.getOutputDefinitionFromItemAndSubItem(item, subItem, pageNo, questionNo));
  }

  /** subItemの列のOutputDefinitionのListを返す */
  createOutputDefinitionsFromSubItem(subItem, pageNo = '0', questionNo = '0') {
    return this.getItems().map(item => this.getOutputDefinitionFromItemAndSubItem(item, subItem, pageNo, questionNo));
  }

  /** checkbox, text, numberでoutputDefinitionの処理が共通な部分を切り出したメソッド */
  getOutputDefinitionsCommon(pageNo, questionNo) {
    const outputDefinitions = this.getItems().flatMap(item =>
      this.getSubItems().map(subItem => this.getOutputDefinitionFromItemAndSubItem(item, subItem, pageNo, questionNo)),
    ).sortBy(od => od.getOutputNo());

    // radioはoutputDefinitionが上記の方法では重複しているのでユニーク化する
    if (this.getMatrixType() === 'radio') {
      const orderedMap = OrderedMap().asMutable();
      outputDefinitions.forEach(od => orderedMap.set(od.getId(), od));
      return orderedMap.toList();
    }
    return outputDefinitions;
  }

  getOutputDefinitionFromItemAndSubItem(item, subItem, pageNo = '0', questionNo = '0') {
    const row = this.isMatrixReverse() ? subItem : item;
    const col = this.isMatrixReverse() ? item : subItem;
    if (this.getMatrixType() === 'radio') {
      const columnItems = this.isMatrixReverse() ? this.getItems() : this.getSubItems();
      const choices = columnItems.map(choiceItem => choiceItem.getChoiceDefinition());
      return new OutputDefinition({
        _id: row.getId(),
        questionId: this.getId(),
        devId: row.getDevId(),
        name: this.getOutputName(row),
        label: `${row.getPlainLabel()}`,
        dlLabel: `${this.getPlainTitle()}-${row.getPlainLabel()}`,
        question: this,
        outputType: this.getMatrixType(),
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, row.getIndex() + 1),
        choices,
      });
    }

    return new OutputDefinition({
      _id: `${item.getId()}_${subItem.getId()}`,
      questionId: this.getId(),
      devId: this.getOutputDevId(item.getDevId(), subItem.getDevId()),
      name: this.getOutputName(row, col),
      label: `${row.getPlainLabel()}-${col.getPlainLabel()}`,
      dlLabel: `${this.getPlainTitle()}-${row.getPlainLabel()}-${col.getPlainLabel()}`,
      question: this,
      outputType: this.getMatrixType(),
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, row.getIndex() + 1, col.getIndex() + 1),
    });
  }

  /** OutputDefinitionの合計値分を追加する */
  getOutputDefinitionForSum(type, pageNo = '0', questionNo = '0') {
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

  getSameItemGroupOutputDefinition(groupItem, pageNo = '0', questionNo = '0') {
    if (this.isMatrixReverse()) {
      return this.getItems().map(item =>
        this.getOutputDefinitionFromItemAndSubItem(item, groupItem, pageNo, questionNo));
    }
    return this.getSubItems().map(item =>
      this.getOutputDefinitionFromItemAndSubItem(groupItem, item, pageNo, questionNo));
  }

  getOutputDefinitionForAdditionalInputFromItem(type, item, pageNo = '0', questionNo = '0') {
    const label = `${item.getPlainLabel()}-入力欄`;
    const dlLabel = `${this.getPlainTitle()}-${item.getPlainLabel()}-入力欄`;
    return new OutputDefinition({
      _id: `${item.getId()}_additional_input`,
      questionId: this.getId(),
      devId: `${item.getDevId()}_text`,
      name: `${item.getId()}__text`,
      label,
      dlLabel,
      question: this,
      outputType: item.getAdditionalInputType(),
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, `${type}${item.getIndex() + 1}`, 'additional'),
    });
  }

  /** 追加入力のためのOutputDefinitionを取得する */
  getOutputDefinitionForAdditionalInput(pageNo = '0', questionNo = '0') {
    const outputDefinitionsForItem = this.getItems()
      .filter(item => item.hasAdditionalInput())
      .map(item => this.getOutputDefinitionForAdditionalInputFromItem('row', item, pageNo, questionNo));
    const outputDefinitionsForSubItem = this.getSubItems()
      .filter(item => item.hasAdditionalInput())
      .map(item => this.getOutputDefinitionForAdditionalInputFromItem('column', item, pageNo, questionNo));
    if (this.isMatrixReverse()) {
      return outputDefinitionsForSubItem.concat(outputDefinitionsForItem);
    }
    return outputDefinitionsForItem.concat(outputDefinitionsForSubItem);
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo = '0', questionNo = '0') {
    const matrixType = this.getMatrixType();
    const additionalInputOutputDefinitions = this.getOutputDefinitionForAdditionalInput(pageNo, questionNo);
    switch (matrixType) {
      case 'radio': {
        const commonOutputDefinitions = this.getOutputDefinitionsCommon(pageNo, questionNo);
        return commonOutputDefinitions.concat(additionalInputOutputDefinitions);
      }
      case 'checkbox': {
        const commonOutputDefinitions = this.getOutputDefinitionsCommon(pageNo, questionNo);
        return commonOutputDefinitions.concat(additionalInputOutputDefinitions);
      }
      case 'text':
        return this.getOutputDefinitionsCommon(pageNo, questionNo)
          .concat(additionalInputOutputDefinitions);
      case 'number': {
        const sumColumnsOutputDefinitions = this.getOutputDefinitionForSum('columns', pageNo, questionNo);
        const rowColumnsOutputDefinitions = this.getOutputDefinitionForSum('rows', pageNo, questionNo);
        const commonOutputDefinitions = this.getOutputDefinitionsCommon(pageNo, questionNo);
        if (this.isMatrixReverse()) {
          return commonOutputDefinitions
            .concat(sumColumnsOutputDefinitions)
            .concat(rowColumnsOutputDefinitions)
            .concat(additionalInputOutputDefinitions);
        }
        return commonOutputDefinitions
          .concat(rowColumnsOutputDefinitions)
          .concat(sumColumnsOutputDefinitions)
          .concat(additionalInputOutputDefinitions);
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

    const replacer = survey.getReplacer();
    const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId());
    if (!replacer.validate(this.getItems().map(item => item.getLabel()).join(''), outputDefinitions)) errors = errors.push('行項目で存在しない参照があります');
    if (!replacer.validate(this.getSubItems().map(subItem => subItem.getLabel()).join(''), outputDefinitions)) errors = errors.push('列項目で存在しない参照があります');

    this.getItems().forEach((item) => {
      const itemErrors = item.validate(survey, node, page, this)
        .map(itemError => new ValidationErrorDefinition({ type: itemError.getType(), message: `行${item.getIndex() + 1} ${itemError.getMessage()}` }));
      itemErrors.forEach((error) => { errors = errors.push(error); });
    });
    this.getSubItems().forEach((item) => {
      const itemErrors = item.validate(survey, node, page, this)
        .map(itemError => new ValidationErrorDefinition({ type: itemError.getType(), message: `列${item.getIndex() + 1} ${itemError.getMessage()}` }));
      itemErrors.forEach((error) => { errors = errors.push(error); });
    });

    // フリーモードまたはテーブルカスタマイズの場合ランダム注意
    if (page.isFreeMode() || this.isMatrixHtmlEnabled()) {
      const $html = $(page.isFreeMode() ? page.getHtml() : this.getMatrixHtml());
      const itemId = this.getItems().get(0).getId();
      const $table = $html.find(`#${itemId}`).parents('table');
      if (this.isRandom() && $table.find('[rowspan]').length > 0) {
        errors = errors.push(ValidationErrorDefinition.createWarning('表形式で行項目をランダム表示を選択していますが、列が結合されており正しく動作しない可能性があります'));
      }
      if (this.isSubItemsRandom() && $table.find('[colspan]').length > 0) {
        errors = errors.push(ValidationErrorDefinition.createWarning('表形式で列項目をランダム表示を選択していますが、行が結合されており正しく動作しない可能性があります'));
      }
    }

    // itemIdの行または列がない場合警告
    if (page.isFreeMode() || this.isMatrixHtmlEnabled()) {
      const $html = $(page.isFreeMode() ? page.getHtml() : this.getMatrixHtml());
      // 行
      errors = errors.concat(
        this
          .getItems()
          .filter(item => $html.find(`tr#${item.getId()}`).length === 0)
          .map(item => ValidationErrorDefinition.createWarning(`テーブルの行ラベル「${item.getLabel()}」に対応する行が存在していません`)),
      );

      // 列
      errors = errors.concat(
        this
          .getSubItems()
          .filter(subItem => $html.find(`td#${subItem.getId()}`).length === 0)
          .map(subItem => ValidationErrorDefinition.createWarning(`テーブルの列ラベル「${subItem.getLabel()}」に対応する列が存在していません`)),
      );
    }

    return errors;
  }
}
