import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';
import ValidationErrorDefinition from '../../ValidationErrorDefinition';

/** 設問定義：複数選択肢 */
export default class CheckboxQuestionDefinition extends BaseQuestionDefinition {
  static create(pageDevId) {
    const questionDevId = surveyDevIdGeneratorInstance.generateForQuestion(pageDevId);
    const itemDevId = surveyDevIdGeneratorInstance.generateForItem(questionDevId);
    return new CheckboxQuestionDefinition({
      _id: cuid(),
      devId: questionDevId,
      dataType: 'Checkbox',
      items: List().push(ItemDefinition.create(itemDevId, 0, '1')),
    });
  }

  /** 出力に使用する名前を取得する */
  getOutputName(index, additionalInput) {
    const baseName = `${this.getId()}__value${index + 1}`;
    if (additionalInput) return `${baseName}__text`;
    return baseName;
  }

  getOutputDevId(devId, additionalInput) {
    if (additionalInput) return `${devId}_text`;
    return devId;
  }

  getOutputDefinitionFromItem(item, pageNo, questionNo, isAdditionalInput) {
    if (!isAdditionalInput) {
      return new OutputDefinition({
        _id: item.getId(),
        questionId: this.getId(),
        name: this.getOutputName(item.getIndex(), false),
        devId: this.getOutputDevId(item.getDevId(), false),
        label: item.getPlainLabel(),
        dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}`,
        question: this,
        outputType: 'checkbox',
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1),
      });
    }
    return new OutputDefinition({
      _id: `${item.getId()}__text`,
      questionId: this.getId(),
      name: this.getOutputName(item.getIndex(), true),
      devId: this.getOutputDevId(item.getDevId(), true),
      label: `${item.getPlainLabel()}-入力欄`,
      dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}-入力欄`,
      question: this,
      outputType: item.getAdditionalInputType(),
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1, 'text'),
    });
  }

  /** itemからoutputDefinitionを取得する */
  getOutputDefinitionsFromItem(item, pageNo = '0', questionNo = '0') {
    const outputDefinitions = [];
    outputDefinitions.push(this.getOutputDefinitionFromItem(item, pageNo, questionNo, false));

    if (item.hasAdditionalInput()) {
      outputDefinitions.push(this.getOutputDefinitionFromItem(item, pageNo, questionNo, true));
    }

    return List(outputDefinitions);
  }

  /**
   * 設問が出力する項目の一覧を返す
   * outputNoが不要な場合、pageNoとquestionNoは省略可能
   */
  getOutputDefinitions(pageNo = '0', questionNo = '0') {
    return this.getItems()
      .reduce((outputDefinitions, item) => outputDefinitions.concat(this.getOutputDefinitionsFromItem(item, pageNo, questionNo)), List());
  }

  /** indexの値を更新する */
  fixItemIndex() {
    return this.set('items', this.getItems().map((item, i) =>
      item
        .set('index', i)
        .set('value', '1'),
    ).toList());
  }

  /** 正しく設定されているかチェックする */
  validate(survey) {
    let errors = super.validate(survey);
    const page = survey.findPageFromQuestion(this.getId());
    const node = survey.findNodeFromRefId(page.getId());

    const replacer = survey.getReplacer();
    const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId());
    if (!replacer.validate(this.getItems().map(item => item.getLabel()).join(''), outputDefinitions)) errors = errors.push('選択肢で存在しない参照があります');

    this.getItems().forEach((item) => {
      const itemErrors = item.validate(survey, node, page, this).map(itemError => `選択肢${item.getIndex() + 1} ${itemError}`);
      itemErrors.forEach((error) => { errors = errors.push(error); });
    });

    return errors;
  }
}
