import { Record, List } from 'immutable';
import S from 'string';
import cuid from 'cuid';
import CheckboxQuestionDefinition from './questions/CheckboxQuestionDefinition';
import OutputDefinition from './questions/internal/OutputDefinition';
import ItemDefinition from './questions/internal/ItemDefinition';
import LogicalVariableDefinition from './LogicalVariableDefinition';
import { findQuestionDefinitionClass } from './questions/QuestionDefinitions';

const PageDefinitionRecord = Record({
  _id: null,
  questions: List(),        // 設問のリスト
  logicalVariables: List(),   // ロジック変数の定義
  javaScriptCode: '',       // Pageが表示されたときに実行されるJavaScript
});

/** ページの定義 */
export default class PageDefinition extends PageDefinitionRecord {
  static create() {
    const id = cuid();
    const questions = List().push();
    const logicalVariables = List();
    return new PageDefinition({ _id: id, questions, logicalVariables });
  }

  getId() {
    return this.get('_id');
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

  /** ロジック変数を評価する */
  evaluateLogicalVariable(allOutputDefinitionMap, answers) {
    const logicalVariableResults = {};
    this.getLogicalVariables().forEach((lv) => {
      const code = lv.createFunctionCode(allOutputDefinitionMap);
      const func = new Function('answers', code);
      logicalVariableResults[lv.getId()] = func(Object.assign({}, answers, logicalVariableResults));
    });
    return logicalVariableResults;
  }

  // ---------------------- 更新系 --------------------------
  /** itemを追加する */
  addItem(questionId, index) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const newQuestion = question.set('items', question.getItems().insert(index, ItemDefinition.create(index)));
    return this.setIn(['questions', questionIndex], newQuestion.fixItemIndex());
  }

  /** subItemを追加する */
  addSubItem(questionId, index) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const newQuestion = question.set('subItems', question.getSubItems().insert(index, ItemDefinition.create(index)));
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
    const Model = findQuestionDefinitionClass(questionClassName);
    const question = Model.create();
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
    return this.setIn(['questions', questionIndex, 'items', itemIndex, attributeName], replacer.no2Id(value));
  }

  /** subItemの属性の更新 */
  updateSubItemAttribute(questionId, itemId, attributeName, value, replaceUtil) {
    const questionIndex = this.findQuestionIndex(questionId);
    const itemIndex = this.findSubItemIndex(questionId, itemId);
    return this.setIn(['questions', questionIndex, 'subItems', itemIndex, attributeName], replaceUtil.no2Id(value));
  }

  /** logicalVariableの更新. logicalVariableはlabel属性が重複を許さないため、logicalVariable単位で更新する */
  updateLogicalVariable(logicalVariableId, logicalVariable) {
    const logicalVariableIndex = this.findLogicalVariableIndex(logicalVariableId);
    return this.setIn(['logicalVariables', logicalVariableIndex], logicalVariable);
  }

  /** pageの属性の更新 */
  updatePageAttribute(attributeName, value) {
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
    if (attributeName === 'items') {
      throw new Error('updateQuestionAttributeではitemsを更新できません');
    }
    return this.setIn(['questions', questionIndex, attributeName], replacer.no2Id(value1));
  }

  /** validation */
  validate(survey) {
    const pageNo = survey.calcPageNo(this.getId());
    return this.getLogicalVariables().flatMap(logicalVariable => logicalVariable.validate(survey))
      .concat(this.getQuestions().flatMap((question) => {
        const questionNo = `${pageNo}-${survey.calcQuestionNo(this.getId(), question.getId())}`;
        return question.validate(survey).map(error => `設問 ${questionNo} ${error}`);
      }));
  }
}
