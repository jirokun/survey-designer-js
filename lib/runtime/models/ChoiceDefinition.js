import { Record } from 'immutable';

export const ChoiceRecord = Record({
  label: '',
  plainLabel: '',
  value: '',
  randomFixed: false,
  freeInput: false,
  freeInputRequired: false,
  exclusion: false,
});

export default class ChoiceDefinition extends ChoiceRecord {
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

  isFreeInput() {
    return this.get('freeInput');
  }

  isFreeInputRequired() {
    return this.get('freeInputRequired');
  }

  isExclusion() {
    return this.get('exclusion');
  }
}
