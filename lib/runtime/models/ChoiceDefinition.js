import { Record } from 'immutable';

export const ChoiceRecord = Record({
  label: '',
  value: '',
});

export default class ChoiceDefinition extends ChoiceRecord {
  getLabel() {
    return this.get('label');
  }

  getValue() {
    return this.get('value');
  }
}
