import cuid from 'cuid';
import { Record, List } from 'immutable';
import PersonalInfoItemDisplayTypeDefinition from './PersonalInfoItemDisplayTypeDefinition';
import * as FIELDS from '../../../../../constants/personalInfoFields';

export const PersonalInfoItemRecord = Record({
  _id: null,                                  // ID
  dataType: 'PersonalInfoItem',               // Itemのタイプ
  devId: null,                                // DevId
  index: -1,                                  // 定義順
  label: '',                                  // HTMLとして評価されるラベル
  plainLabel: '',                             // TEXTとして評価されるラベル
  value: '',                                  // 値を指定したい場合に指定する (Itemの並び順変更のために必要)
  rowType: null,                              // 列の種別
  isOptional: false,                          // 任意なら true、必須なら false
  displayTypeId: null,                        // 表示形式
});

export default class PersonalInfoItemDefinition extends PersonalInfoItemRecord {
  static create(index, rowType, label, isOptional, displayTypeId) {
    return new PersonalInfoItemDefinition({
      _id: cuid(),
      index,
      rowType,
      isOptional,
      displayTypeId,
      label,
      plainLabel: label,
    });
  }

  getId() {
    return this.get('_id');
  }

  getIndex() {
    return this.get('index');
  }

  getLabel() {
    return this.get('label');
  }

  getPlainLabel() {
    return this.get('plainLabel');
  }

  getDevId() {
    return this.get('devId');
  }

  getRowType() {
    return this.get('rowType');
  }

  getFields() {
    const currentDisplayTypeId = this.getDisplayTypeId();
    const displayType = this.getDisplayTypeCandidates().find(dt => dt.getId() === currentDisplayTypeId);
    return displayType ? displayType.getPersonalItemFields() : List();
  }

  getDisplayTypeId() {
    return this.get('displayTypeId');
  }

  getDisplayTypeCandidates() {
    let displayTypeCandidates;
    switch (this.getRowType()) {
      case 'AgeRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.age, label: '年齢', outputType: 'number' },
            ],
          },
        ];
        break;
      case 'BirthYearRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.birthYear, label: 'お生まれ年（西暦）', outputType: 'number' },
            ],
          },
        ];
        break;
      case 'ContactEasyTimeRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: 'input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.contactEasyTime, label: '連絡のつきやすい時間帯', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'ContactMeansRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: 'checkbox',
            label: 'チェックボックス',
            fields: [
              { id: FIELDS.contactMeans, label: 'ご連絡方法', outputType: 'checkbox' },
            ],
          },
        ];
        break;
      case 'EmailRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.email, label: 'Eメール', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'FaxRow':
        displayTypeCandidates = [
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
        ];
        break;
      case 'FuriganaRow':
        displayTypeCandidates = [
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
        ];
        break;
      case 'NameRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.name, label: '氏名', outputType: 'text' },
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
        ];
        break;
      case 'HomeTelRow':
        displayTypeCandidates = [
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
        ];
        break;
      case 'HospitalNameRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.hospitalName, label: '病院名(施設名)', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'HospitalPrefectureRow':
        displayTypeCandidates = [
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
        ];
        break;
      case 'InterviewMeansRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: 'radio',
            label: 'ラジオボタン',
            fields: [
              { id: FIELDS.interviewMeans, label: 'ご希望のインタビュー手法', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'InterviewPlaceRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: 'input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.InterviewPlace, label: '訪問でのインタビューの場合の訪問場所', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'InterviewRow':
        displayTypeCandidates = [
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
        ];
        break;
      case 'MobileTelRow':
        displayTypeCandidates = [
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
        ];
        break;
      case 'PositionRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.position, label: '役職名', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'ProfessionalAreaRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.professionalArea, label: '専門領域', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'RequestEtcRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.requestEtc, label: 'その他ご要望', outputType: 'text', prependValue: '`' },
            ],
          },
        ];
        break;
      case 'ScheduleRow':
        displayTypeCandidates = [
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
        ];
        break;
      case 'SexRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.sex, label: '性別', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'SpecialityRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.specialty, label: '診療科', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'WorkPostalCodeRow':
        displayTypeCandidates = [
          { id: 'none', label: '非表示' },
          {
            id: '1input',
            label: '入力欄1つ',
            fields: [
              { id: FIELDS.workPostalCode, label: 'ご勤務先　郵便番号', outputType: 'text' },
            ],
          },
        ];
        break;
      case 'WorkTelRow':
        displayTypeCandidates = [
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
        ];
        break;
      default:
        throw new Error(`未定義のRowTypeです。outputType: ${this.getRowType()}`);
    }

    return List(displayTypeCandidates.map(displayType => PersonalInfoItemDisplayTypeDefinition.create(displayType)));
  }

  getField(argField) {
    return this.getFields().find(field => field.getId() === argField);
  }

  isOptional() {
    return this.get('isOptional');
  }

  isHomeTelRow() {
    return this.getRowType() === 'HomeTelRow';
  }

  isMobileTelRow() {
    return this.getRowType() === 'MobileTelRow';
  }

  isWorkTelRow() {
    return this.getRowType() === 'WorkTelRow';
  }

  isEmailRow() {
    return this.getRowType() === 'EmailRow';
  }

  isDisable() {
    return this.getDisplayTypeId() === 'none';
  }
}
