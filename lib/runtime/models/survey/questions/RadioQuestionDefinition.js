import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';
import CheckboxQuestionDefinition from './CheckboxQuestionDefinition';

/** 設問定義：単一選択肢(radio) */
export default class RadioQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new RadioQuestionDefinition({
      _id: cuid(),
      dataType: 'Radio',
      items: List().push(ItemDefinition.create(0, '1')),
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

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    const outputDefinitionArray = [];
    const outputName = this.getOutputName(null, false);
    outputDefinitionArray.push(new OutputDefinition({
      _id: outputName,
      questionId: this.getId(),
      name: outputName,
      label: `${this.getPlainTitle()}`,
      dlLabel: `${this.getPlainTitle()}`,
      question: this,
      outputType: this.getOutputType(),
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo),
      choices: this.getItems().map(i => i.getChoiceDefinition()),
    }));
    // 追加入力分
    this.getItems().forEach((item) => {
      if (!item.hasAdditionalInput()) return;
      const additionInputId = this.getOutputName(item.getIndex(), true);
      outputDefinitionArray.push(new OutputDefinition({
        _id: item.getId(),
        questionId: this.getId(),
        name: additionInputId,
        label: `${item.getPlainLabel()}-入力欄`,
        dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}-入力欄`,
        question: this,
        outputType: item.getAdditionalInputType(),
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1, 'text'),
        choices: this.getItems().map(i => i.getChoiceDefinition()),
      }));
    });
    return List(outputDefinitionArray);
  }

  /** 正しく設定されているかチェックする */
  validate(survey) {
    return CheckboxQuestionDefinition.prototype.validate.call(this, survey);
  }
}
