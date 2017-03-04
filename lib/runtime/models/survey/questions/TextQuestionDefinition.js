import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';

/** 設問定義：複数行テキスト */
export default class TextQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new TextQuestionDefinition({ _id: cuid(), dataType: 'Text' });
  }

  /** 出力に使用する名前を取得する */
  getOutputName() {
    return this.getId();
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    const name = this.getOutputName();
    const ret = List();
    return ret.push(new OutputDefinition({
      _id: name,
      name,
      label: `${this.getPlainTitle()}`,
      outputType: 'text',
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo),
    }));
  }
}
