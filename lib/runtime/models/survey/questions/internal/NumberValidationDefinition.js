import { Record, List } from 'immutable';
import cuid from 'cuid';
import S from 'string';

/** 数値のValidation */
export const NumberValidationDefinitionRecord = Record({
  _id: null,                // 内部で使用するID
  value: '',              // 比較する値
  operator: '',           // 対応する値
});

export default class NumberValidationDefinition extends NumberValidationDefinitionRecord {
  static create(opts) {
    return new NumberValidationDefinition(Object.assign({}, opts, { _id: cuid() }));
  }

  getId() {
    return this.get('_id');
  }

  getValue() {
    return this.get('value');
  }

  getOperator() {
    return this.get('operator');
  }

  validate(survey, page, question) {
    const replacer = survey.getReplacer();
    const errors = [];
    const node = survey.findNodeFromRefId(page.getId());
    const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId(), true, true);
    if (S(this.getValue()).isEmpty()) {
      errors.push('数値制限で値が設定されていません');
    } else if (!replacer.validate(this.getValue(), outputDefinitions)) {
      errors.push('数値制限で不正な参照が設定されています');
    }
    if (S(this.getOperator()).isEmpty()) {
      errors.push('数値制限で比較方法が設定されていません');
    }
    return List(errors);
  }

  /** Immutable.jsが等値かどうかを判断するためのメソッド */
  equals(other) {
    return other.getValue() === this.getValue()
      && other.getOperator() === this.getOperator();
  }
}
