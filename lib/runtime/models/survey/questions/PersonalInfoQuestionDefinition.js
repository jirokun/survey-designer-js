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
      },
      {
        rowType: 'FuriganaRow',
        label: 'フリガナ',
        isOptional: false,
        displayTypeId: '1input',
      },
      {
        rowType: 'HospitalNameRow',
        label: '病院名（施設名）',
        isOptional: false,
        displayTypeId: '1input',
      },
      {
        rowType: 'HospitalPrefectureRow',
        label: '病院所在地',
        isOptional: false,
        displayTypeId: 'select',
      },
      {
        rowType: 'WorkPostalCodeRow',
        label: 'ご勤務先　郵便番号',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'SpecialityRow',
        label: '診療科',
        isOptional: false,
        displayTypeId: '1input',
      },
      {
        rowType: 'ProfessionalAreaRow',
        label: '専門領域',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'PositionRow',
        label: '役職名',
        isOptional: true,
        displayTypeId: '1input',
      },
      {
        rowType: 'AgeRow',
        label: '年齢',
        isOptional: false,
        displayTypeId: '1input',
      },
      {
        rowType: 'SexRow',
        label: '性別',
        isOptional: false,
        displayTypeId: '1input',
      },
      {
        rowType: 'BirthYearRow',
        label: 'お生まれ年（西暦）',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'ContactMeansRow',
        label: 'ご連絡方法',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'InterviewMeansRow',
        label: 'ご希望のインタビュー手法',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'InterviewPlaceRow',
        label: '訪問でのインタビューの場合の訪問場所',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'ContactEasyTimeRow',
        label: '連絡のつきやすい時間帯',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'MobileTelRow',
        label: '携帯電話番号',
        isOptional: false,
        displayTypeId: '1input',
      },
      {
        rowType: 'HomeTelRow',
        label: 'TEL（自宅）',
        isOptional: true,
        displayTypeId: '1input',
      },
      {
        rowType: 'WorkTelRow',
        label: 'TEL（勤務先）',
        isOptional: false,
        displayTypeId: '1input',
      },
      {
        rowType: 'FaxRow',
        label: 'FAX番号',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'EmailRow',
        label: 'Eメール',
        isOptional: false,
        displayTypeId: '1input',
      },
      {
        rowType: 'RequestEtcRow',
        label: 'その他ご要望',
        isOptional: true,
        displayTypeId: 'none',
      },
      {
        rowType: 'ScheduleRow',
        label: '日程調整',
        isOptional: false,
        displayTypeId: 'multi_input',
      },
      {
        rowType: 'InterviewRow',
        isOptional: false,
        label: 'インタビュー',
        displayTypeId: 'multi_input',
      },
    ]).map((item, index) => PersonalInfoItemDefinition.create(
      index,
      item.rowType,
      item.label,
      item.isOptional,
      item.displayTypeId,
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
    return `${item.getLabel()}/${field.getLabel()}`;
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
