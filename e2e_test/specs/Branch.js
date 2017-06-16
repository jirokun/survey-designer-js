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

  describe('条件の設定・回答', () => {
    beforeEach(() => {
      editorPage.addQuestion('ページ 1', 0, '複数選択肢');
      editorPage.addQuestion('ページ 1', 1, '単一選択肢(ラジオボタン)');
      editorPage.addQuestion('ページ 1', 2, '数値記入');
      const checkboxQuestionEditorPage = new QuestionEditorPage(editorPage, '1-1');
      checkboxQuestionEditorPage.addItem(1);
      checkboxQuestionEditorPage.setLabel(0, '複数選択肢1');
      checkboxQuestionEditorPage.setLabel(1, '複数選択肢2');
      const radioQuestionEditorPage = new QuestionEditorPage(editorPage, '1-2');
      radioQuestionEditorPage.addItem(1);
      radioQuestionEditorPage.setLabel(0, '単一選択肢(ラジオボタン)1');
      radioQuestionEditorPage.setLabel(1, '単一選択肢(ラジオボタン)2');
      const multiNumberQuestionEditorPage = new QuestionEditorPage(editorPage, '1-3');
      multiNumberQuestionEditorPage.addItem(1);
      multiNumberQuestionEditorPage.setLabel(0, '数値記入1');
      multiNumberQuestionEditorPage.setLabel(1, '数値記入2');
      editorPage.selectNode('分岐 1');
    });

    describe('チェックボックス用の分岐条件', () => {
      beforeEach(() => {
        branchEditorPage.setConditionType(0, 'いずれか');
        branchEditorPage.setNextNodeId(0, '終了 1 COMPLETE');
        branchEditorPage.setOutputId(0, 0, '1-1-1 複数選択肢1');
        branchEditorPage.setConditionValue(0, 0, '選択している');
      });

      it('チェックボックス用の分岐条件を設定できる', () => {
        const conditions = branchEditorPage.getConditions();
        expect(conditions).to.have.lengthOf(1);
        expect(conditions[0].conditionType).to.equal('いずれか');
        expect(conditions[0].nextNodeId).to.equal('終了 1 COMPLETE');
        expect(conditions[0].conditions).to.have.lengthOf(1);
        expect(conditions[0].conditions[0].outputId).to.equal('1-1-1 複数選択肢1');
        expect(conditions[0].conditions[0].operator).to.equal('選択している');
      });

      describe('回答できる', () => {
        let responsePage;
        beforeEach(() => {
          responsePage = new ResponsePage();
          editorPage.preview();
        });
        afterEach(() => {
          responsePage.close();
        });

        it('条件にマッチする', () => {
          responsePage.clickByOutputNo('1-1-1');
          responsePage.clickByOutputNo('1-2', 0);
          responsePage.setValue('1-3-1', '10');
          responsePage.setValue('1-3-2', '20');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('終了 1 COMPLETE');

          const answers = responsePage.getAnswers();
          expect(answers['1-1-1']).to.equal('1');
          expect(answers['1-1-2']).to.equal('0');
          expect(answers['1-2']).to.equal('1');
          expect(answers['1-3-1']).to.equal('10');
          expect(answers['1-3-2']).to.equal('20');
          expect(answers['2-1-1']).to.equal(null);
        });

        it('条件にマッチしない', () => {
          responsePage.clickByOutputNo('1-1-2');
          responsePage.clickByOutputNo('1-2', 0);
          responsePage.setValue('1-3-1', '10');
          responsePage.setValue('1-3-2', '20');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('ページ 2');

          responsePage.clickByOutputNo('2-1-1');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('終了 1 COMPLETE');

          const answers = responsePage.getAnswers();
          expect(answers['1-1-1']).to.equal('0');
          expect(answers['1-1-2']).to.equal('1');
          expect(answers['1-2']).to.equal('1');
          expect(answers['1-3-1']).to.equal('10');
          expect(answers['1-3-2']).to.equal('20');
          expect(answers['2-1-1']).to.equal('1');
        });
      });
    });

    describe('ラジオ用の分岐条件', () => {
      beforeEach(() => {
        branchEditorPage.setConditionType(0, 'いずれか');
        branchEditorPage.setNextNodeId(0, '終了 1 COMPLETE');
        branchEditorPage.setOutputId(0, 0, '1-2 設問タイトル');
        branchEditorPage.setConditionValue(0, 0, '単一選択肢(ラジオボタン)1');
      });

      it('ラジオ用の分岐条件を設定できる', () => {
        const conditions = branchEditorPage.getConditions();
        expect(conditions).to.have.lengthOf(1);
        expect(conditions[0].conditionType).to.equal('いずれか');
        expect(conditions[0].nextNodeId).to.equal('終了 1 COMPLETE');
        expect(conditions[0].conditions).to.have.lengthOf(1);
        expect(conditions[0].conditions[0].outputId).to.equal('1-2 設問タイトル');
        expect(conditions[0].conditions[0].operator).to.equal('単一選択肢(ラジオボタン)1');
      });

      describe('回答できる', () => {
        let responsePage;
        beforeEach(() => {
          responsePage = new ResponsePage();
          editorPage.preview();
        });

        it('条件にマッチする', () => {
          responsePage.clickByOutputNo('1-1-1');
          responsePage.clickByOutputNo('1-2', 0);
          responsePage.setValue('1-3-1', '10');
          responsePage.setValue('1-3-2', '20');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('終了 1 COMPLETE');

          const answers = responsePage.getAnswers();
          expect(answers['1-1-1']).to.equal('1');
          expect(answers['1-1-2']).to.equal('0');
          expect(answers['1-2']).to.equal('1');
          expect(answers['1-3-1']).to.equal('10');
          expect(answers['1-3-2']).to.equal('20');
          expect(answers['2-1-1']).to.equal(null);
        });

        it('条件にマッチしない', () => {
          responsePage.clickByOutputNo('1-1-1');
          responsePage.clickByOutputNo('1-2', 1);
          responsePage.setValue('1-3-1', '10');
          responsePage.setValue('1-3-2', '20');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('ページ 2');

          responsePage.clickByOutputNo('2-1-1');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('終了 1 COMPLETE');

          const answers = responsePage.getAnswers();
          expect(answers['1-1-1']).to.equal('1');
          expect(answers['1-1-2']).to.equal('0');
          expect(answers['1-2']).to.equal('2');
          expect(answers['1-3-1']).to.equal('10');
          expect(answers['1-3-2']).to.equal('20');
          expect(answers['2-1-1']).to.equal('1');
        });
      });
    });

    describe('数値記入用の分岐条件', () => {
      beforeEach(() => {
        branchEditorPage.setConditionType(0, 'いずれか');
        branchEditorPage.setNextNodeId(0, '終了 1 COMPLETE');
        branchEditorPage.setOutputId(0, 0, '1-3-1 数値記入1');
        branchEditorPage.setValue(0, 0, '10');
        branchEditorPage.setOperator(0, 0, '以上');
      });

      it('数値の分岐条件を設定できる', () => {
        const conditions = branchEditorPage.getConditions();
        expect(conditions).to.have.lengthOf(1);
        expect(conditions[0].conditionType).to.equal('いずれか');
        expect(conditions[0].nextNodeId).to.equal('終了 1 COMPLETE');
        expect(conditions[0].conditions).to.have.lengthOf(1);
        expect(conditions[0].conditions[0].outputId).to.equal('1-3-1 数値記入1');
        expect(conditions[0].conditions[0].value).to.equal('10');
        expect(conditions[0].conditions[0].operator).to.equal('以上');
      });

      describe('回答できる', () => {
        let responsePage;
        beforeEach(() => {
          responsePage = new ResponsePage();
          editorPage.preview();
        });

        it('条件にマッチする', () => {
          responsePage.clickByOutputNo('1-1-1');
          responsePage.clickByOutputNo('1-2', 0);
          responsePage.setValue('1-3-1', '10');
          responsePage.setValue('1-3-2', '20');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('終了 1 COMPLETE');

          const answers = responsePage.getAnswers();
          expect(answers['1-1-1']).to.equal('1');
          expect(answers['1-1-2']).to.equal('0');
          expect(answers['1-2']).to.equal('1');
          expect(answers['1-3-1']).to.equal('10');
          expect(answers['1-3-2']).to.equal('20');
          expect(answers['2-1-1']).to.equal(null);
        });

        it('条件にマッチしない', () => {
          responsePage.clickByOutputNo('1-1-1');
          responsePage.clickByOutputNo('1-2', 0);
          responsePage.setValue('1-3-1', '9');
          responsePage.setValue('1-3-2', '20');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('ページ 2');

          responsePage.clickByOutputNo('2-1-1');
          responsePage.nextPage();
          expect(responsePage.getPageLabel()).to.equal('終了 1 COMPLETE');

          const answers = responsePage.getAnswers();
          expect(answers['1-1-1']).to.equal('1');
          expect(answers['1-1-2']).to.equal('0');
          expect(answers['1-2']).to.equal('1');
          expect(answers['1-3-1']).to.equal('9');
          expect(answers['1-3-2']).to.equal('20');
          expect(answers['2-1-1']).to.equal('1');
        });
      });
    });
  });
});

