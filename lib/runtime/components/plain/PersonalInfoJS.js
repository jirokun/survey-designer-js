import $ from 'jquery';
import { createQueryForOutputDefinition, findElementsByOutputDefinitions } from '../../../utils';

/**
 * 日程の動作を定義する
 *
 * class="sdj-schedule"を定義する
 */
export default class PersonalInfoJS {
  constructor(el, survey) {
    this.el = el;
    this.survey = survey;
  }

  initialize() {
    // PersonalInfoのOutputDefinition の一覧を取得
    const outputDefinitions = this.survey.getAllOutputDefinitions().filter(od => od.getQuestion().getDataType() === 'PersonalInfo');

    // 自宅電話番号の OutputDefinition を取得
    const homeTelOutputDefinitions = outputDefinitions.filter(o => o.isHomeTel());
    // 自宅電話番号に反応するcheckboxの OutputDefinition を取得
    const homeTelCheckboxOutputDefinitions = outputDefinitions.filter(o => o.isHomeTelCheckbox());
    const homeTelQuery = homeTelOutputDefinitions.map(od => createQueryForOutputDefinition(od)).join(',');
    // 自宅電話番号にイベントを設定
    if (this.isOptionallyQuestion(homeTelCheckboxOutputDefinitions)) { // 任意の質問のみ対象
      $(this.el).on('change', homeTelQuery, (e) => {
        homeTelCheckboxOutputDefinitions.forEach((od) => {
          findElementsByOutputDefinitions(od).disable(!e.target.value);
          console.log(od.getId());
          const $label = $(`[id=${od.getId()}__text]`);
          e.target.value ? $label.removeClass('disabled') : $label.addClass('disabled');
        });
      });
    }

    // 携帯電話番号の OutputDefinition を取得
    const mobileTelOutputDefinitions = outputDefinitions.filter(o => o.isMobileTel());
    // 携帯電話番号に反応するcheckboxの OutputDefinition を取得
    const mobileTelCheckboxOutputDefinitions = outputDefinitions.filter(o => o.isMobileTelCheckbox());
    const mobileTelQuery = mobileTelOutputDefinitions.map(od => createQueryForOutputDefinition(od)).join(',');
    // 携帯電話番号にイベントを設定
    if (this.isOptionallyQuestion(mobileTelCheckboxOutputDefinitions)) { // 任意の質問のみ対象
      $(this.el).on('change', mobileTelQuery, (e) => {
        mobileTelCheckboxOutputDefinitions.forEach((od) => {
          findElementsByOutputDefinitions(od).disable(!e.target.value);
          const $text = $(`[id=${od.getId()}__text]`);
          e.target.value ? $text.removeClass('disabled') : $text.addClass('disabled');
        });
      });
    }

    // 勤務先電話番号の OutputDefinition を取得
    const workTelOutputDefinitions = outputDefinitions.filter(o => o.isWorkTel());
    // 勤務先電話番号に反応するcheckboxの OutputDefinition を取得
    const workTelCheckboxOutputDefinitions = outputDefinitions.filter(o => o.isWorkTelCheckbox());
    const workTelQuery = workTelOutputDefinitions.map(od => createQueryForOutputDefinition(od)).join(',');
    // 勤務先電話番号にイベントを設定
    if (this.isOptionallyQuestion(workTelCheckboxOutputDefinitions)) { // 任意の質問のみ対象
      $(this.el).on('change', workTelQuery, (e) => {
        workTelCheckboxOutputDefinitions.forEach((od) => {
          findElementsByOutputDefinitions(od).disable(!e.target.value);
          const $text = $(`[id=${od.getId()}__text]`);
          e.target.value ? $text.removeClass('disabled') : $text.addClass('disabled');
        });
      });
    }

    // Emailの OutputDefinition を取得
    const emailOutputDefinitions = outputDefinitions.filter(o => o.isEmail());
    // Emailに反応するcheckboxの OutputDefinition を取得
    const emailCheckboxOutputDefinitions = outputDefinitions.filter(o => o.isEmailCheckbox());
    const emailQuery = emailOutputDefinitions.map(od => createQueryForOutputDefinition(od)).join(',');
    // Emailにイベントを設定
    if (this.isOptionallyQuestion(emailCheckboxOutputDefinitions)) { // 任意の質問のみ対象
      $(this.el).on('change', emailQuery, (e) => {
        emailCheckboxOutputDefinitions.forEach((od) => {
          findElementsByOutputDefinitions(od).disable(!e.target.value);
          const $text = $(`[id=${od.getId()}__text]`);
          e.target.value ? $text.removeClass('disabled') : $text.addClass('disabled');
        });
      });
    }
  }

  deInitialize() {
  }

  isOptionallyQuestion(checkboxOutputDefinitions) {
    const $checkbox = findElementsByOutputDefinitions(checkboxOutputDefinitions.get(0));
    if (!$checkbox) { return false; } // 存在しなければイベントはセットしない
    return $checkbox.attr('disabled');
  }
}
