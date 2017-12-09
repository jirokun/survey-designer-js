/* eslint-env browser */
const WAIT = 1;
export default class Automaton {
  constructor(survey) {
    this.survey = survey;
  }

  createAction(question, outputDefinition) {
    return new Promise((resolve) => {
      const name = outputDefinition.getName();
      const outputType = outputDefinition.getOutputType();

      const el = document.getElementsByName(name)[0];
      if (el.readOnly || el.disabled) {
        resolve();
        return;
      }
      if (el.type === 'checkbox') {
        el.checked = true;
      } else if (el.type === 'radio') {
        el.checked = true;
      } else if (el.type === 'text' && outputType === 'text') {
        if (name.match(/furigana$/)) {
          el.value = 'ダミーノテキストデス';
        } else if (name.match(/Tel$/)) {
          el.value = '090-0000-0000';
        } else {
          el.value = 'ダミーのテキストです';
        }
      } else if (el.type === 'text' && outputType === 'number') {
        el.value = 1;
      } else if (el.type === 'email') {
        el.value = 'test@example.com';
      } else if (el.nodeName.toLocaleLowerCase() === 'select') {
        el.selectedIndex = 1;
      }
      setTimeout(() => {
        if ('createEvent' in document) {
          const evt = document.createEvent('HTMLEvents');
          evt.initEvent('change', true, true);
          el.dispatchEvent(evt);
        } else {
          el.fireEvent('onchange');
        }
        setTimeout(() => {
          resolve();
        }, WAIT);
      }, WAIT);
    });
  }

  async start(page) {
    for (const question of page.getQuestions()) {
      const pageNo = this.survey.calcPageNo(page.getId());
      const questionNo = this.survey.calcQuestionNo(page.getId(), question.getId());
      if (question.getDataType() === 'Matrix') {
        // Matrixの場合は入力順番が追加入力からのため、順番を入れ替える
        const outputDefinitions = question.getOutputDefinitionForAdditionalInput(pageNo, questionNo)
          .concat(question.getOutputDefinitionsCommon(pageNo, questionNo));
        for (const od of outputDefinitions) {
          await this.createAction(question, od);
        }
      } else {
        for (const od of question.getOutputDefinitions(pageNo, questionNo)) {
          await this.createAction(question, od);
        }
      }
    }
  }
}
