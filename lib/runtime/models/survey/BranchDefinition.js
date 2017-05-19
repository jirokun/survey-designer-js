import { Record, List } from 'immutable';
import cuid from 'cuid';
import S from 'string';
import ConditionDefinition from './ConditionDefinition';
import ChildConditionDefinition from './ChildConditionDefinition';

export const BranchDefinitionRecord = Record({
  _id: null,
  type: null,
  conditions: List(),
});

/** Branchの定義 */
export default class BranchDefinition extends BranchDefinitionRecord {
  static create() {
    const id = cuid();
    const conditions = List().push(ConditionDefinition.create());
    return new BranchDefinition({ _id: id, conditions });
  }

  /** childConditionを評価するクロージャを生成する */
  static createEvaluateChildConditionClosure(answers, allOutputDefinitionsMap, replacer) {
    return (childCondition) => {
      const od = allOutputDefinitionsMap.get(childCondition.getOutputId());
      const answerValue = S(answers.get(od.getName())).s;
      const op = childCondition.getOperator();
      const value = S(replacer.id2Value(childCondition.getValue())).s;

      switch (op) {
        case '!!': // trueまたはfalseか。false, undefined, null, 0, '0', ''の場合にはfalseになる。回答データは文字列で扱うため、文字列の'0'もfalse扱いとする。
          return (
            !!answerValue &&
            answerValue !== '0'
          ).toString() === value;
        case '==':
          return answerValue === value;
        case '!=':
          return answerValue !== value;
        case '>=':
          return parseFloat(answerValue) >= parseFloat(value);
        case '<=':
          return parseFloat(answerValue) <= parseFloat(value);
        case '>':
          return parseFloat(answerValue) > parseFloat(value);
        case '<':
          return parseFloat(answerValue) < parseFloat(value);
        default:
          throw new Error(`未定義のoperatorです。operator: ${op}`);
      }
    };
  }

  getId() {
    return this.get('_id');
  }

  getType() {
    return this.get('type');
  }

  getConditions() {
    return this.get('conditions');
  }

  // ---------------------- 検索系 --------------------------
  /** conditionを探す */
  findCondition(conditionId) {
    const ret = this.getConditions().find(def => def.getId() === conditionId);
    if (ret) {
      return ret;
    }
    throw new Error(`Invalid conditionId: ${conditionId}`);
  }

  findConditionIndex(conditionId) {
    return this.get('conditions').findIndex(condition => condition.getId() === conditionId);
  }

  /** 入力値をもとに条件を評価し次に遷移するnodeIdを返す */
  evaluateConditions(answers, allOutputDefinitionsMap, replacer) {
    const evaluateChildConditionClosure = BranchDefinition.createEvaluateChildConditionClosure(answers, allOutputDefinitionsMap, replacer);
    const selectedCondition = this.getConditions().find((condition) => {
      const conditionType = condition.getConditionType();
      const childConditions = condition.getChildConditions();
      if (conditionType === 'all') {
        return childConditions.every(evaluateChildConditionClosure);
      } else if (conditionType === 'some') {
        return childConditions.some(evaluateChildConditionClosure);
      }
      throw new Error(`不明なconditionTypeです。 conditionType: ${conditionType}`);
    });
    return selectedCondition ? selectedCondition.getNextNodeId() : null;
  }

  // ---------------------- 更新系 --------------------------
  /** childConditionを追加する */
  addChildCondition(conditionId, index) {
    const conditionIndex = this.findConditionIndex(conditionId);
    const condition = this.getConditions().get(conditionIndex);
    const childConditions = condition.getChildConditions();
    const newChildConditions = childConditions.insert(index, ChildConditionDefinition.create());
    return this.setIn(['conditions', conditionIndex, 'childConditions'], newChildConditions);
  }

  /** conditionを追加する */
  addCondition(index) {
    const conditions = this.getConditions();
    const newConditions = conditions.insert(index, ConditionDefinition.create());
    return this.set('conditions', newConditions);
  }

  /** childConditionを削除する */
  removeChildCondition(conditionId, childConditionId) {
    const conditionIndex = this.findConditionIndex(conditionId);
    const condition = this.getConditions().get(conditionIndex);
    const childConditions = condition.getChildConditions().filter(cc => cc.getId() !== childConditionId);
    return this.setIn(['conditions', conditionIndex, 'childConditions'], childConditions);
  }

  /** Conditionを削除する */
  removeCondition(conditionId) {
    const conditions = this.getConditions().filter(condition => condition.getId() !== conditionId);
    return this.set('conditions', conditions);
  }

  /** 分岐条件を入れ替える */
  swapCondition(srcConditionId, destConditionId) {
    const srcCondition = this.findCondition(srcConditionId);
    const destCondition = this.findCondition(destConditionId);
    const srcConditionIndex = this.findConditionIndex(srcConditionId);
    const destConditionIndex = this.findConditionIndex(destConditionId);

    return this
      .setIn(['conditions', destConditionIndex], srcCondition)
      .setIn(['conditions', srcConditionIndex], destCondition);
  }

  /** conditionの属性の更新 */
  updateChildConditionAttribute(survey, conditionId, childConditionId, attributeName, value) {
    const conditionIndex = this.findConditionIndex(conditionId);
    const condition = this.getConditions().get(conditionIndex);
    const childConditionIndex = condition.findChildConditionIndex(childConditionId);
    const newState = this.setIn(['conditions', conditionIndex, 'childConditions', childConditionIndex, attributeName], value);
    if (!S(value).isEmpty() && attributeName === 'outputId') {
      const targetOutputDefinition = survey.findOutputDefinition(value);
      // checkboxの場合にはoperatorを"!!"にする。
      const newOperator = targetOutputDefinition.getOutputType() === 'checkbox' ? '!!' : '==';
      const newValue = targetOutputDefinition.getOutputType() === 'checkbox' ? 'true' : '';
      return newState
        .setIn(['conditions', conditionIndex, 'childConditions', childConditionIndex, 'operator'], newOperator)
        .setIn(['conditions', conditionIndex, 'childConditions', childConditionIndex, 'value'], newValue);
    }
    return newState;
  }

  /** conditionの属性の更新 */
  updateConditionAttribute(conditionId, attributeName, value) {
    const conditionIndex = this.findConditionIndex(conditionId);
    return this.setIn(['conditions', conditionIndex, attributeName], value);
  }

  /** 設定値を検証する */
  validate(survey) {
    return this.getConditions().flatMap(condition => condition.validate(survey, this.getId()));
  }
}
