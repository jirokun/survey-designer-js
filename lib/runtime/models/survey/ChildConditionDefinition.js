import cuid from 'cuid';
import { Record, List } from 'immutable';

export const ChildConditionDefinitionRecord = Record({
  _id: null,
  outputId: '',      // 参照先の設問のID.要素のname属性とは異なるので注意
  operator: '==',    // どういう条件か
  value: '',         // 比較値
});

/** ChildConditionの定義 */
export default class ChildConditionDefinition extends ChildConditionDefinitionRecord {
  static create() {
    return new ChildConditionDefinition({ _id: cuid() });
  }

  getId() {
    return this.get('_id');
  }

  getOutputId() {
    return this.get('outputId');
  }

  getOperator() {
    return this.get('operator');
  }

  getValue() {
    return this.get('value');
  }

  /** 値を検証する */
  validate(survey, branchId) {
    let errors = List();
    const allOutputDefinitionMap = survey.getAllOutputDefinitionMap();
    if (!allOutputDefinitionMap.has(this.getOutputId())) {
      errors = errors.push('設定されていない分岐条件があります');
    } else {
      const od = allOutputDefinitionMap.get(this.getOutputId());
      const replacer = survey.getReplacer();
      const node = survey.findNodeFromRefId(branchId);
      const precedingOutputDefinitions = survey.findPrecedingOutputDefinition(node.getId(), false);
      if (od.getOutputType() === 'number' && this.getValue() === '') {
        errors = errors.push('分岐条件の入力値が空欄です');
      } else if (od.getOutputType() === 'radio' && this.getValue() === '') {
        errors = errors.push('分岐条件の入力値が選択されていません');
      } else if (
        (od.getOutputType() === 'number' || od.getOutputType() === 'radio')
        && !replacer.validate(this.getValue(), precedingOutputDefinitions)
      ) {
        errors = errors.push('分岐条件の参照先が存在しません');
      }
    }
    return errors;
  }
}
