import $ from 'jquery';
import S from 'string';
import { findElementsByOutputDefinitions } from '../../../utils';

/**
 * 個人情報設問の動作を定義する
 */
export default class PersonalInfoJS {
  constructor(el, page) {
    this.el = el;
    this.page = page;
  }

  initialize() {
    this.page
      .getQuestions()
      .filter(question => question.getDataType() === 'PersonalInfo')
      .forEach((question) => {
        this.setHomeTelEvent(question);
        this.setMobileTelEvent(question);
        this.setWorkTelEvent(question);
        this.setEmailEvent(question);
      });
  }

  deInitialize() {
  }

  isOptionallyQuestion(checkboxOutputDefinitions) {
    const $checkbox = findElementsByOutputDefinitions(checkboxOutputDefinitions.get(0));
    if (!$checkbox) { return false; } // 存在しなければイベントはセットしない
    return $checkbox.attr('disabled');
  }

  // 自宅電話番号にイベントを設定
  setHomeTelEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // 自宅電話番号に反応するcheckboxの OutputDefinition を取得
    const homeTelCheckboxOutputDefinitions = outputDefinitions.filter(o => o.isHomeTelCheckbox());

    // 自宅電話番号にイベントを設定
    if (this.isOptionallyQuestion(homeTelCheckboxOutputDefinitions)) { // 任意の質問のみ対象
      // 自宅電話番号のフォーム要素
      const homeTelQuery = question
        .getItems()
        .filter(i => i.isHomeTelRow())
        .flatMap(i => i.getFields())
        .map(f => `[name="${question.getOutputName(f.getId())}"]`)
        .join(',');

      $(this.el).on('change', homeTelQuery, (e) => {
        homeTelCheckboxOutputDefinitions.forEach((od) => {
          findElementsByOutputDefinitions(od).disable(S(e.target.value).isEmpty());
          const $label = $(`[id=${question.getCheckboxLabelId(od.getName())}]`);
          S(e.target.value).isEmpty() ? $label.addClass('disabled') : $label.removeClass('disabled');
        });
      });
    }
  }

  // 携帯電話番号にイベントを設定
  setMobileTelEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // 携帯電話番号に反応するcheckboxの OutputDefinition を取得
    const mobileTelCheckboxOutputDefinitions = outputDefinitions.filter(o => o.isMobileTelCheckbox());

    // 携帯電話番号にイベントを設定
    if (this.isOptionallyQuestion(mobileTelCheckboxOutputDefinitions)) { // 任意の質問のみ対象
      // 携帯電話番号のフォーム要素
      const mobileTelQuery = question
        .getItems()
        .filter(i => i.isMobileTelRow())
        .flatMap(i => i.getFields())
        .map(f => `[name="${question.getOutputName(f.getId())}"]`)
        .join(',');

      $(this.el).on('change', mobileTelQuery, (e) => {
        mobileTelCheckboxOutputDefinitions.forEach((od) => {
          findElementsByOutputDefinitions(od).disable(S(e.target.value).isEmpty());
          const $label = $(`[id=${question.getCheckboxLabelId(od.getName())}]`);
          S(e.target.value).isEmpty() ? $label.addClass('disabled') : $label.removeClass('disabled');
        });
      });
    }
  }

  // 勤務先電話番号にイベントを設定
  setWorkTelEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // 勤務先電話番号に反応するcheckboxの OutputDefinition を取得
    const workTelCheckboxOutputDefinitions = outputDefinitions.filter(o => o.isWorkTelCheckbox());

    // 勤務先電話番号にイベントを設定
    if (this.isOptionallyQuestion(workTelCheckboxOutputDefinitions)) { // 任意の質問のみ対象
      // 勤務先電話番号のフォーム要素
      const workTelQuery = question
        .getItems()
        .filter(i => i.isWorkTelRow())
        .flatMap(i => i.getFields())
        .map(f => `[name="${question.getOutputName(f.getId())}"]`)
        .join(',');

      $(this.el).on('change', workTelQuery, (e) => {
        workTelCheckboxOutputDefinitions.forEach((od) => {
          findElementsByOutputDefinitions(od).disable(S(e.target.value).isEmpty());
          const $label = $(`[id=${question.getCheckboxLabelId(od.getName())}]`);
          S(e.target.value).isEmpty() ? $label.addClass('disabled') : $label.removeClass('disabled');
        });
      });
    }
  }

  // Emailにイベントを設定
  setEmailEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // Emailに反応するcheckboxの OutputDefinition を取得
    const emailCheckboxOutputDefinitions = outputDefinitions.filter(o => o.isEmailCheckbox());

    // Emailにイベントを設定
    if (this.isOptionallyQuestion(emailCheckboxOutputDefinitions)) { // 任意の質問のみ対象
      // Emailのフォーム要素
      const emailQuery = question
        .getItems()
        .filter(i => i.isEmailRow())
        .flatMap(i => i.getFields())
        .map(f => `[name="${question.getOutputName(f.getId())}"]`)
        .join(',');

      $(this.el).on('change', emailQuery, (e) => {
        emailCheckboxOutputDefinitions.forEach((od) => {
          findElementsByOutputDefinitions(od).disable(S(e.target.value).isEmpty());
          const $label = $(`[id=${question.getCheckboxLabelId(od.getName())}]`);
          S(e.target.value).isEmpty() ? $label.addClass('disabled') : $label.removeClass('disabled');
        });
      });
    }
  }
}
