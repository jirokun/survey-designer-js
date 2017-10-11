import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';
import CheckboxQuestionDefinition from './CheckboxQuestionDefinition';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';

/** 設問定義：単一選択肢(radio) */
export default class RadioQuestionDefinition extends BaseQuestionDefinition {
  static create(pageDevId) {
    const questionDevId = surveyDevIdGeneratorInstance.generateForQuestion(pageDevId);
    const itemDevId = surveyDevIdGeneratorInstance.generateForItem(questionDevId);
    return new RadioQuestionDefinition({
      _id: cuid(),
      devId: questionDevId,
      dataType: 'Radio',
      items: List().push(ItemDefinition.create(itemDevId, 0, '1')),
    });
  }

  /** 出力するoutputTypeをメソッドとして定義しておく */
  getOutputType() {
    return 'radio';
  }

  /** 出力に使用する名前を取得する */
  getOutputName(index, additionalInput) {
    const id = this.getId();
    if (additionalInput) return `${id}__value${index + 1}`;
    return id;
  }

  getOutputDefinitionOfAdditionalInput(item, pageNo = '0', questionNo = '0') {
    if (!item.hasAdditionalInput()) return null;
    const additionInputId = this.getOutputName(item.getIndex(), true);
    return new OutputDefinition({
      _id: item.getId(),
      questionId: this.getId(),
      devId: item.getDevId(),
      name: additionInputId,
      label: `${item.getPlainLabel()}-入力欄`,
      dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}-入力欄`,
      question: this,
      outputType: item.getAdditionalInputType(),
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1, 'text'),
      choices: this.getItems().map(i => i.getChoiceDefinition()),
    });
  }

  getOutputDefinition(pageNo = '0', questionNo = '0') {
    const outputName = this.getOutputName(null, false);
    return new OutputDefinition({
      _id: outputName,
      questionId: this.getId(),
      devId: this.getDevId(),
      name: outputName,
      label: `${this.getPlainTitle()}`,
      dlLabel: `${this.getPlainTitle()}`,
      question: this,
      outputType: this.getOutputType(),
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo),
      choices: this.getItems().map(i => i.getChoiceDefinition()),
    });
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    const outputDefinitions = List.of(this.getOutputDefinition(pageNo, questionNo));
    // 追加入力分
    const additionalInputOutputDefinitions = this
      .getItems()
      .map(item => this.getOutputDefinitionOfAdditionalInput(item, pageNo, questionNo))
      .filter(od => od !== null);
    return outputDefinitions.concat(additionalInputOutputDefinitions);
  }

  /** 正しく設定されているかチェックする */
  validate(survey) {
    return CheckboxQuestionDefinition.prototype.validate.call(this, survey);
  }
}
