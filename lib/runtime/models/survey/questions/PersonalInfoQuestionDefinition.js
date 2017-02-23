import uuid from 'node-uuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './BaseQuestionDefinition';
import OutputDefinition from './OutputDefinition';
import PREFECTURES from '../../../../constants/prefectures';

/** 設問定義：個人情報 */
export default class PersonalInfoQuestionDefinition extends BaseQuestionDefinition {
  static create() {
    return new PersonalInfoQuestionDefinition({
      _id: uuid.v4(),
      title: '弊社より、日程の調整やアンケートの回答に関する確認の為にご連絡をさせて頂きます。 ご連絡させて頂くにあたり、下記をお知らせください。',
      plainTitle: '個人情報', // plainTitleは変更できず、Graph内に表示される
      dataType: 'PersonalInfo',
    });
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    const id = this.getId();
    const outputDefinitionArray = [
        { id: 'name', label: '氏名', outputType: 'text' },
        { id: 'furigana', label: 'フリガナ', outputType: 'text' },
        { id: 'hospitalName', label: '病院名（施設名）', outputType: 'text' },
        { id: 'hospitalPrefecture', label: '病院所在地', outputType: 'select', overrideItems: PREFECTURES },
        { id: 'specialty', label: '診療科', outputType: 'text' },
        { id: 'position', label: '役職名', outputType: 'text' },
        { id: 'age', label: '年齢', outputType: 'number' },
        { id: 'sex', label: '性別', outputType: 'radio', overrideItems: ['男', '女'] },
        { id: 'mobileTel', label: '携帯電話番号', outputType: 'text' },
        { id: 'homeTel', label: 'TEL（自宅）', outputType: 'text' },
        { id: 'workTel', label: 'TEL（勤務先）', outputType: 'text' },
        { id: 'email', label: 'Eメール', outputType: 'text' },
        { id: 'scheduleContact1', label: '日程調整:携帯電話', outputType: 'checkbox' },
        { id: 'scheduleContact2', label: '日程調整:TEL（自宅）', outputType: 'checkbox' },
        { id: 'scheduleContact3', label: '日程調整:TEL（勤務先）', outputType: 'checkbox' },
        { id: 'scheduleContact4', label: '日程調整:Eメール', outputType: 'checkbox' },
        { id: 'contactTimeWeekday', label: '日程調整:ご連絡のつきやすい時間帯（平日）', outputType: 'text' },
        { id: 'contactTimeWeekend', label: '日程調整:ご連絡のつきやすい時間帯（休日）', outputType: 'text' },
        { id: 'interviewContact1', label: 'インタビュー:携帯電話', outputType: 'checkbox' },
        { id: 'interviewContact2', label: 'インタビュー:TEL（自宅）', outputType: 'checkbox' },
        { id: 'interviewContact3', label: 'インタビュー:TEL（勤務先）', outputType: 'checkbox' },
    ].map((item, i) => new OutputDefinition({
      _id: `${id}_${item.id}`, // 並び替えがないので_idとnameは同一で構わない
      name: `${id}_${item.id}`,
      label: `${this.getPlainTitle()} ${item.label}`,
      outputType: item.outputType,
      overrideItems: item.overrideItems ? List(item.overrideItems) : null,
      postfix: `${i + 1}`,
    }));
    return List(outputDefinitionArray);
  }
}
