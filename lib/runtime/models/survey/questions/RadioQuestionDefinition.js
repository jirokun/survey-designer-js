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

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    const id = this.getId();
    const outputDefinitionArray = [];
    outputDefinitionArray.push(new OutputDefinition({
      _id: id,
      name: id,
      label: `${this.getPlainTitle()}`,
      outputType: 'radio',
    }));
    // 追加入力分
    this.getTransformedItems().forEach((item) => {
      if (!item.hasAdditionalInput()) return;
      const baseName = `${this.getId()}__value${item.getIndex() + 1}`;
      outputDefinitionArray.push(new OutputDefinition({
        _id: `${item.getId()}__text`,
        name: `${baseName}__text`,
        label: `${item.getPlainLabel()}の自由入力`,
        outputType: item.getAdditionalInputType(),
        postfix: `${item.getIndex() + 1}-text`,
      }));
    });
    return List(outputDefinitionArray);
  }
}
