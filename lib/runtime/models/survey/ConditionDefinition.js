import cuid from 'cuid';
import { Record, List } from 'immutable';
import ChildConditionDefinition from './ChildConditionDefinition';
import ValidationErrorDefinition from '../ValidationErrorDefinition';

export const ConditionDefinitionRecord = Record({
  _id: null,
  conditionType: 'all',         // allまたはsome。childConditionを評価する際にandになるかorになるかが変わる
  nextNodeId: '',               // 条件にマッチしたときに遷移するnodeのid。node.nextNodeIdよりも優先される
  childConditions: List(),      // 実際の条件
});

/** Conditionの定義 */
export default class ConditionDefinition extends ConditionDefinitionRecord {
  static create() {
    return new ConditionDefinition({
      _id: cuid(),
      childConditions: List().push(ChildConditionDefinition.create()),
    });
  }

  getId() {
    return this.get('_id');
  }

  getConditionType() {
    return this.get('conditionType');
  }

  getNextNodeId() {
    return this.get('nextNodeId');
  }

  getChildConditions() {
    return this.get('childConditions');
  }

  findChildConditionIndex(childConditionId) {
    return this.getChildConditions().findIndex(cc => cc.getId() === childConditionId);
  }

  /** 設定の検証を行う */
  validate(survey, branchId) {
    let errors = List();
    const nodes = survey.getNodes();
    if (nodes.findIndex(node => node.getId() === this.getNextNodeId()) === -1) errors = errors.push(ValidationErrorDefinition.createError('分岐設定の遷移先が存在しません'));
    return errors.concat(this.getChildConditions().flatMap(cc => cc.validate(survey, branchId)));
  }
}
