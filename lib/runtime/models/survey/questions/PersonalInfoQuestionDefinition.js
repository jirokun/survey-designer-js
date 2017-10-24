import cuid from 'cuid';
import { List } from 'immutable';
import BaseQuestionDefinition from './internal/BaseQuestionDefinition';
import OutputDefinition from './internal/OutputDefinition';
import * as FIELDS from '../../../../constants/personalInfoFields';
import surveyDevIdGeneratorInstance from '../../../SurveyDevIdGenerator';
import PersonalInfoItemDefinition from './internal/PersonalInfoItemDefinition';

/** 設問定義：個人情報 */
export default class PersonalInfoQuestionDefinition extends BaseQuestionDefinition {
  static create(pageDevId) {
    const questionDevId = surveyDevIdGeneratorInstance.generateForQuestion(pageDevId);

    const question = new PersonalInfoQuestionDefinition({
      _id: cuid(),
      devId: questionDevId,
      title: '弊社より、日程の調整やアンケートの回答に関する確認の為にご連絡をさせて頂きます。 ご連絡させて頂くにあたり、下記をお知らせください。',
      plainTitle: '個人情報', // plainTitleは変更できず、Flow内に表示される
      dataType: 'PersonalInfo',
    });
    return question.updateDefaultItems();
  }

  updateDefaultItems() {
    const items = List([
      {
        rowType: 'NameRow',
        label: '氏名',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.name, label: '名前', outputType: 'text' },
            ],
          },
          {
            id: '2input',
            label: '入力欄2つ',
            fields: [
              { id: FIELDS.lastName, label: '姓(名前)', outputType: 'text' },
              { id: FIELDS.firstName, label: '名(名前)', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'FuriganaRow',
        label: 'フリガナ',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.furigana, label: 'フリガナ', outputType: 'text' },
            ],
          },
          {
            id: '2input',
            label: '入力欄2つ',
            fields: [
              { id: FIELDS.furiganaFirst, label: 'セイ(フリガナ)', outputType: 'text' },
              { id: FIELDS.furiganaLast, label: 'メイ(フリガナ)', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'HospitalNameRow',
        label: '病院名（施設名）',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.hospitalName, label: '病院名(施設名)', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'HospitalPrefectureRow',
        label: '病院所在地',
        isOptional: false,
        displayTypeId: 'select',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: 'select',
            label: '都道府県',
            fields: [
              { id: FIELDS.hospitalPrefecture, label: '都道府県(病院所在地)', outputType: 'text' },
            ],
          },
          { id: 'select_input',
            label: '都道府県+自由',
            fields: [
              { id: FIELDS.hospitalPrefecture, label: '都道府県(病院所在地)', outputType: 'text' },
              { id: FIELDS.hospitalPrefectureText, label: '自由記入(病院所在地)', outputType: 'text' },
            ],
          },
          {
            id: 'input',
            label: '自由記入',
            fields: [
              { id: FIELDS.hospitalPrefectureText, label: '自由記入(病院所在地)', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'WorkPostalCodeRow',
        label: 'ご勤務先　郵便番号',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.workPostalCode, label: 'ご勤務先　郵便番号', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'SpecialityRow',
        label: '診療科',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.specialty, label: '診療科', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'ProfessionalAreaRow',
        label: '専門領域',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.professionalArea, label: '専門領域', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'PositionRow',
        label: '役職名',
        isOptional: true,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.position, label: '役職名', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'AgeRow',
        label: '年齢',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.age, label: '年齢', outputType: 'number' },
            ],
          },
        ],
      },
      {
        rowType: 'SexRow',
        label: '性別',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.sex, label: '性別', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'BirthYearRow',
        label: 'お生まれ年（西暦）',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.birthYear, label: 'お生まれ年（西暦）', outputType: 'number' },
            ],
          },
        ],
      },
      {
        rowType: 'ContactMeansRow',
        label: 'ご連絡方法',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: 'checkbox',
            label: 'チェックボックス',
            fields: [
              { id: FIELDS.contactMeans, label: 'ご連絡方法', outputType: 'checkbox' },
            ],
          },
        ],
      },
      {
        rowType: 'InterviewMeansRow',
        label: 'ご希望のインタビュー手法',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: 'radio',
            label: 'ラジオボタン',
            fields: [
              { id: FIELDS.interviewMeans, label: 'ご希望のインタビュー手法', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'InterviewPlaceRow',
        label: '訪問でのインタビューの場合の訪問場所',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: 'input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.InterviewPlace, label: '訪問でのインタビューの場合の訪問場所', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'ContactEasyTimeRow',
        label: '連絡のつきやすい時間帯',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: 'input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.contactEasyTime, label: '連絡のつきやすい時間帯', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'MobileTelRow',
        label: '携帯電話番号',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.mobileTel, label: '携帯電話番号', outputType: 'text', prependValue: '`' },
            ],
          },
          {
            id: '3input',
            label: '入力欄3つ',
            fields: [
              { id: FIELDS.mobileTel1, label: '携帯電話番号 入力欄1', outputType: 'text', prependValue: '`' },
              { id: FIELDS.mobileTel2, label: '携帯電話番号 入力欄2', outputType: 'text', prependValue: '`' },
              { id: FIELDS.mobileTel3, label: '携帯電話番号 入力欄3', outputType: 'text', prependValue: '`' },
            ],
          },
        ],
      },
      {
        rowType: 'HomeTelRow',
        label: 'TEL（自宅）',
        isOptional: true,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.homeTel, label: 'TEL（自宅）', outputType: 'text', prependValue: '`' },
            ],
          },
          {
            id: '3input',
            label: '入力欄3つ',
            fields: [
              { id: FIELDS.homeTel1, label: 'TEL（自宅） 入力欄1', outputType: 'text', prependValue: '`' },
              { id: FIELDS.homeTel2, label: 'TEL（自宅） 入力欄2', outputType: 'text', prependValue: '`' },
              { id: FIELDS.homeTel3, label: 'TEL（自宅） 入力欄3', outputType: 'text', prependValue: '`' },
            ],
          },
        ],
      },
      {
        rowType: 'WorkTelRow',
        label: 'TEL（勤務先）',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.workTel, label: 'TEL（勤務先）', outputType: 'text', prependValue: '`' },
            ],
          },
          {
            id: '3input',
            label: '入力欄3つ',
            fields: [
              { id: FIELDS.workTel1, label: 'TEL（勤務先） 入力欄1', outputType: 'text', prependValue: '`' },
              { id: FIELDS.workTel2, label: 'TEL（勤務先） 入力欄2', outputType: 'text', prependValue: '`' },
              { id: FIELDS.workTel3, label: 'TEL（勤務先） 入力欄3', outputType: 'text', prependValue: '`' },
            ],
          },
        ],
      },
      {
        rowType: 'FaxRow',
        label: 'FAX番号',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.fax, label: 'FAX番号', outputType: 'text', prependValue: '`' },
            ],
          },
          {
            id: '3input',
            label: '入力欄3つ',
            fields: [
              { id: FIELDS.fax1, label: 'FAX番号 入力欄1', outputType: 'text', prependValue: '`' },
              { id: FIELDS.fax2, label: 'FAX番号 入力欄2', outputType: 'text', prependValue: '`' },
              { id: FIELDS.fax3, label: 'FAX番号 入力欄3', outputType: 'text', prependValue: '`' },
            ],
          },
        ],
      },
      {
        rowType: 'EmailRow',
        label: 'Eメール',
        isOptional: false,
        displayTypeId: '1input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.email, label: 'Eメール', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'RequestEtcRow',
        label: 'その他ご要望',
        isOptional: true,
        displayTypeId: 'none',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.requestEtc, label: 'その他ご要望', outputType: 'text', prependValue: '`' },
            ],
          },
        ],
      },
      {
        rowType: 'ScheduleRow',
        label: '日程調整',
        isOptional: false,
        displayTypeId: 'multi_input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: 'multi_input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.scheduleContactMobileTel, label: '日程調整:携帯電話', outputType: 'checkbox' },
              { id: FIELDS.scheduleContactHomeTel, label: '日程調整:TEL（自宅）', outputType: 'checkbox' },
              { id: FIELDS.scheduleContactWorkTel, label: '日程調整:TEL（勤務先）', outputType: 'checkbox' },
              { id: FIELDS.scheduleContactEmail, label: '日程調整:Eメール', outputType: 'checkbox' },
              { id: FIELDS.contactTimeWeekday, label: '日程調整:ご連絡のつきやすい時間帯（平日）', outputType: 'text' },
              { id: FIELDS.contactTimeWeekend, label: '日程調整:ご連絡のつきやすい時間帯（休日）', outputType: 'text' },
            ],
          },
        ],
      },
      {
        rowType: 'InterviewRow',
        isOptional: false,
        label: 'インタビュー',
        displayTypeId: 'multi_input',
        displayTypeCandidates: [
          { id: 'none', label: '非表示' },
          {
            id: 'multi_input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.interviewContactMobileTel, label: 'インタビュー:携帯電話', outputType: 'checkbox' },
              { id: FIELDS.interviewContactHomeTel, label: 'インタビュー:TEL（自宅）', outputType: 'checkbox' },
              { id: FIELDS.interviewContactWorkTel, label: 'インタビュー:TEL（勤務先）', outputType: 'checkbox' },
            ],
          },
        ],
      },
    ]).map((item, index) => PersonalInfoItemDefinition.create(
      index,
      item.rowType,
      item.label,
      item.isOptional,
      item.displayTypeId,
      item.displayTypeCandidates,
    )).toList();

    return this.set('items', items);
  }

  /** 出力に使用する名前を取得する */
  getOutputName(propName) {
    return `${this.getId()}_${propName}`;
  }

  /** チェックボックスのラベル文字列のIdをoutputNameから取得する */
  getCheckboxLabelId(outputName) {
    return `${outputName}__text`;
  }

  /** チェックボックスのラベル文字列のIdをpropNameから取得する */
  getCheckboxLabelIdByPropName(propName) {
    return this.getOutputName(this.getCheckboxLabelId(propName));
  }

  getLabel(item, field) {
    const label = field.getLabel();
    if (label) { return label; }
    return item.getLabel();
  }

  getFieldName(outputName) {
    const names = outputName.split('_');
    return names[names.length - 1];
  }

  isHomeTelCheckbox(outputName) {
    const fieldName = this.getFieldName(outputName);
    return FIELDS.homeTelCheckboxList.some(f => f === fieldName);
  }

  isMobileTelCheckbox(outputName) {
    const fieldName = this.getFieldName(outputName);
    return FIELDS.mobileTelCheckboxList.some(f => f === fieldName);
  }

  isWorkTelCheckbox(outputName) {
    const fieldName = this.getFieldName(outputName);
    return FIELDS.workTelCheckboxList.some(f => f === fieldName);
  }

  isEmailCheckbox(outputName) {
    const fieldName = this.getFieldName(outputName);
    return FIELDS.emailCheckboxList.some(f => f === fieldName);
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    let index = 0;
    const res = [];
    this.getItems().forEach((item) => {
      item.getFields().forEach((field) => {
        index += 1;
        const od = new OutputDefinition({
          _id: this.getOutputName(field.getId()),
          questionId: this.getId(),
          devId: `${this.getDevId()}_${field.getId()}`,
          name: this.getOutputName(field.getId()),
          label: `${this.getLabel(item, field)}`,
          dlLabel: `${this.getLabel(item, field)}`,
          question: this,
          outputType: field.getOutputType(),
          outputNo: BaseQuestionDefinition.createOutputNo(pageNo, questionNo, index),
          prependValue: field.getPrependValue(),
        });
        res.push(od);
      });
    });
    return List(res);
  }
}
