/* eslint-env node */
/* global browser */

const clearRequireCache = require('../../clearRequireCache');
clearRequireCache();

const EditorPage = require('../../pages/EditorPage');
const QuestionEditorPage = require('../../pages/QuestionEditorPage');
const expect = require('chai').expect; 

describe('RadioQuestion', () => {
  let editorPage;
  describe('editor', () => {
    beforeEach(() => {
      editorPage = new EditorPage();
      editorPage.addQuestion('ページ 1', 0, '単一選択肢(ラジオボタン)');
    });

    it('単一選択肢が追加できる', () => {
      const questions = editorPage.findQuestionsInPage('ページ 1');
      expect(questions).to.be.a('array');
      expect(questions).to.have.lengthOf(1);
      expect(questions[0]).to.equal('1-1 単一選択肢(ラジオボタン)');
    });

    describe('question', () => {
      let questionEditorPage;
      beforeEach(() => {
        questionEditorPage = new QuestionEditorPage(editorPage, '1-1');
      });

      it('選択肢を追加できる', () => {
        questionEditorPage.addItem(1);
        const items = questionEditorPage.getItems();
        expect(items).to.be.a('array');
        expect(items).to.have.lengthOf(2);
      });

      it('0番目の選択肢のラベルを変更できる', () => {
        questionEditorPage.addItem(1);
        questionEditorPage.setLabel(0, '0番目');
        const items = questionEditorPage.getItems();
        expect(items).to.be.a('array');
        expect(items).to.have.lengthOf(2);
        expect(items[0].label).to.equal('0番目');
        expect(items[1].label).to.equal('名称未設定');
      });

      it('1番目の選択肢のラベルを変更できる', () => {
        questionEditorPage.addItem(1);
        questionEditorPage.setLabel(1, '1番目');
        const items = questionEditorPage.getItems();
        expect(items).to.be.a('array');
        expect(items).to.have.lengthOf(2);
        expect(items[0].label).to.equal('名称未設定');
        expect(items[1].label).to.equal('1番目');
      });

      it('0番目の選択肢を削除できる', () => {
        questionEditorPage.addItem(1);
        questionEditorPage.setLabel(0, '0番目');
        questionEditorPage.setLabel(1, '1番目');
        questionEditorPage.removeItem(0);
        const items = questionEditorPage.getItems();
        expect(items).to.be.a('array');
        expect(items).to.have.lengthOf(1);
        expect(items[0].label).to.equal('1番目');
      });

      it('1番目の選択肢を削除できる', () => {
        questionEditorPage.addItem(1, '追加したタイトル');
        questionEditorPage.setLabel(0, '0番目');
        questionEditorPage.setLabel(1, '1番目');
        questionEditorPage.removeItem(1);
        const items = questionEditorPage.getItems();
        expect(items).to.be.a('array');
        expect(items).to.have.lengthOf(1);
        expect(items[0].label).to.equal('0番目');
      });
    });
  });
});
