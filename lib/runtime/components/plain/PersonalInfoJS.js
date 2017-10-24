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

  isOptionalItem(checkboxOutputDefinitions) {
    const $checkbox = findElementsByOutputDefinitions(checkboxOutputDefinitions.get(0));
    if (!$checkbox) { return false; } // 存在しなければイベントはセットしない
    return $checkbox.prop('disabled');
  }

  // 自宅電話番号にイベントを設定
  setHomeTelEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // 自宅電話番号に反応するcheckboxの OutputDefinition を取得
    const homeTelCheckboxOutputDefinitions = outputDefinitions.filter(o => question.isHomeTelCheckbox(o.getName()));

    // 必須の質問はスキップ
    if (!(this.isOptionalItem(homeTelCheckboxOutputDefinitions))) { return; }

    // 自宅電話番号のフォーム要素
    const homeTelQueryList = question
      .getItems()
      .filter(i => i.isHomeTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 空のアイテムが一つでもあれば、disabledにする
    $(this.el).on('change', homeTelQueryList.join(','), () => {
      const isEmptyInput = homeTelQueryList.some(q => S($(q).val()).isEmpty());
      homeTelCheckboxOutputDefinitions.forEach((od) => {
        findElementsByOutputDefinitions(od).disable(isEmptyInput);
        const $label = $(`[id=${question.getCheckboxLabelId(od.getName())}]`);
        if (isEmptyInput) {
          $label.addClass('disabled');
        } else {
          $label.removeClass('disabled');
        }
      });
    });
  }

  // 携帯電話番号にイベントを設定
  setMobileTelEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // 携帯電話番号に反応するcheckboxの OutputDefinition を取得
    const mobileTelCheckboxOutputDefinitions = outputDefinitions.filter(o => question.isMobileTelCheckbox(o.getName()));

    // 必須の質問はスキップ
    if (!(this.isOptionalItem(mobileTelCheckboxOutputDefinitions))) { return; }

    // 携帯電話番号のフォーム要素
    const mobileTelQueryList = question
      .getItems()
      .filter(i => i.isHomeTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 空のアイテムが一つでもあれば、disabledにする
    $(this.el).on('change', mobileTelQueryList.join(','), () => {
      const isEmptyInput = mobileTelQueryList.some(q => S($(q).val()).isEmpty());
      mobileTelCheckboxOutputDefinitions.forEach((od) => {
        findElementsByOutputDefinitions(od).disable(isEmptyInput);
        const $label = $(`[id=${question.getCheckboxLabelId(od.getName())}]`);
        if (isEmptyInput) {
          $label.addClass('disabled');
        } else {
          $label.removeClass('disabled');
        }
      });
    });
  }

  // 勤務先電話番号にイベントを設定
  setWorkTelEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // 勤務先電話番号に反応するcheckboxの OutputDefinition を取得
    const workTelCheckboxOutputDefinitions = outputDefinitions.filter(o => question.isWorkTelCheckbox(o.getName()));

    // 必須の質問はスキップ
    if (!(this.isOptionalItem(workTelCheckboxOutputDefinitions))) { return; }

    // 携帯電話番号のフォーム要素
    const workTelQueryList = question
      .getItems()
      .filter(i => i.isHomeTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 空のアイテムが一つでもあれば、disabledにする
    $(this.el).on('change', workTelQueryList.join(','), () => {
      const isEmptyInput = workTelQueryList.some(q => S($(q).val()).isEmpty());
      workTelCheckboxOutputDefinitions.forEach((od) => {
        findElementsByOutputDefinitions(od).disable(isEmptyInput);
        const $label = $(`[id=${question.getCheckboxLabelId(od.getName())}]`);
        if (isEmptyInput) {
          $label.addClass('disabled');
        } else {
          $label.removeClass('disabled');
        }
      });
    });
  }

  // Emailにイベントを設定
  setEmailEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // Emailに反応するcheckboxの OutputDefinition を取得
    const emailCheckboxOutputDefinitions = outputDefinitions.filter(o => question.isEmailCheckbox(o.getName()));

    // 必須の質問はスキップ
    if (!(this.isOptionalItem(emailCheckboxOutputDefinitions))) { return; }

    // 携帯電話番号のフォーム要素
    const emailQueryList = question
      .getItems()
      .filter(i => i.isHomeTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 空のアイテムが一つでもあれば、disabledにする
    $(this.el).on('change', emailQueryList.join(','), () => {
      const isEmptyInput = emailQueryList.some(q => S($(q).val()).isEmpty());
      emailCheckboxOutputDefinitions.forEach((od) => {
        findElementsByOutputDefinitions(od).disable(isEmptyInput);
        const $label = $(`[id=${question.getCheckboxLabelId(od.getName())}]`);
        if (isEmptyInput) {
          $label.addClass('disabled');
        } else {
          $label.removeClass('disabled');
        }
      });
    });
  }
}
