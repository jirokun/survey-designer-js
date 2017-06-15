/* eslint-env node */
/* global browser */

const clearRequireCache = require('../clearRequireCache');
clearRequireCache();

const EditorPage = require('../pages/EditorPage');
const BranchEditorPage = require('../pages/BranchEditorPage');
const QuestionEditorPage = require('../pages/QuestionEditorPage');
const ResponsePage = require('../pages/ResponsePage');
const expect = require('chai').expect; 

describe('Branch', () => {
  let editorPage;
  let branchEditorPage;
  beforeEach(() => {
    editorPage = new EditorPage();
    branchEditorPage = new BranchEditorPage(editorPage, 1);
    editorPage.addNode(1, 'branch');
    browser.pause(100);
    editorPage.addNode(2, 'page');
    browser.pause(100);
    editorPage.addQuestion('ページ 2', 0, '複数選択肢');
    browser.pause(100);
  });

  describe('条件の追加削除', () => {
    it('条件を追加できる', () => {
      branchEditorPage.addCondition(1);
      const conditions = branchEditorPage.getConditions();
      expect(conditions).to.have.lengthOf(2);
    });

    it('条件を削除できる', () => {
      branchEditorPage.addCondition(1);
      branchEditorPage.removeCondition(0);
      const conditions = branchEditorPage.getConditions();
      expect(conditions).to.have.lengthOf(1);
    });
  });

  describe('条件の設定', () => {
    let checkboxQuestionEditorPage;
    beforeEach(() => {
      editorPage.addQuestion('ページ 1', 0, '複数選択肢');
      editorPage.addQuestion('ページ 1', 1, '単一選択肢(ラジオボタン)');
      editorPage.addQuestion('ページ 1', 2, '数値記入');
      checkboxQuestionEditorPage = new QuestionEditorPage(editorPage, '1-1');
      checkboxQuestionEditorPage.addItem(1);
      checkboxQuestionEditorPage.setLabel(1, '正常遷移選択肢');
      editorPage.selectNode('分岐 1');
    });

    it('チェックボックス用の分岐条件を設定できる', () => {
      branchEditorPage.setConditionType(0, 'いずれか');
      branchEditorPage.setNextNodeId(0, '終了 1 COMPLETE');
      branchEditorPage.setOutputId(0, '1-1-1 名称未設定');
      branchEditorPage.setConditionValue(0, '選択している');
      const conditions = branchEditorPage.getConditions();
      expect(conditions).to.have.lengthOf(1);
      expect(conditions[0].conditionType).to.equal('いずれか');
      expect(conditions[0].nextNodeId).to.equal('終了 1 COMPLETE');
      expect(conditions[0].conditions).to.have.lengthOf(1);
      expect(conditions[0].conditions[0].outputId).to.equal('1-1-1 名称未設定');
      expect(conditions[0].conditions[0].operator).to.equal('選択している');
    });

    it('ラジオ用の分岐条件を設定できる', () => {
      branchEditorPage.setConditionType(0, 'いずれか');
      branchEditorPage.setNextNodeId(0, '終了 1 COMPLETE');
      branchEditorPage.setOutputId(0, '1-2 設問タイトル');
      branchEditorPage.setConditionValue(0, '名称未設定');
      const conditions = branchEditorPage.getConditions();
      expect(conditions).to.have.lengthOf(1);
      expect(conditions[0].conditionType).to.equal('いずれか');
      expect(conditions[0].nextNodeId).to.equal('終了 1 COMPLETE');
      expect(conditions[0].conditions).to.have.lengthOf(1);
      expect(conditions[0].conditions[0].outputId).to.equal('1-2 設問タイトル');
      expect(conditions[0].conditions[0].operator).to.equal('名称未設定');
    });

    describe('条件分岐が正しく設定された状態で回答できる', () => {
      let responsePage;
      beforeEach(() => {
        responsePage = new ResponsePage();
        branchEditorPage.setConditionType(0, 'いずれか');
        branchEditorPage.setNextNodeId(0, '終了 1 COMPLETE');
        branchEditorPage.setOutputId(0, '1-1-1 名称未設定');
        branchEditorPage.setConditionValue(0, '選択している');
        editorPage.preview();
      });

      it('条件にマッチする', () => {
        responsePage.clickByOutputNo('1-1-1');
        responsePage.clickByOutputNo('1-2', 0);
        responsePage.setValue('1-3-1', '10');
        responsePage.nextPage();
        const pageLabel = responsePage.getPageLabel();
        expect(pageLabel).to.equal('終了 1 COMPLETE');
      });

      it('条件にマッチしない', () => {
        responsePage.clickByOutputNo('1-1-2');
        responsePage.clickByOutputNo('1-2', 0);
        responsePage.setValue('1-3-1', '10');
        responsePage.nextPage();
        const pageLabel = responsePage.getPageLabel();
        expect(pageLabel).to.equal('ページ 2');
      });
    });
  });
});

