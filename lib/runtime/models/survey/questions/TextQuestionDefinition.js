import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';

/** 設問定義：複数行テキスト */
export default class TextQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new TextQuestionDefinition({ _id: uuid.v4(), dataType: 'Text' });
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    const id = this.getId();
    const ret = List();
    return ret.push(new OutputDefinition({
      _id: id,
      name: id,
      label: `${this.getPlainTitle()}`,
      outputType: 'text',
    }));
  }
}
