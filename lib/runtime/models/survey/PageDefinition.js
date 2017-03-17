import { Record, List } from 'immutable';
import S from 'string';
import cuid from 'cuid';
import CheckboxQuestionDefinition from './questions/CheckboxQuestionDefinition';
import OutputDefinition from './questions/internal/OutputDefinition';
import ItemDefinition from './questions/internal/ItemDefinition';
import LogicVariableDefinition from './LogicVariableDefinition';
import { findQuestionDefinitionClass } from './questions/QuestionDefinitions';

const PageDefinitionRecord = Record({
  _id: null,
  questions: List(),        // 設問のリスト
  logicVariables: List(),   // ロジック変数の定義
  javaScriptCode: '',       // Pageが表示されたときに実行されるJavaScript
});

/** ページの定義 */
export default class PageDefinition extends PageDefinitionRecord {
  static create() {
    const id = cuid();
    const questions = List().push(CheckboxQuestionDefinition.create());
    const logicVariables = List();
    return new PageDefinition({ _id: id, questions, logicVariables });
  }

  /**
   * エディタで入力したJavaScriptの設問番号を設問のnameに変換する
   * 例 Q1_2_1 -> uuid
   */
  static encodeJavaScriptCode(survey, code) {
    const questionNoMap = survey.getQuestionNoMap();
    let encodedCode = S(code);
    for (const key in questionNoMap) {
      if (!Object.prototype.hasOwnProperty.call(questionNoMap, key)) continue;
      const pattern = `\${${key}}`;
      encodedCode = encodedCode.replaceAll(pattern, questionNoMap[key]);
    }
    return encodedCode.s;
  }

  /** エディタで入力したJavaScriptのを設問番号を設問のnameに変換する */
  static decodeJavaScriptCode(survey, code) {
    const questionNameMap = survey.getQuestionNameMap();
    let encodedCode = S(code);
    for (const key in questionNameMap) {
      if (!Object.prototype.hasOwnProperty.call(questionNameMap, key)) continue;
      const pattern = key;
      encodedCode = encodedCode.replaceAll(pattern, `\${${questionNameMap[key]}}`);
    }
    return encodedCode.s;
  }

  getId() {
    return this.get('_id');
  }

  getQuestions() {
    return this.get('questions');
  }

  getLogicVariables() {
    return this.get('logicVariables');
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

  findLogicVariableIndex(logicVariableId) {
    return this.getLogicVariables().findIndex(lv => lv.getId() === logicVariableId);
  }

  /** ロジック変数名がユニークかどうかを確認する */
  isUniqueLogicVariableName(logicVariableId, logicVariableName) {
    return this.getLogicVariables().findIndex(lv => lv.getId() !== logicVariableId && lv.getVariableName() === logicVariableName) === -1;
  }

  /** ロジック変数のOutputDefinitionを取得する */
  getLogicVariableOutputDefinitions() {
    return this.getLogicVariables().map(lv =>
      new OutputDefinition({
        _id: lv.getId(),
        name: lv.getId(),
        label: '',   // 表示しない
        outputType: 'number',
        outputNo: lv.getVariableName(),
      }),
    );
  }

  /** ロジック変数を評価する */
  evaluateLogicVariable(allOutputDefinitionMap, answers) {
    const logicVariableResults = {};
    this.getLogicVariables().forEach((lv) => {
      const code = lv.createFunctionCode(allOutputDefinitionMap);
      const func = new Function('answers', code);
      logicVariableResults[lv.getId()] = func(Object.assign({}, answers, logicVariableResults));
    });
    return logicVariableResults;
  }

  // ---------------------- 更新系 --------------------------
  /** itemを追加する */
  addItem(questionId, index) {
    const questionIndex = this.findQuestionIndex(questionId);
    const question = this.findQuestion(questionId);
    const newQuestion = question.set('items', question.getItems().insert(index, ItemDefinition.create(index)));
    return this.setIn(['questions', questionIndex], newQuestion.fixItemIndex());
  }

  /** LogicVariableを追加する */
  addLogicVariable(survey) {
    const logicVariable = LogicVariableDefinition.create();
    const pageNo = survey.calcPageNo(this.getId());
    let name;
    for (let i = 0; i < 1000; i++) {
      name = `${pageNo}-L-${S(i).padLeft(3, '0')}`;
      if (this.isUniqueLogicVariableName(logicVariable.getId(), name)) break;
    }
    return this.update('logicVariables', logicVariables => logicVariables.push(logicVariable.set('variableName', name)));
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

  /** logicVariableを削除する */
  removeLogicVariable(logicVariableId) {
    return this.update('logicVariables', logicVariables => logicVariables.filter(lv => lv.getId() !== logicVariableId));
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
  updateItemAttribute(questionId, itemId, attributeName, value, replaceUtil) {
    const questionIndex = this.findQuestionIndex(questionId);
    const itemIndex = this.findItemIndex(questionId, itemId);
    return this.setIn(['questions', questionIndex, 'items', itemIndex, attributeName], replaceUtil.outputNo2Name(value));
  }

  /** logicVariableの更新. logicVariableはlabel属性が重複を許さないため、logicVariable単位で更新する */
  updateLogicVariable(logicVariableId, logicVariable) {
    const logicVariableIndex = this.findLogicVariableIndex(logicVariableId);
    return this.setIn(['logicVariables', logicVariableIndex], logicVariable);
  }

  /** pageの属性の更新 */
  updatePageAttribute(attributeName, value) {
    return this.set(attributeName, value);
  }

  /** questionの属性の更新 */
  updateQuestionAttribute(questionId, attributeName, value1, value2, replaceUtil) {
    const questionIndex = this.findQuestionIndex(questionId);
    if (attributeName === 'title') {
      const newState = this.setIn(['questions', questionIndex, attributeName], replaceUtil.outputNo2Name(value1))
        .setIn(['questions', questionIndex, 'plainTitle'], replaceUtil.outputNo2Name(value2));
      return newState;
    }
    if (attributeName === 'items') {
      throw new Error('updateQuestionAttributeではitemsを更新できません');
    }
    return this.setIn(['questions', questionIndex, attributeName], replaceUtil.outputNo2Name(value1));
  }
}
