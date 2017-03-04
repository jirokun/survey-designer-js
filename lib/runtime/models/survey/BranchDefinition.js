import { Record, List } from 'immutable';
import cuid from 'cuid';
import ConditionDefinition from './ConditionDefinition';

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
  static createEvaluateChildConditionClosure(answers, allOutputDefinitionsMap) {
    return (childCondition) => {
      const od = allOutputDefinitionsMap.get(childCondition.getOutputId());
      const answerValue = answers.get(od.getName());
      const op = childCondition.getOperator();
      const value = childCondition.getValue();

      if (answerValue === undefined) {
        throw new Error(`条件分岐に使用されている値が入力されていません。遷移条件に不整合の可能性があります。
  設問番号: ${od.getOutputNo()}
  設問ラベル: ${od.getLabel()}
  name属性名: ${od.getName()}`);
      }
      switch (op) {
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

  findConditionIndex(conditionId) {
    return this.get('conditions').findIndex(condition => condition.getId() === conditionId);
  }

  /** 入力値をもとに条件を評価し次に遷移するnodeIdを返す */
  evaluateConditions(answers, allOutputDefinitionsMap) {
    const evaluateChildConditionClosure = BranchDefinition.createEvaluateChildConditionClosure(answers, allOutputDefinitionsMap);
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
}
