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
        this.setHomeTelEvent(question);
        this.setMobileTelEvent(question);
        this.setWorkTelEvent(question);
        this.setEmailEvent(question);
      });
  }

  deInitialize() {
  }

  // 自宅電話番号にイベントを設定
  setHomeTelEvent(question) {
    const outputDefinitions = question.getOutputDefinitions();

    // 自宅電話番号に反応するcheckboxのOutputDefinitionを取得
    const homeTelCheckboxOutputDefinitions = outputDefinitions.filter(o => question.isHomeTelCheckbox(o.getName()));

    // 自宅電話番号のItemDefinition
    const homeTelItemDefinition = question.getItems().find(i => i.isHomeTelRow());

    // 自宅電話番号のフォーム要素
    const homeTelQueryList = question
      .getItems()
      .filter(i => i.isHomeTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 必須の質問の場合
    if (!homeTelItemDefinition.isOptional()) {
      const $homeTelInput = $(homeTelQueryList.join(','));
      $homeTelInput.attr('data-parsley-required', 'true');
      return;
    }

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
    const outputDefinitions = question.getOutputDefinitions();

    // 携帯電話番号に反応するcheckboxの OutputDefinition を取得
    const mobileTelCheckboxOutputDefinitions = outputDefinitions.filter(o => question.isMobileTelCheckbox(o.getName()));

    // 携帯電話番号のItemDefinition
    const mobileTelItemDefinition = question.getItems().find(i => i.isMobileTelRow());

    // 携帯電話番号のフォーム要素
    const mobileTelQueryList = question
      .getItems()
      .filter(i => i.isMobileTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 必須の質問の場合
    if (!mobileTelItemDefinition.isOptional()) {
      const $mobileTelInput = $(mobileTelQueryList.join(','));
      $mobileTelInput.attr('data-parsley-required', 'true');
      return;
    }

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
    const outputDefinitions = question.getOutputDefinitions();

    // 勤務先電話番号に反応するcheckboxの OutputDefinition を取得
    const workTelCheckboxOutputDefinitions = outputDefinitions.filter(o => question.isWorkTelCheckbox(o.getName()));

    // 勤務先電話番号のItemDefinition
    const workTelItemDefinition = question.getItems().find(i => i.isWorkTelRow());

    // 勤務先電話番号のフォーム要素
    const workTelQueryList = question
      .getItems()
      .filter(i => i.isWorkTelRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 必須の質問の場合
    if (!workTelItemDefinition.isOptional()) {
      const $workTelInput = $(workTelQueryList.join(','));
      $workTelInput.attr('data-parsley-required', 'true');
      return;
    }

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
    const outputDefinitions = question.getOutputDefinitions();

    // Emailに反応するcheckboxの OutputDefinition を取得
    const emailCheckboxOutputDefinitions = outputDefinitions.filter(o => question.isEmailCheckbox(o.getName()));

    // EmailのItemDefinition
    const emailItemDefinition = question.getItems().find(i => i.isEmailRow());

    // Emailのフォーム要素
    const emailQueryList = question
      .getItems()
      .filter(i => i.isEmailRow())
      .flatMap(i => i.getFields())
      .map(f => `[name="${question.getOutputName(f.getId())}"]`);

    // 必須の質問の場合
    if (!emailItemDefinition.isOptional()) {
      const $homeTelInput = $(emailQueryList.join(','));
      $homeTelInput.attr('data-parsley-required', 'true');
      return;
    }

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
