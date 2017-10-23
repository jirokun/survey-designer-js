import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Record, List, Map } from 'immutable';
import S from 'string';
import $ from 'jquery';
import cuid from 'cuid';
import VisibilityConditionDefinition from './questions/internal/VisibilityConditionDefinition';
import OutputDefinition from './questions/internal/OutputDefinition';
import ItemDefinition from './questions/internal/ItemDefinition';
import LogicalVariableDefinition from './LogicalVariableDefinition';
import ValidationErrorDefinition from '../ValidationErrorDefinition';
import { findQuestionDefinitionMap } from './questions/QuestionDefinitions';
import surveyDevIdGeneratorInstance from '../../SurveyDevIdGenerator';
import MatrixQuestion from '../../components/questions/MatrixQuestion';
import Options from '../options/Options';
import View from '../view/ViewSetting';
import RuntimeValue from '../runtime/RuntimeValue';
import Page from '../../components/Page';
import { isDevelopment } from '../../../utils';

const PageDefinitionRecord = Record({
  _id: null,
  devId: null,              // JavaScriptで指定するためのid
  questions: List(),        // 設問のリスト
  logicalVariables: List(), // ロジック変数の定義
  freeMode: false,          // HTMLで記述できる自由なモードかどうか
  html: null,               // freeModeでレンダリングに使用するhtml
  javaScriptCode: '',       // Pageが表示されたときに実行されるJavaScript

  zeroSetting: null,   // 検証エラー時に数値の未入力フィールドに0を埋めるかどうか。null:surveyの定義に従う true:有効 false:無効
});

/** ページの定義 */
export default class PageDefinition extends PageDefinitionRecord {
  static create() {
    const id = cuid();
    const questions = List().push();
    const logicalVariables = List();
    const devId = surveyDevIdGeneratorInstance.generateForPage();
    return new PageDefinition({ _id: id, questions, logicalVariables, devId });
  }

  getId() {
    return this.get('_id');
  }

  getDevId() {
    return this.get('devId');
  }

  getQuestions() {
    return this.get('questions');
  }

  getLogicalVariables() {
    return this.get('logicalVariables');
  }

  getJavaScriptCode() {
    return this.get('javaScriptCode');
  }

  getZeroSetting() {
    return this.get('zeroSetting');
  }

  isFreeMode() {
    return this.get('freeMode');
  }

  getHtml() {
    return this.get('html');
  }

  // ---------------------- 検索系 --------------------------
  /** questionを探す */
  findQuestion(questionId) {
    return this.getQuestions().find(question => question.getId() === questionId);
  }

  /** questionのindexを取得する */
  findQuestionIndex(questionId) {
    return this.getQuestions().findIndex(q => q.getId() === questionId);
  }

  /** itemのindexを取得する */
  findItemIndex(questionId, itemId) {
    const question = this.findQuestion(questionId);
    return question.getItems().findIndex(item => item.getId() === itemId);
  }

  /** subItemのindexを取得する */
  findSubItemIndex(questionId, itemId) {
    const question = this.findQuestion(questionId);
    return question.getSubItems().findIndex(item => item.getId() === itemId);
  }

  findLogicalVariableIndex(logicalVariableId) {
    return this.getLogicalVariables().findIndex(lv => lv.getId() === logicalVariableId);
  }

  findLogicalVariable(logicalVariableId) {
    return this.getLogicalVariables().find(lv => lv.getId() === logicalVariableId);
  }

  /** Page内に含まれるQuestionからoutputDefinitionIdに対応するvalidationを取得する */
  findQuestionValidation(outputDefinitionId) {
    const validationRuleMap = this.getQuestions().reduce((reduction, question) => reduction.merge(question.getNumberValidationRuleMap()), Map());
    return validationRuleMap.get(outputDefinitionId);
  }

  /** ロジック変数名がユニークかどうかを確認する */
  isUniqueLogicalVariableName(logicalVariableId, logicalVariableName) {
    return this.getLogicalVariables().findIndex(lv => lv.getId() !== logicalVariableId && lv.getVariableName() === logicalVariableName) === -1;
  }

  /** ロジック変数のoutputdefinitionを取得する */
  getLogicalVariableOutputDefinitions(survey) {
    return this.getLogicalVariables().map(lv =>
      new OutputDefinition({
        _id: lv.getId(),
        name: lv.getId(),
        label: '',   // 表示しない
        dlLabel: '',   // 表示しない
        outputType: 'number',
        outputNo: survey.calcLogicalVariableNo(this.getId(), lv.getId()),
        downloadable: false,
      }),
    );
  }

  /** このページに含まれるQuestionとロジック変数のoutputDefinitionを取得する */
  getOutputDefinitionsFromThisPage(survey, withoutLogicalVariables = false) {
    const pageNo = survey.calcPageNo(this.getId());
    const questionsOutputDefinitions = this.getQuestions().flatMap(question => question.getOutputDefinitions(pageNo, survey.calcQuestionNo(this.getId(), question.getId())));
    if (withoutLogicalVariables) return questionsOutputDefinitions;
    return questionsOutputDefinitions.concat(this.getLogicalVariableOutputDefinitions(survey));
  }

  /** ロジック変数を評価する */
  evaluateLogicalVariable(survey, answers) {
    const logicalVariableResults = {};
    this.getLogicalVariables().forEach((lv) => {
      const code = lv.createFunctionCode(survey, this);
      const func = new Function('answers', code);
      const returnValue = func(Object.assign({}, answers, logicalVariableResults));
      logicalVariableResults[lv.getId()] = isNaN(returnValue) ? undefined : returnValue;
    });
    return logicalVariableResults;
  }

  /** ページに含まれるQuestionsのoutputDefinitionをすべて返す */
  getOutputDefinitions(survey) {
    const pageNo = survey.calcPageNo(this.getId());
    return this.getQuestions().flatMap(question => question.getOutputDefinitions(pageNo, survey.calcQuestionNo(this.getId(), question.getId())))
      .concat(this.getLogicalVariableOutputDefinitions(survey));
  }

  // ---------------------- 更新系 --------------------------
  /** itemを追加する */
  addItem(questionId, index) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const itemDevId = surveyDevIdGeneratorInstance.generateForItem(question.getDevId());
    const newItem = ItemDefinition.create(itemDevId, index);
    const newQuestion = question.set('items', question.getItems().insert(index, newItem));
    return this.setIn(['questions', questionIndex], newQuestion.fixItemIndex());
  }

  /** item, subItemsを一括追加する */
  bulkAddItemsInner(questionId, text, prop) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    let items = prop === 'items' ? question.getItems() : question.getSubItems();
    text.split('\n').map(str => S(str).trim()).forEach((itemStr) => {
      if (itemStr.isEmpty()) return;
      items = items.push(
        new ItemDefinition({
          _id: cuid(),
          index: items.size,
          devId: surveyDevIdGeneratorInstance.generateForItem(question.getDevId()),
          value: '',
          label: itemStr.s,
          plainLabel: itemStr.stripTags().trim().s,
        }),
      );
    });
    const newQuestion = question.set(prop, items);
    return this.setIn(['questions', questionIndex], newQuestion.fixItemIndex());
  }

  /** itemを一括追加する */
  bulkAddItems(questionId, text) {
    return this.bulkAddItemsInner(questionId, text, 'items');
  }

  /** subItemを一括追加する */
  bulkAddSubItems(questionId, text) {
    return this.bulkAddItemsInner(questionId, text, 'subItems');
  }

  /** subItemを追加する */
  addSubItem(questionId, index) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const itemDevId = surveyDevIdGeneratorInstance.generateForItem(question.getDevId());
    const newQuestion = question.set('subItems', question.getSubItems().insert(index, ItemDefinition.create(itemDevId, index)));
    return this.setIn(['questions', questionIndex], newQuestion.fixSubItemIndex());
  }

  /** LogicalVariableを追加する */
  addLogicalVariable() {
    const logicalVariable = LogicalVariableDefinition.create();
    let name;
    for (let i = 0; i < 1000; i++) {
      name = S(i).padLeft(3, '0');
      if (this.isUniqueLogicalVariableName(logicalVariable.getId(), name.s)) break;
    }
    return this.update('logicalVariables', logicalVariables => logicalVariables.push(logicalVariable.set('variableName', name.s)));
  }

  /** pageにコンポーネントを追加する */
  addQuestion(questionClassName, pageId, index) {
    const modelMap = findQuestionDefinitionMap(questionClassName);
    const question = modelMap.definitionClass.create(this.getDevId(), modelMap.options);
    const newQuestions = this.getQuestions().insert(index, question);
    return this.set('questions', newQuestions);
  }

  /** itemを削除する */
  removeItem(questionId, itemId) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const filteredQuestion = question.set('items', question.getItems().filter(item => item.getId() !== itemId).toList());
    const fixedIndexQuestion = filteredQuestion.fixItemIndex();
    return this.setIn(['questions', questionIndex], fixedIndexQuestion);
  }

  /** subItemを削除する */
  removeSubItem(questionId, itemId) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const filteredQuestion = question.set('subItems', question.getSubItems().filter(item => item.getId() !== itemId).toList());
    const fixedIndexQuestion = filteredQuestion.fixSubItemIndex();
    return this.setIn(['questions', questionIndex], fixedIndexQuestion);
  }

  /** logicalVariableを削除する */
  removeLogicalVariable(logicalVariableId) {
    return this.update('logicalVariables', logicalVariables => logicalVariables.filter(lv => lv.getId() !== logicalVariableId));
  }

  /** questionを削除する */
  removeQuestion(questionId) {
    const questions = this.getQuestions().filter(question => question.getId() !== questionId);
    return this.set('questions', questions);
  }

  /** itemを入れ替える */
  swapItem(questionId, srcItemId, destItemId) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const srcIndex = this.findItemIndex(questionId, srcItemId);
    const destIndex = this.findItemIndex(questionId, destItemId);

    const swappedQuestion = question.update('items', items =>
      items.map((item, index) => {
        if (index === srcIndex) return items.get(destIndex);
        if (index === destIndex) return items.get(srcIndex);
        return items.get(index);
      }).toList(),
    );
    return this.setIn(['questions', questionIndex], swappedQuestion.fixItemIndex());
  }

  /** subItemを入れ替える */
  swapSubItem(questionId, srcItemId, destItemId) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const srcIndex = this.findSubItemIndex(questionId, srcItemId);
    const destIndex = this.findSubItemIndex(questionId, destItemId);

    const swappedQuestion = question.update('subItems', subItems =>
      subItems.map((item, index) => {
        if (index === srcIndex) return subItems.get(destIndex);
        if (index === destIndex) return subItems.get(srcIndex);
        return subItems.get(index);
      }).toList(),
    );
    return this.setIn(['questions', questionIndex], swappedQuestion.fixSubItemIndex());
  }

  /** questionを入れ替える */
  swapQuestion(srcQuestionId, destQuestionId) {
    const srcQuestionIndex = this.findQuestionIndex(srcQuestionId);
    const destQuestionIndex = this.findQuestionIndex(destQuestionId);
    const srcQuestion = this.findQuestion(srcQuestionId);
    const destQuestion = this.findQuestion(destQuestionId);

    return this
      .setIn(['questions', destQuestionIndex], srcQuestion)
      .setIn(['questions', srcQuestionIndex], destQuestion);
  }

  /** itemの属性の更新 */
  updateItemAttribute(questionId, itemId, attributeName, value, replacer) {
    const questionIndex = this.findQuestionIndex(questionId);
    const itemIndex = this.findItemIndex(questionId, itemId);
    const question = this.findQuestion(questionId);
    let newPage = this;
    if (attributeName === 'label' && question.isMatrixHtmlEnabled() && !S(question.getMatrixHtml()).isEmpty()) {
      // matrixHtmlが有効かつlabelの更新の場合はHTMLも更新する
      const item = question.getItems().get(itemIndex);
      const $html = $(question.getMatrixHtml());
      const updatedHtml = $html.find(`#${MatrixQuestion.getLabelId(item)}`).html(replacer.no2Id(value)).parents('table').prop('outerHTML');
      newPage = newPage.setIn(['questions', questionIndex, 'matrixHtml'], updatedHtml);
    }
    return newPage.setIn(['questions', questionIndex, 'items', itemIndex, attributeName], replacer.no2Id(value));
  }

  /**
   * itemのvisiblityConditionの更新
   *
   * valueMapはitemIdをキーとしたmap。一度に更新するのはHandsontableのパフォーマンス問題に対応するため。
   */
  updateItemVisiblityConditions(survey, questionId, valueMap) {
    const questionIndex = this.findQuestionIndex(questionId);
    let newState = this;
    Object.keys(valueMap).forEach((itemId) => {
      const itemIndex = this.findItemIndex(questionId, itemId);
      const node = survey.findNodeFromRefId(this.getId());
      const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId(), false);
      newState = newState.updateIn(['questions', questionIndex, 'items', itemIndex, 'visibilityCondition'], visibilityCondition => (
        (visibilityCondition || VisibilityConditionDefinition.create()).updateProperties(survey, outputDefinitions, valueMap[itemId])
      ));
    });
    return newState;
  }

  /**
   * subItemのvisiblityConditionの更新
   *
   * valueMapはitemIdをキーとしたObject。一度に更新するのはHandsontableのパフォーマンス問題に対応するため。
   */
  updateSubItemVisiblityConditions(survey, questionId, valueMap) {
    const questionIndex = this.findQuestionIndex(questionId);
    let newState = this;
    Object.keys(valueMap).forEach((itemId) => {
      const itemIndex = this.findSubItemIndex(questionId, itemId);
      const node = survey.findNodeFromRefId(this.getId());
      const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId(), false);
      newState = newState.updateIn(['questions', questionIndex, 'subItems', itemIndex, 'visibilityCondition'], visibilityCondition => (
        (visibilityCondition || VisibilityConditionDefinition.create()).updateProperties(survey, outputDefinitions, valueMap[itemId])
      ));
    });
    return newState;
  }

  /** subItemの属性の更新 */
  updateSubItemAttribute(questionId, itemId, attributeName, value, replacer) {
    const questionIndex = this.findQuestionIndex(questionId);
    const itemIndex = this.findSubItemIndex(questionId, itemId);
    const question = this.findQuestion(questionId);
    let newPage = this;
    if (attributeName === 'label' && question.isMatrixHtmlEnabled() && !S(question.getMatrixHtml()).isEmpty()) {
      // matrixHtmlが有効かつlabelの更新の場合はHTMLも更新する
      const item = question.getSubItems().get(itemIndex);
      const $html = $(question.getMatrixHtml());
      const updatedHtml = $html.find(`#${MatrixQuestion.getLabelId(item)}`).html(replacer.no2Id(value)).parents('table').prop('outerHTML');
      newPage = newPage.setIn(['questions', questionIndex, 'matrixHtml'], updatedHtml);
    }
    return newPage.setIn(['questions', questionIndex, 'subItems', itemIndex, attributeName], replacer.no2Id(value));
  }

  /** logicalVariableの更新. logicalVariableはlabel属性が重複を許さないため、logicalVariable単位で更新する */
  updateLogicalVariable(logicalVariableId, logicalVariable) {
    const logicalVariableIndex = this.findLogicalVariableIndex(logicalVariableId);
    return this.setIn(['logicalVariables', logicalVariableIndex], logicalVariable);
  }

  /** pageの属性の更新 */
  updatePageAttribute(attributeName, value, replacer) {
    if (attributeName === 'html') {
      return this.set(attributeName, replacer.no2Id(value));
    }
    return this.set(attributeName, value);
  }

  /** questionの属性の更新 */
  updateQuestionAttribute(questionId, attributeName, value1, value2, replacer) {
    const questionIndex = this.findQuestionIndex(questionId);
    if (attributeName === 'title') {
      const newState = this.setIn(['questions', questionIndex, attributeName], replacer.no2Id(value1))
        .setIn(['questions', questionIndex, 'plainTitle'], replacer.no2Id(value2));
      return newState;
    }
    if (attributeName === 'matrixHtml') {
      return this.setIn(['questions', questionIndex, attributeName], replacer.no2Id(value1));
    }
    if (attributeName === 'items') {
      throw new Error('updateQuestionAttributeではitemsを更新できません');
    }
    return this.setIn(['questions', questionIndex, attributeName], replacer.no2Id(value1));
  }

  /**
   * ゴミを削除する
   */
  clean(survey) {
    return this.update('questions', questions => questions.map(question => question.clean(survey, this)));
  }

  /** validation */
  validate(survey) {
    const pageNo = survey.calcPageNo(this.getId());
    let errors = this.getLogicalVariables()
      .flatMap(logicalVariable => logicalVariable.validate(survey))
      .concat(this.getQuestions().flatMap((question) => {
        const questionNo = `${pageNo}-${survey.calcQuestionNo(this.getId(), question.getId())}`;
        return question.validate(survey).map(error => new ValidationErrorDefinition({ type: error.getType(), message: `設問 ${questionNo} ${error.getMessage()}` }));
      }),
    );

    // 存在しないOutputDefinitionがないかチェック
    const questionsOutputDefinitions = this.getOutputDefinitionsFromThisPage(survey, true);
    const props = {
      survey,
      options: new Options(),
      runtime: new RuntimeValue(),
      view: new View(),
      page: this,
    };
    const pageHtml = ReactDOMServer.renderToStaticMarkup(<Page {...props} />);
    const $dummyNode = $('<div/>').html(pageHtml);
    const notFoundOutputDefinitions = questionsOutputDefinitions.filter(od => $dummyNode.find(`[name="${od.getName()}"]`).length === 0);
    errors = errors.concat(notFoundOutputDefinitions.map(od => ValidationErrorDefinition.createWarning(`${od.getOutputNo()}に対応するフォームフィールドが存在しません`)));

    // 重複するradioの値が無いかチェック
    questionsOutputDefinitions
      .filter(od => od.getOutputType() === 'radio')
      .forEach((od) => {
        const values = $dummyNode.find(`[name="${od.getName()}"]`).map((i, el) => el.value).toArray();
        values.forEach((v, i, a) => {
          if (a.indexOf(v) === i) return;
          errors = errors.push(ValidationErrorDefinition.createError(`${od.getOutputNo()}に対応するradioに重複する値(${v})があります`));
        });
      });

    // 重複するoptionの値が無いかチェック
    questionsOutputDefinitions
      .filter(od => od.getOutputType() === 'select')
      .forEach((od) => {
        const values = $dummyNode.find(`[name="${od.getName()}"] option`).map((i, el) => el.value).toArray();
        values.forEach((v, i, a) => {
          if (a.indexOf(v) === i) return;
          errors = errors.push(ValidationErrorDefinition.createError(`${od.getOutputNo()}に対応するselectに重複する値(${v})があります`));
        });
      });

    // 重複するOutputDefinitionがないかチェック
    const duplicatedOutputDefinitions = questionsOutputDefinitions
      .filter(od => od.getOutputType() !== 'radio')
      .filter(od => $dummyNode.find(`[name="${od.getName()}"]`).length > 1);

    // HTMLの中に存在しない参照がないか確認
    if (this.isFreeMode()) {
      const node = survey.findNodeFromRefId(this.getId());
      const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId());
      const replacer = survey.getReplacer();
      if (!replacer.validate(this.getHtml(), outputDefinitions)) errors = errors.push(ValidationErrorDefinition.createError(`設問 ${pageNo} 存在しない参照があります`));
    }

    return errors.concat(duplicatedOutputDefinitions.map(od => ValidationErrorDefinition.createError(`${od.getOutputNo()}に対応するフォームフィールドが複数存在します`)));
  }

  /** テーブルのカスタマイズがonになっている設問を含んでいるかどうか */
  hasMatrixHtmlEnabledQuestion() {
    return !!this.getQuestions().find(question => question.isMatrixHtmlEnabled());
  }

  /** このページを編集できるかどうか */
  isEditDisabled() {
    return !isDevelopment() && this.isFreeMode();
  }
}
