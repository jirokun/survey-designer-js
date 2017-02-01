import { Record } from 'immutable';

export const ChoiceRecord = Record({
  index: -1, // 定義順
  label: '',
  plainLabel: '',
  value: '',
  randomFixed: false,
  exclusive: false,
  textInput: false,
  numberInput: false,
  unit: '',
});

export default class ChoiceDefinition extends ChoiceRecord {
  /** 自由入力の値を変換する */
  parseLabel() {
    const label = this.getLabel();
    const match = label.match(/(.*)\{\$((?:TEXT|NUMBER)_INPUT)\}(.*)/);
    if (match) {
      return this
        .set('label', match[1])
        .set('textInput', match[2] === 'TEXT_INPUT')
        .set('numberInput', match[2] === 'NUMBER_INPUT')
        .set('unit', match[3]);
    }
    return this;
  }

  getIndex() {
    return this.get('index');
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

  isExclusive() {
    return this.get('exclusive');
  }

  hasTextInput() {
    return this.get('textInput');
  }

  hasNumberInput() {
    return this.get('numberInput');
  }

  getUnit() {
    return this.get('unit');
  }
}
