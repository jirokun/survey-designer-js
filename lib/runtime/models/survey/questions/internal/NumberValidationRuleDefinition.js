import { Record, List, is } from 'immutable';
import cuid from 'cuid';
import NumberValidationDefinition from './NumberValidationDefinition';

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
    return this.getNumberValidations().flatMap(numberValidation => numberValidation.validate(survey, page, question));
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
