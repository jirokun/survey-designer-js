import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';
import ItemDefinition from './ItemDefinition';

/** 設問定義：単一選択肢 */
export default class RadioQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new RadioQuestionDefinition({
      _id: cuid(),
      dataType: 'Radio',
      items: List().push(ItemDefinition.create(0)),
    });
  }

  /** 出力に使用する名前を取得する */
  getOutputName(index, additionalInput) {
    const id = this.getId();
    if (additionalInput) return `${id}__value${index + 1}`;
    return id;
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    const outputDefinitionArray = [];
    const outputName = this.getOutputName(null, false);
    outputDefinitionArray.push(new OutputDefinition({
      _id: outputName,
      name: outputName,
      label: `${this.getPlainTitle()}`,
      outputType: 'radio',
    }));
    // 追加入力分
    this.getItems().forEach((item) => {
      if (!item.hasAdditionalInput()) return;
      const additionInputId = this.getOutputName(item.getIndex(), true);
      outputDefinitionArray.push(new OutputDefinition({
        _id: item.getId(),
        name: additionInputId,
        label: `${item.getPlainLabel()}の自由入力`,
        outputType: item.getAdditionalInputType(),
        postfix: `${item.getIndex() + 1}-text`,
      }));
    });
    return List(outputDefinitionArray);
  }
}
