/* eslint-env node */
/* global browser */

const clearRequireCache = require('../clearRequireCache');
clearRequireCache();

const EditorPage = require('../pages/EditorPage');
const expect = require('chai').expect; 

describe('Node', () => {
  let editorPage;
  beforeEach(() => {
    editorPage = new EditorPage();
  });

  function addNodeAndVerify(type, title) {
    editorPage.addNode(0, type);
    const titles = editorPage.findNodeTitles();
    expect(titles).to.be.a('array');
    expect(titles).to.have.lengthOf(3);
    expect(titles[0]).to.equal(title);
  }

  describe('Nodeの追加', () => {
    it('ページを1ページ目に追加できる', () => {
      addNodeAndVerify('page', 'ページ 1');
    });

    it('分岐を1ページ目に追加できる', () => {
      addNodeAndVerify('branch', '分岐 1');
    });

    it('終了ページを1ページ目に追加できる', () => {
      addNodeAndVerify('finisher', '終了 1 COMPLETE');
    });
  });

  describe('Nodeの削除', () => {
    function removeNodeCommon(type, title) {
      addNodeAndVerify(type, title);
      editorPage.removeNode(title);
      const titles = editorPage.findNodeTitles();
      expect(titles).to.be.a('array');
      expect(titles).to.have.lengthOf(2);
      expect(titles[0]).to.equal('ページ 1');
      expect(titles[1]).to.equal('終了 1 COMPLETE');
    }

    it('ページを削除できる', () => {
      removeNodeCommon('page', 'ページ 1');
    });

    it('分岐を削除できる', () => {
      removeNodeCommon('branch', '分岐 1');
    });

    it('終了ページを削除できる', () => {
      removeNodeCommon('finisher', '終了 1 COMPLETE');
    });

    it('最後の終了ページは削除できない', () => {
      expect(editorPage.isNodeDeleteButtonVisible('終了 1 COMPLETE')).to.equal(false);
      editorPage.addNode(1, 'finisher');
      expect(editorPage.isNodeDeleteButtonVisible('終了 1 COMPLETE')).to.equal(true);
      expect(editorPage.isNodeDeleteButtonVisible('終了 2 COMPLETE')).to.equal(true);
      editorPage.removeNode('終了 1 COMPLETE');
      expect(editorPage.isNodeDeleteButtonVisible('終了 1 COMPLETE')).to.equal(false);
    });
  });
});

