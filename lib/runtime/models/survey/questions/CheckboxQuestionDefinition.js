import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';
import surveyIdGeneratorInstance from '../../../SurveyIdGenerator';

/** 設問定義：複数選択肢 */
export default class CheckboxQuestionDefinition extends BaseQuestionDefinition {
  static create(options) {
    const questionId = surveyIdGeneratorInstance.generateQuestionId(options.pageId);
    const itemId = surveyIdGeneratorInstance.generateItemId();
    return new CheckboxQuestionDefinition({
      _id: questionId,
      dataType: 'Checkbox',
      items: List().push(ItemDefinition.create(itemId, 0, '1')),
    });
  }

  /** 出力に使用する名前を取得する */
  getOutputName(additionalInput, itemId) {
    return additionalInput ? `${this.getId()}_${itemId}__text` : `${this.getId()}_${itemId}`;
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    let outputDefinitions = List();
    this.getItems().forEach((item) => {
      outputDefinitions = outputDefinitions.push(new OutputDefinition({
        _id: item.getId(),
        questionId: this.getId(),
        name: this.getOutputName(false, item.getId()),
        label: item.getPlainLabel(),
        dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}`,
        question: this,
        outputType: 'checkbox',
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, item.getIndex() + 1),
      }));
      // 追加入力分
      if (item.hasAdditionalInput()) {
        outputDefinitions = outputDefinitions.push(new OutputDefinition({
          _id: `${this.getId()}__text`,
          questionId: this.getId(),
          name: this.getOutputName(true, item.getId()),
          label: `${item.getPlainLabel()}-入力欄`,
          dlLabel: `${this.getPlainTitle()}-${item.getPlainLabel()}-入力欄`,
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
        .set('value', '1'),
    ).toList());
  }

  /** 正しく設定されているかチェックする */
  validate(survey) {
    let errors = super.validate(survey);
    const page = survey.findPageFromQuestion(this.getId());
    const node = survey.findNodeFromRefId(page.getId());
    this.getItems().forEach((item) => {
      const itemErrors = item.validate(survey, node, page, this).map(itemError => `選択肢${item.getIndex() + 1} ${itemError}`);
      itemErrors.forEach((error) => { errors = errors.push(error); });
    });
    return errors;
  }
}
