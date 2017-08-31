import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';

/** 設問定義：複数行テキスト */
export default class TextQuestionDefinition extends BaseQuestionDefinition {
  static create(pageDevId) {
    return new TextQuestionDefinition({
      _id: cuid(),
      devId: surveyDevIdGeneratorInstance.generateForQuestion(pageDevId),
      dataType: 'Text',
    });
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
      questionId: this.getId(),
      devId: this.getDevId(),
      name,
      label: `${this.getPlainTitle()}`,
      dlLabel: `${this.getPlainTitle()}`,
      question: this,
      outputType: 'text',
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo),
    }));
  }
}
