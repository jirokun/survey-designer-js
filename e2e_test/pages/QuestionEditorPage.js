/* eslint-env node */
/* global browser */

class QuestionEditorPage {
  constructor(editorPage, questionNo) {
    this.editorPage = editorPage;
    this.questionNo = questionNo;
  }

  findQuestionElement() {
    const pageNo = this.questionNo.split('-')[0];
    this.editorPage.selectNode(`ページ ${pageNo}`);
    const questionEditors = browser.elements('.editor-pane .question-editor');
    return questionEditors.value.find(el => el.getText('.enq-title').indexOf(this.questionNo) !== -1);
  }

  hasTitleEditor() {
    const questionElement = this.findQuestionElement();
    return questionElement.getText().indexOf('質問タイトル') !== -1;
  }

  hasDescriptionEditor() {
    const questionElement = this.findQuestionElement();
    return questionElement.getText().indexOf('補足') !== -1;
  }

  hasChoiceEditor() {
    const questionElement = this.findQuestionElement();
    return questionElement.getText().indexOf('選択肢') !== -1;
  }

  hasVisibilityConditionEditor() {
    const questionElement = this.findQuestionElement();
    return questionElement.getText().indexOf('表示制御') !== -1;
  }

  hasOption() {
    const questionElement = this.findQuestionElement();
    return questionElement.getText().indexOf('オプション') !== -1;
  }

  setLabel(index, label) {
    const questionEl = this.findQuestionElement();
    const itemEditorRowEl = questionEl.elements('.item-editor-row').value[index];
    itemEditorRowEl.click('.html-editor');
    itemEditorRowEl.click('.item-editor-tinymce');
    itemEditorRowEl.setValue('.item-editor-tinymce', label);
  }

  addItem(index) {
    if (index === 0) throw new Error('QuestionEditorPage.addItemに0は指定できません');
    const questionEl = this.findQuestionElement();
    questionEl.elements('.item-editor-row').value[index - 1].click('.glyphicon-plus-sign');
  }

  removeItem(index) {
    const questionEl = this.findQuestionElement();
    questionEl.elements('.item-editor-row').value[index].click('.glyphicon-remove-sign');
  }

  getItems() {
    const questionElement = this.findQuestionElement();
    const itemEditorRows = questionElement.elements('.item-editor-row').value;
    const items = itemEditorRows.map(el => ({
      label: el.element('.html-editor').getText(),
      additionalInput: el.element('.additional-input').isSelected(),
      randomFixed: el.isExisting('.random-fixed') ? el.element('.random-fixed').isSelected() : false,
    }));
    return items;
  }
}

module.exports = QuestionEditorPage;
