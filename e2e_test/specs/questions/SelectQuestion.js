/* eslint-env node */
/* global browser */

const clearRequireCache = require('../../clearRequireCache');
clearRequireCache();

const EditorPage = require('../../pages/EditorPage');
const QuestionEditorPage = require('../../pages/QuestionEditorPage');
const expect = require('chai').expect; 

describe('SelectQuestion', () => {
  let editorPage;
  beforeEach(() => {
    editorPage = new EditorPage();
  });

/*
  describe('editor', () => {
    it('単一選択肢(select)を追加できる', () => {
      editorPage.addQuestion('ページ 1', 0, '単一選択肢(select)');
      editorPage.addQuestion('ページ 1', 0, '単一選択肢(select)');
      const questions = editorPage.findQuestionsInPage('ページ 1');
      expect(questions).to.be.a('array');
      expect(questions).to.have.lengthOf(2);
      expect(questions[0]).to.equal('1-1 単一選択肢(select)');
      expect(questions[1]).to.equal('1-2 単一選択肢(select)');
    });

    it('質問タイトル・補足・選択肢・表示制御が設定できる', () => {
      editorPage.addQuestion('ページ 1', 0, '単一選択肢(select)');
      const questionEditorPage = new QuestionEditorPage(editorPage, '1-1');
      expect(questionEditorPage.hasTitleEditor()).to.equal(true);
      expect(questionEditorPage.hasDescriptionEditor()).to.equal(true);
      expect(questionEditorPage.hasChoiceEditor()).to.equal(true);
      expect(questionEditorPage.hasVisibilityConditionEditor()).to.equal(true);
    });
  });
  */
});
