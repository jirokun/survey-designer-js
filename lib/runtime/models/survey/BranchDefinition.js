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
      const outputDefinition = allOutputDefinitionsMap.get(childCondition.getOutputId());
      const answerValue = answers.get(outputDefinition.getName());
      const op = childCondition.getOperator();
      const value = childCondition.getValue();
      switch (op) {
        case '==':
          return answerValue === value;
        case '!=':
          return answerValue !== value;
        case '>=':
          return answerValue >= value;
        case '<=':
          return answerValue <= value;
        case '>':
          return answerValue > value;
        case '<':
          return answerValue < value;
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
    const selectedCondition = this.getConditions().find((condition) => {
      const conditionType = condition.getConditionType();
      const childConditions = condition.getChildConditions();
      if (conditionType === 'all') {
        return childConditions.every(BranchDefinition.createEvaluateChildConditionClosure(answers, allOutputDefinitionsMap));
      } else if (conditionType === 'some') {
        return childConditions.some(BranchDefinition.createEvaluateChildConditionClosure(answers, allOutputDefinitionsMap));
      }
      throw new Error(`不明なconditionTypeです。 conditionType: ${conditionType}`);
    });
    return selectedCondition ? selectedCondition.getNextNodeId() : null;
  }
}
