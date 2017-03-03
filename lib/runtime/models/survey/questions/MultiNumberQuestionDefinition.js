import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';
import ItemDefinition from './ItemDefinition';

/** 設問定義：数値記入 */
export default class MultiNumberQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new MultiNumberQuestionDefinition({
      _id: cuid(),
      dataType: 'MultiNumber',
      items: List().push(ItemDefinition.create(0)),
    });
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    let outputDefinitions = List();
    this.getItems().forEach((item) => {
      const baseName = `${this.getId()}__value${item.getIndex() + 1}`;
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        _id: item.getId(),
        name: `${baseName}`,
        label: `${item.getPlainLabel()}`,
        postfix: `${item.getIndex() + 1}`,
        outputType: 'number',
      }));
    });
    // 合計値
    if (this.showTotal) {
      const name = `${this.getId()}__total`;
      return outputDefinitions.push(new OutputDefinition({
        _id: name,
        name,
        label: '合計値',
        postfix: 'total',
        outputType: 'number',
      }));
    }
    return outputDefinitions;
  }
}
