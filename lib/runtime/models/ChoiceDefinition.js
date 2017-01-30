import { Record } from 'immutable';

export const ChoiceRecord = Record({
  label: '',
  plainLabel: '',
  value: '',
  randomFixed: false,
  exclusion: false,
});

export default class ChoiceDefinition extends ChoiceRecord {
  /** 自由入力の値を変換する */
  static transformFreeInput(questionId, index, label) {
    const name = `${questionId}__value${index + 1}__text`;
    if (label.indexOf('{$TEXT_INPUT}') !== -1) {
      return label.replace('{$TEXT_INPUT}', `<input type="text" name="${name}" id="${name}" />`);
    }
    return label.replace('{$NUMBER_INPUT}', `<input type="number" name="${name}" id="${name}" />`);
  }

  static transformLabel(questionId, index, label) {
    return ChoiceDefinition.transformFreeInput(questionId, index, label);
  }

  getLabel() {
    return this.get('label');
  }

  getPlainLabel() {
    return this.get('plainLabel');
  }

  getValue() {
    return this.get('value');
  }

  isRandomFixed() {
    return this.get('randomFixed');
  }

  isExclusion() {
    return this.get('exclusion');
  }
}
