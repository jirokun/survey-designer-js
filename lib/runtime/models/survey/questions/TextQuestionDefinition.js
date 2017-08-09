import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import surveyIdGeneratorInstance from '../../../SurveyIdGenerator';

/** 設問定義：複数行テキスト */
export default class TextQuestionDefinition extends BaseQuestionDefinition {
  static create(options) {
    const id = surveyIdGeneratorInstance.generateQuestionId(options.pageId);
    return new TextQuestionDefinition({ _id: id, dataType: 'Text' });
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
      name,
      label: `${this.getPlainTitle()}`,
      dlLabel: `${this.getPlainTitle()}`,
      question: this,
      outputType: 'text',
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo),
    }));
  }
}
