/* eslint-env node */
/* global browser */

const clearRequireCache = require('../../clearRequireCache');
clearRequireCache();

const EditorPage = require('../../pages/EditorPage');
const expect = require('chai').expect; 

describe('SingleTextQuestion', () => {
  describe('editor', () => {
    it('エディタテキストクエスチョンが追加できる', () => {
      const editorPage = new EditorPage();
      editorPage.addQuestion('ページ 1', 0, '1行テキスト');
      editorPage.addQuestion('ページ 1', 0, '1行テキスト');
      const questions = editorPage.findQuestionsInPage('ページ 1');
      expect(questions).to.be.a('array');
      expect(questions).to.have.lengthOf(2);
      expect(questions[0]).to.equal('1-1 1行テキスト');
    });
  });
});
