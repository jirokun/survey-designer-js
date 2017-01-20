import { Record } from 'immutable';

export const ChoiceRecord = Record({
  label: '',
  value: '',
});

export default class Choice extends ChoiceRecord {
}
