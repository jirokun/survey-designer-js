import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ItemDefinition from './internal/ItemDefinition';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';

/** 設問定義：日程 */
export default class ScheduleQuestionDefinition extends BaseQuestionDefinition {
  static create(pageDevId) {
    const questionDevId = surveyDevIdGeneratorInstance.generateForQuestion(pageDevId);
    const items = this.generateInitialItems(questionDevId);
    const subItems = this.generateInitialSubItems(questionDevId);

    return new ScheduleQuestionDefinition({
      _id: cuid(),
      devId: questionDevId,
      dataType: 'Schedule',
      title: '以下の日時の中よりインタビュー調査にご参加が可能な日時枠と、具体的な時間帯をお知らせください。',
      plainTitle: '日程', // plainTitleは変更できず、Flow内に表示される
      description: `<p>可能な限り、複数日時をお知らせ頂きたくお願い致します。<br>
        (回答例）●月●日（曜日）午後 <span style="border:1px solid black;">レ</span>（14:00－16:00の間）等</p>`,
      items,
      subItems,
    });
  }

  static generateInitialItems(questionDevId) {
    return List([
      '9月2日(月)',
      '9月3日(火)',
    ]).map((label, index) => {
      const itemDevId = surveyDevIdGeneratorInstance.generateForItem(questionDevId);
      return ItemDefinition.create(itemDevId, index)
        .set('label', label)
        .set('plainLabel', label)
        .set('value', `value${index + 1}`);
    }).toList();
  }

  static generateInitialSubItems(questionDevId) {
    return List([
      { label: '<b>A.<br />午前<br />9:00～12:00</b>', plainLabel: '9:00～12:00' },
      { label: '<b>B.<br />午後<br />12:00～16:00</b>', plainLabel: '12:00～16:00' },
      { label: '<b>C.<br />夜間<br />16:00 以降</b>', plainLabel: '16:00 以降' },
    ]).map((e, index) => {
      const itemDevId = surveyDevIdGeneratorInstance.generateForItem(questionDevId);
      return ItemDefinition.create(itemDevId, index)
        .set('label', e.label)
        .set('plainLabel', e.plainLabel)
        .set('value', `value${index + 1}`);
    }).toList();
  }

  /** 出力に使用する名前を取得する */
  getOutputName(other, itemIndex, periodNo) {
    if (other) return `${this.getId()}_other`;
    return `${this.getId()}_value${itemIndex + 1}_period${periodNo}__text`;
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    const periods = this.getSubItems();
    const outputDefinitions = [];
    this.getItems().forEach((item, itemIndex) => {
      periods.forEach((period, periodIndex) => {
        const outputDefinitionId = this.getOutputName(false, item.getIndex(), periodIndex + 1);
        outputDefinitions.push(new OutputDefinition({
          _id: outputDefinitionId,
          questionId: this.getId(),
          devId: `${item.getDevId()}_period${periodIndex + 1}_text`,
          name: outputDefinitionId,
          label: `${item.getPlainLabel()} ${period.getPlainLabel()}`,
          dlLabel: `${item.getPlainLabel()} ${period.getPlainLabel()}`,
          question: this,
          outputType: 'text',
          outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, itemIndex + 1, periodIndex + 1),
        }));
      });
    });

    // 「上記のいずれも都合がつかない」の分
    const otherId = this.getOutputName(true);
    outputDefinitions.push(new OutputDefinition({
      _id: otherId,
      questionId: this.getId(),
      devId: `${this.getDevId()}_other`,
      name: otherId,
      label: '上記のいずれも都合がつかない',
      dlLabel: '上記のいずれも都合がつかない',
      question: this,
      outputType: 'text',
      outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, 'other'),
    }));

    return List(outputDefinitions);
  }
}
