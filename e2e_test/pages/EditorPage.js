/* eslint-env node */
/* global browser */

class EditorPage {
  constructor() {
    browser.setViewportSize({
      width: 1600,
      height: 800,
    });

    browser.url('/?env=development');
    browser.waitForVisible('.flow-pane .page');
  }

  getAllNodeElements() {
    const elements = browser.elements('.flow-pane .enq-page');
    return elements;
  }

  findNodeElement(pageTitle) {
    const nodes = this.getAllNodeElements();
    return nodes.value.find(el => el.getText('.node-title').match(new RegExp(`.*${pageTitle}.*`)));
  }

  /** ノードのタイトル一覧を取得する */
  findNodeTitles() {
    return browser.elements('.flow-pane .enq-page .node-title').getText();
  }

  findNodeIndex(pageTitle) {
    const nodes = this.getAllNodeElements();
    return nodes.value.findIndex(el => el.getText().match(new RegExp(`.*${pageTitle}.*`)));
  }

  /** pageFlowをクリックする */
  selectNode(pageTitle) {
    this.findNodeElement(pageTitle).click();
  }

  /** ノードを追加する */
  addNode(nodeIndex, nodeType) {
    const arrowDownElements = browser.elements('.flow-pane .arrow-down');
    browser.execute(`$('.flow-pane .arrow-down:nth-child(${nodeIndex + 1}) button').css('opacity', 1).show()`);
    const targetArrowDownElement = arrowDownElements.value[nodeIndex];
    targetArrowDownElement.click();
    browser.execute(`$('.flow-pane .arrow-down:nth-child(${nodeIndex + 1}) button').css('opacity', 0).hide()`);
    browser.click(`.enq-button__${nodeType}`);
    browser.click('#global-navigation');
  }

  /** ノードを削除する */
  removeNode(pageTitle) {
    const node = this.findNodeElement(pageTitle);
    node.element('.enq-item-controller .delete-button').click();
  }

  /** ノードがデリートボタンを表示しているかどうか */
  isNodeDeleteButtonVisible(pageTitle) {
    const node = this.findNodeElement(pageTitle);
    return node.isVisible('.enq-item-controller .delete-button');
  }

  /** ページに設定されている設問の設問番号と設問タイプの一覧を取得する */
  findQuestionsInPage(pageTitle) {
    this.selectNode(pageTitle);
    return browser.elements('.editor-pane h4.enq-title').value.map(el => el.getText());
  }

  /** 設問を追加する */
  addQuestion(pageTitle, questionIndex, questionType) {
    browser.pause(100);
    const node = this.findNodeElement(pageTitle);
    const insertItemBoxes = node.elements('.insert-item-box');
    insertItemBoxes.value[questionIndex].click();
    browser.waitForVisible('.popover-content', 2000);
    const popoverContent = browser.element('.popover-content');
    const targetQuestionAddButton = popoverContent.elements('button').value.find(button => button.getText() === questionType);
    targetQuestionAddButton.click();
    this.clickGlobalNavigation();
    browser.waitUntil(() => !browser.isVisible('.popover-content'));
  }

  clickGlobalNavigation() {
    browser.click('#global-navigation');
  }

  preview() {
    const beforeSize = browser.windowHandles().value.length;
    browser.click('.menu-preview');
    browser.waitForVisible('.menu-dynamic-preview');
    browser.click('.menu-dynamic-preview');
    browser.waitUntil(() => browser.windowHandles().value.length !== beforeSize);
    browser.window(browser.windowHandles().value[beforeSize]);
  }
}

module.exports = EditorPage;
