import $ from 'jquery';
import S from 'string';

/**
 * 進むボタンを押したときにnumberの入力要素で空のものは0を入力する
 *
 * 下記の値で設定を有効無効を切り替えることができる
 * pageManager.zeroPaddingDisabled
 * surveymanager.zeroPaddingDisabled
 *
 * pageManager.zeroPaddingDisabledの方が優先される
 */
export default class ZeroPadding {
  constructor(el, survey, page, SurveyJS) {
    this.el = el;
    this.survey = survey;
    this.page = page;
    this.SurveyJS = SurveyJS;
  }

  isZeroPaddingDisabled() {
    const { surveyManager, pageManager } = this.SurveyJS;
    // surveyManagerの値よりもpageManagerの値の方が優先
    if (pageManager.zeroPaddingDisabled === true) return true;
    if (pageManager.zeroPaddingDisabled === false) return false;
    if (surveyManager.zeroPaddingDisabled === true) return true;
    if (surveyManager.zeroPaddingDisabled === false) return false;
    return true;
  }

  handleValidateFormError() {
    if (this.isZeroPaddingDisabled()) return;

    // 進むボタンを連続で押してしまわないように一度押してから1秒は押せないように調整
    const $nextPage = $(this.el).find('.next-page');
    $nextPage.disable(true);
    setTimeout(() => $nextPage.disable(false), 1000);

    const outputDefinitions = this.page.getOutputDefinitionsFromThisPage(this.survey, true);
    outputDefinitions.filter(od => od.getOutputType() === 'number').forEach((od) => {
      const name = od.getName();
      const $el = $(`[name="${name}"]:visible:enabled`);
      if ($el.length !== 1 || !S($el.val()).isEmpty()) return;
      $el.val('0');
    });
  }

  initialize() {
    const $parsley = $(this.el).parsley();
    $parsley.on('form:error', this.handleValidateFormError.bind(this));
  }

  deInitialize() {
  }
}
