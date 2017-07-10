/* eslint-env node */
/* global browser */

const expect = require('chai').expect; 
const clearRequireCache = require('../clearRequireCache');
clearRequireCache();

const EditorPage = require('../pages/EditorPage');
const ResponsePage = require('../pages/ResponsePage');
const eventSurvey = require('./eventSurvey.json');

describe('JavaScriptEvent', () => {
  let editorPage;
  let responsePage;
  beforeEach(() => {
    editorPage = new EditorPage();
    editorPage.loadSurvey(eventSurvey);
    editorPage.preview();
    responsePage = new ResponsePage();

    responsePage.clickByOutputNo('1-1-1');
    responsePage.nextPage();

    responsePage.setValue('2-1-1', 10);
    responsePage.nextPage();
  });

  afterEach(() => {
    responsePage.close();
  });

  it('pageUnloadではロジック変数の値を取得することができる', () => {
    const page2PageUnloadAnswers = responsePage.transformAnswers(browser.execute(() => window.test.page2PageUnloadAnswers).value);
    expect(page2PageUnloadAnswers['1-1-1']).to.equal('1');
    expect(page2PageUnloadAnswers['2-1-1']).to.equal('10');
    expect(page2PageUnloadAnswers['2-L-000']).to.equal(20);
  });

  it('pageLoadでは前のページのpageUnloadのJavaScriptで設定した値を取得することができる', () => {
    const page3PageLoadAnswers = responsePage.transformAnswers(browser.execute(() => window.test.page3PageLoadAnswers).value);
    expect(page3PageLoadAnswers['1-1-1']).to.equal('1');
    expect(page3PageLoadAnswers['2-1-1']).to.equal('10');
    expect(page3PageLoadAnswers['2-L-000']).to.equal('abc');
  });
});
