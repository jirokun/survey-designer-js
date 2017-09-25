/* eslint-env node */
/* global browser */

class ResponsePage {
  getAnswers() {
    return browser.execute(() => {
      const readableAnswers = {};
      SurveyJS.surveyManager.survey.getAllOutputDefinitions().forEach(function(od) {
        readableAnswers[od.getOutputNo()] = SurveyJS.surveyManager.answers[od.getName()];
      });
      return readableAnswers;
    }).value;
  }

  transformAnswers(answers) {
    return browser.execute((a) => {
      const readableAnswers = {};
      SurveyJS.surveyManager.survey.getAllOutputDefinitions().forEach(function(od) {
        readableAnswers[od.getOutputNo()] = a[od.getName()];
      });
      return readableAnswers;
    }, answers).value;
  }

  findElementsByOutputNo(outputNo) {
    return browser.elements(`*[data-output-no="${outputNo}"]`);
  }

  clickByOutputNo(outputNo, index = 0) {
    const element = this.findElementsByOutputNo(outputNo).value[index];
    browser.pause(10);
    element.click();
  }

  setValue(outputNo, value) {
    const element = this.findElementsByOutputNo(outputNo).value[0];
    element.setValue(value);
  }

  nextPage() {
    const nextButton = browser.elements('button').value.find(button => button.getText() === '進む');
    nextButton.click();
  }

  getPageLabel() {
    return browser.elements('.finisher-no,.page-no').getText();
  }

  close() {
    browser.close();
    browser.window(browser.windowHandles().value[0]);
  }
}

module.exports = ResponsePage;
