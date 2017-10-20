import { findElementsByOutputDefinitions } from '../../../utils';

/**
 * TextQuestionのためのJS
 */
export default class TextQuestionJS {
  constructor(el, survey, page, runtime) {
    this.el = el;
    this.survey = survey;
    this.page = page;
    this.runtime = runtime;
    this.dataType = 'Text';
  }

  /** pageに含まれる対象のQuestionのみを取得する */
  findQuestions() {
    return this.page.getQuestions().filter(question => question.getDataType() === this.dataType);
  }

  /** 設問を任意入力にする */
  optionalize(question) {
    if (!question.isOptional()) return;
    const outputDefinition = question.getOutputDefinitions().get(0);
    findElementsByOutputDefinitions(outputDefinition).removeAttr('data-parsley-required');
  }

  initialize() {
    this.findQuestions().forEach((question) => {
      this.optionalize(question);
    });
  }

  deInitialize() {
  }
}
