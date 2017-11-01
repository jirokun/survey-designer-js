import { Record, List, is } from 'immutable';
import cuid from 'cuid';
import S from 'string';
import NumberValidationDefinition from './NumberValidationDefinition';
import ValidationErrorDefinition from '../../../ValidationErrorDefinition';
import { OPERATORS } from '../../../../../constants/NumberValidationRuleConstants';

/** 数値へのValidationRule */
export const NumberValidationRuleDefinitionRecord = Record({
  _id: null,                       // 内部で使用するID
  validationTypeInQuestion: null,        // 設問に閉じた検証タイプ。二桁の大文字アルファベット
  numberValidations: List(),             // 実際の条件
});

export default class NumberValidationRuleDefinition extends NumberValidationRuleDefinitionRecord {
  static create(opts) {
    return new NumberValidationRuleDefinition(Object.assign({}, opts, { _id: cuid() }));
  }

  getId() {
    return this.get('_id');
  }

  getValidationTypeInQuestion() {
    return this.get('validationTypeInQuestion');
  }

  getNumberValidations() {
    return this.get('numberValidations');
  }

  validate(survey, page, question) {
    const errors = this.getNumberValidations().flatMap(numberValidation => numberValidation.validate(survey, page, question));
    // 重複したものをリスト
    const duplicatedList = this.getNumberValidations()
      .map(numberValidation => numberValidation.getOperator())
      .filter(operator => !S(operator).isEmpty())                           // 未入力はNumbeValidation.validateでチェックしているため除外
      .filter((x, i, self) => self.indexOf(x) !== self.lastIndexOf(x));
    return errors.concat(duplicatedList.map(duplicatedOperator => ValidationErrorDefinition.createError(`入力値制限に重複した条件があります(${OPERATORS[duplicatedOperator]})`)));
  }

  equals(other) {
    return is(this.getNumberValidations(), other.getNumberValidations());
  }

  /** numberValidationを追加する */
  addNumberValidation(opts = {}) {
    return this.update('numberValidations', numberValidations => numberValidations.push(NumberValidationDefinition.create(opts)));
  }

  /** numberValidationを削除する */
  removeNumberValidation(numberValidationId) {
    return this.update('numberValidations', numberValidations => numberValidations.filter(nv => nv.getId() !== numberValidationId));
  }

  /** numberValidationの属性を更新する */
  updateNumberValidationAttribute(numberValidationId, attr, value) {
    const index = this.getNumberValidations().findIndex(nv => nv.getId() === numberValidationId);
    return this.setIn(['numberValidations', index, attr], value);
  }
}
