import { Record } from 'immutable';

export const ERROR_TYPES = { ERROR: 'ERROR', WARNING: 'WARNING' };

export const ValidationErrorDefinitionRecord = Record({
  type: null,                     // ERRORまたはWARNING
  message: null,                  // メッセージ
});

/** Branchの定義 */
export default class ValidationErrorDefinition extends ValidationErrorDefinitionRecord {
  static createError(message) {
    return new ValidationErrorDefinition({ type: ERROR_TYPES.ERROR, message });
  }

  static createWarning(message) {
    return new ValidationErrorDefinition({ type: ERROR_TYPES.WARNING, message });
  }

  getType() {
    return this.get('type');
  }

  getMessage() {
    return this.get('message');
  }
}
