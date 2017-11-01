import $ from 'jquery';
import S from 'string';

/**
 * 進むボタンを押したときにnumberの入力要素で空のものは0を入力する
 */
export default class ZeroSetting {
  constructor(el, survey, page, SurveyJS) {
    this.el = el;
    this.survey = survey;
    this.page = page;
    this.SurveyJS = SurveyJS;
  }

  handleValidateFormError() {
    const surveyZeroSetting = this.survey.getZeroSetting();
    const pageZeroSetting = this.page.getZeroSetting();
    if (pageZeroSetting === false) return;
    if (surveyZeroSetting === false && pageZeroSetting === null) return;

    // 進むボタンを連続で押してしまわないように一度押してから1秒は押せないように調整
    const $nextPage = $(this.el).find('.next-page');
    $nextPage.disable(true);
    setTimeout(() => $nextPage.disable(false), 1000);

    const outputDefinitions = this.page.getOutputDefinitionsFromThisPage(this.survey, true);
    outputDefinitions.filter(od => od.getOutputType() === 'number').forEach((od) => {
      const name = od.getName();
      const $el = $(`[name="${name}"]:visible:enabled`);
      if ($el.length !== 1 || !S($el.val()).isEmpty() || !$el.is('[data-parsley-required]')) return;
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
