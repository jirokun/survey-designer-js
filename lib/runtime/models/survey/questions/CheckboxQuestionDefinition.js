import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';
import ItemDefinition from './ItemDefinition';

/** 設問定義：複数選択肢 */
export default class CheckboxQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new CheckboxQuestionDefinition({
      _id: cuid(),
      dataType: 'Checkbox',
      items: List().push(ItemDefinition.create(0)),
    });
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    let outputDefinitions = List();
    this.getTransformedItems().forEach((item) => {
      const baseName = `${this.getId()}__value${item.getIndex() + 1}`;
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        _id: item.getId(),
        name: `${baseName}`,
        label: `${item.getPlainLabel()}`,
        outputType: 'checkbox',
        postfix: `${item.getIndex() + 1}`,
      }));
      // 追加入力分
      if (item.hasAdditionalInput()) {
        outputDefinitions = outputDefinitions.push(new OutputDefinition({
          _id: `${item.getId()}__text`,
          name: `${baseName}__text`,
          label: `${item.getPlainLabel()}の自由入力`,
          outputType: item.getAdditionalInputType(),
          postfix: `${item.getIndex() + 1}-text`,
        }));
      }
    });
    return outputDefinitions;
  }
}
