/* eslint-env node */
/* global browser */

class BranchEditorPage {
  findElementsByOutputNo(outputNo) {
    return browser.elements(`*[data-output-no="${outputNo}"]`);
  }

  clickByOutputNo(outputNo, index = 0) {
    const element = this.findElementsByOutputNo(outputNo).value[index];
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
}

module.exports = BranchEditorPage;
