import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';
import ItemDefinition from './ItemDefinition';

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
      _id: uuid.v4(),
      dataType: 'Schedule',
      title: '以下の日時の中よりインタビュー調査にご参加が可能な日時枠と、具体的な時間帯をお知らせください。',
      plainTitle: 'スケジュール',
      description: `<p>可能な限り、複数日時をお知らせ頂きたくお願い致します。<br>
        (回答例）●月●日（曜日）午後 <span style="border:1px solid black;">レ</span>（14:00－16:00の間）等</p>`,
      items,
    });
  }

  getOutputDefinitions() {
    const id = this.getId();
    const ret = List();
    return ret.push(new OutputDefinition({
      _id: id,
      name: id,
      label: `${this.getPlainTitle()}`,
      outputType: 'radio',
    }));
  }
}
