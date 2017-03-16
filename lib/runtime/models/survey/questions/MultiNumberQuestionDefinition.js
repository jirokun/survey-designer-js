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

  /** 出力に使用する名前を取得する */
  getOutputName(isTotal, index = null) {
    if (isTotal) {
      return `${this.getId()}__total`;
    }
    return `${this.getId()}__value${index + 1}`;
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    let outputDefinitions = List();
    this.getItems().forEach((item) => {
      const name = this.getOutputName(false, item.getIndex());
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        _id: item.getId(),
        name,
        label: `${item.getPlainLabel()}`,
        question: this,
        outputType: 'number',
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1),
      }));
    });
    // 合計値
    if (this.showTotal) {
      const name = this.getOutputName(true);
      return outputDefinitions.push(new OutputDefinition({
        _id: name, // totalは入れ替えが無いのでidとnameが同一で問題ない
        name,
        label: '合計値',
        question: this,
        outputType: 'number',
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, 'total'),
      }));
    }
    return outputDefinitions;
  }
}
