import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import ChoiceDefinition from './internal/ChoiceDefinition';
import PREFECTURES from '../../../../constants/prefectures';
import * as FIELDS from '../../../../constants/personalInfoFields';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';
import PersonalItemDefinition from './internal/ItemDefinition';

/** 設問定義：個人情報 */
export default class PersonalInfoQuestionDefinition extends BaseQuestionDefinition {
  static create(pageDevId) {
    const questionDevId = surveyDevIdGeneratorInstance.generateForQuestion(pageDevId);

    // TODO: このあたりを選択できるようにする
    [
      { id: FIELDS.name, label: '氏名', outputType: 'text' },
      { id: FIELDS.furigana, label: 'フリガナ', outputType: 'text' },
      { id: FIELDS.hospitalName, label: '病院名（施設名）', outputType: 'text' },
      { id: FIELDS.hospitalPrefecture, label: '病院所在地', outputType: 'text' },
      { id: FIELDS.specialty, label: '診療科', outputType: 'text' },
      { id: FIELDS.position, label: '役職名', outputType: 'text' },
      { id: FIELDS.age, label: '年齢', outputType: 'number' },
      { id: FIELDS.sex, label: '性別', outputType: 'text' },
      { id: FIELDS.mobileTel, label: '携帯電話番号', outputType: 'text', prependValue: '`' },
      { id: FIELDS.homeTel, label: 'TEL（自宅）', outputType: 'text', prependValue: '`' },
      { id: FIELDS.workTel, label: 'TEL（勤務先）', outputType: 'text', prependValue: '`' },
      { id: FIELDS.email, label: 'Eメール', outputType: 'text' },
      { id: FIELDS.scheduleContact1, label: '日程調整:携帯電話', outputType: 'checkbox' },
      { id: FIELDS.scheduleContact2, label: '日程調整:TEL（自宅）', outputType: 'checkbox' },
      { id: FIELDS.scheduleContact3, label: '日程調整:TEL（勤務先）', outputType: 'checkbox' },
      { id: FIELDS.scheduleContact4, label: '日程調整:Eメール', outputType: 'checkbox' },
      { id: FIELDS.contactTimeWeekday, label: '日程調整:ご連絡のつきやすい時間帯（平日）', outputType: 'text' },
      { id: FIELDS.contactTimeWeekend, label: '日程調整:ご連絡のつきやすい時間帯（休日）', outputType: 'text' },
      { id: FIELDS.interviewContact1, label: 'インタビュー:携帯電話', outputType: 'checkbox' },
      { id: FIELDS.interviewContact2, label: 'インタビュー:TEL（自宅）', outputType: 'checkbox' },
      { id: FIELDS.interviewContact3, label: 'インタビュー:TEL（勤務先）', outputType: 'checkbox' },
    ].map(item => new PersonalItemDefinition({ _id: item.id, label: item.label, outputType: item.outputType }));

    const items = List().push()


    return new PersonalInfoQuestionDefinition({
      _id: cuid(),
      devId: questionDevId,
      title: '弊社より、日程の調整やアンケートの回答に関する確認の為にご連絡をさせて頂きます。 ご連絡させて頂くにあたり、下記をお知らせください。',
      plainTitle: '個人情報', // plainTitleは変更できず、Flow内に表示される
      dataType: 'PersonalInfo',
      items: items,
    });
  }

  /** 出力に使用する名前を取得する */
  getOutputName(propName) {
    return `${this.getId()}_${propName}`;
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    const outputDefinitionArray = this.getItems().map((item, i) => (
      new OutputDefinition({
        _id: this.getOutputName(item.id),
        questionId: this.getId(),
        devId: `${this.getDevId()}_${item.id}`,
        name: this.getOutputName(item.id),
        label: `${item.getLabel()}`,
        dlLabel: `${item.getLabel()}`,
        question: this,
        outputType: item.outputType,
        outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, i + 1),
        prependValue: item.prependValue,
      })
    ));
    return List(outputDefinitionArray);
  }
}
