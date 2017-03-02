import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';
import ItemDefinition from './ItemDefinition';

/** 設問定義：日程 */
export default class ScheduleQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    const items = List([
      '9月2日(月)',
      '9月3日(火)',
    ]).map((label, index) =>
      ItemDefinition.create(index)
        .set('label', label)
        .set('plainLabel', label)
        .set('value', `value${index + 1}`),
    ).toList();

    return new ScheduleQuestionDefinition({
      _id: cuid(),
      dataType: 'Schedule',
      title: '以下の日時の中よりインタビュー調査にご参加が可能な日時枠と、具体的な時間帯をお知らせください。',
      plainTitle: '日程', // plainTitleは変更できず、Graph内に表示される
      description: `<p>可能な限り、複数日時をお知らせ頂きたくお願い致します。<br>
        (回答例）●月●日（曜日）午後 <span style="border:1px solid black;">レ</span>（14:00－16:00の間）等</p>`,
      items,
    });
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    const id = this.getId();
    const periods = [
      { no: 1, label: '午前  9:00～12:00' },
      { no: 2, label: '午後 12:00～16:00' },
      { no: 3, label: '夜間 16:00 以降' },
    ];
    const outputDefinitions = [];
    let postfix = 1;
    this.getItems().forEach((item, itemIndex) => {
      periods.forEach((period) => {
        const outputDefinitionId = `${id}_value${itemIndex + 1}_period${period.no}__text`;
        outputDefinitions.push(new OutputDefinition({
          _id: outputDefinitionId,
          name: outputDefinitionId,
          label: `${item.getPlainLabel()} ${period.label}`,
          outputType: 'text',
          postfix: `${postfix++}`,
        }));
      });
    });

    // 「上記のいずれも都合がつかない」の分
    outputDefinitions.push(new OutputDefinition({
      _id: `${id}_other}`,
      name: `${id}_other}`,
      label: '上記のいずれも都合がつかない',
      outputType: 'text',
      postfix: `${postfix++}`,
    }));

    return List(outputDefinitions);
  }
}
