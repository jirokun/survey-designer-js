import TextQuestionJS from './TextQuestionJS';

/**
 * TextQuestionのためのJS
 */
export default class SingleTextQuestionJS extends TextQuestionJS {
  constructor(el, survey, page, runtime) {
    super(el, survey, page, runtime);
    this.dataType = 'SingleText';
  }
}
