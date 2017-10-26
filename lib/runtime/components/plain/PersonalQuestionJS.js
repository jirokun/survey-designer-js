import $ from 'jquery';
import S from 'string';
import { findElementsByOutputDefinitions } from '../../../utils';

/**
 * 個人情報設問の動作を定義する
 */
export default class PersonalQuestionJS {
  constructor(el, page) {
    this.el = el;
    this.page = page;
  }

  initialize() {
    this.page
      .getQuestions()
      .filter(question => question.getDataType() === 'PersonalInfo')
      .forEach((question) => {
        this.setOptionalAttributes(question);
        this.setHomeTelEvent(question);
        this.setMobileTelEvent(question);
        this.setWorkTelEvent(question);
        this.setEmailEvent(question);
      });
  }

  deInitialize() {
  }

  setOptionalAttributes(question) {
    question.getItems().filter(i => !i.isDisable() && i.isOptional()).forEach((item) => {
      const queryList = item.getFields().map(f => `[name="${question.getOutputName(f.getId())}"]`);

      // 任意の場合は必須の属性をつけない
      $(queryList.join(',')).removeAttr('data-parsley-required');
    });
  }

  // 自宅電話番号にイベントを設定
  setHomeTelEvent(question) {
    // 自宅電話番号のItemDefinition
    const homeTelItemDefinition = question.getItems().find(i => i.isHomeTelRow());

    // 必須の場合はその後の処理はない
    if (!homeTelItemDefinition.isOptional()) { return; }

    // 自宅電話番号に反応するcheckboxのOutputDefinitionを取得
    const homeTelCheckboxOutputDefinitions = question.getOutputDefinitions().filter(o => question.isHomeTelCheckbox(o.getName()));

    // 自宅電話番号のフォーム要素
    const homeTelQueryList = question
      .getItems()
      .filter(i => i.isHomeTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 任意の空のアイテムが一つでもあれば、チェックボックスをdisabledを初期状態にする
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
    // 携帯電話番号のItemDefinition
    const mobileTelItemDefinition = question.getItems().find(i => i.isMobileTelRow());

    // 必須の場合はその後の処理はない
    if (!mobileTelItemDefinition.isOptional()) { return; }

    // 携帯電話番号に反応するcheckboxの OutputDefinition を取得
    const mobileTelCheckboxOutputDefinitions = question.getOutputDefinitions().filter(o => question.isMobileTelCheckbox(o.getName()));

    // 携帯電話番号のフォーム要素
    const mobileTelQueryList = question
      .getItems()
      .filter(i => i.isMobileTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 任意の空のアイテムが一つでもあれば、チェックボックスをdisabledを初期状態にする
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
    // 勤務先電話番号のItemDefinition
    const workTelItemDefinition = question.getItems().find(i => i.isWorkTelRow());

    // 必須の場合はその後の処理はない
    if (!workTelItemDefinition.isOptional()) { return; }

    // 勤務先電話番号に反応するcheckboxのOutputDefinitionを取得
    const workTelCheckboxOutputDefinitions = question.getOutputDefinitions().filter(o => question.isWorkTelCheckbox(o.getName()));

    // 勤務先電話番号のフォーム要素
    const workTelQueryList = question
      .getItems()
      .filter(i => i.isWorkTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 任意の空のアイテムが一つでもあれば、チェックボックスをdisabledを初期状態にする
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
    // EmailのItemDefinition
    const emailItemDefinition = question.getItems().find(i => i.isEmailRow());

    // 必須の場合はその後の処理はない
    if (!emailItemDefinition.isOptional()) { return; }

    // Emailに反応するcheckboxのOutputDefinitionを取得
    const emailCheckboxOutputDefinitions = question.getOutputDefinitions().filter(o => question.isEmailCheckbox(o.getName()));

    // Emailのフォーム要素
    const emailQueryList = question
      .getItems()
      .filter(i => i.isEmailRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 任意の空のアイテムが一つでもあれば、チェックボックスをdisabledを初期状態にする
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
