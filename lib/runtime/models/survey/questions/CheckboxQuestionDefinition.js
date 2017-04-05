import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';

/** 設問定義：複数選択肢 */
export default class CheckboxQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new CheckboxQuestionDefinition({
      _id: cuid(),
      dataType: 'Checkbox',
      items: List().push(ItemDefinition.create(0, 'on')),
    });
  }

  /** 出力に使用する名前を取得する */
  getOutputName(index, additionalInput) {
    const baseName = `${this.getId()}__value${index + 1}`;
    if (additionalInput) return `${baseName}__text`;
    return baseName;
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    let outputDefinitions = List();
    this.getItems().forEach((item) => {
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        _id: item.getId(),
        name: this.getOutputName(item.getIndex(), false),
        label: item.getPlainLabel(),
        dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}`,
        question: this,
        outputType: 'checkbox',
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1),
      }));
      // 追加入力分
      if (item.hasAdditionalInput()) {
        outputDefinitions = outputDefinitions.push(new OutputDefinition({
          _id: `${item.getId()}__text`,
          name: this.getOutputName(item.getIndex(), true),
          label: `${item.getPlainLabel()}-自由入力`,
          dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}-自由入力`,
          question: this,
          outputType: item.getAdditionalInputType(),
          outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1, 'text'),
        }));
      }
    });
    return outputDefinitions;
  }

  /** indexの値を更新する */
  fixItemIndex() {
    return this.set('items', this.getItems().map((item, i) =>
      item
        .set('index', i)
        .set('value', 'on'),
    ).toList());
  }
}
