import { Record } from 'immutable';

const SelectionCountValidatorRecord = Record({
  min: null,
  max: null,
});

/**
 * チェックボックスの選択数の最小、最大を検証する
 */
export default class SelectionCountValidator extends SelectionCountValidatorRecord {
  getMin() {
    return this.get('min');
  }

  getMax() {
    return this.get('max');
  }

  /**
   * バリデーションを行う
   *
   * @param thisValueArr questionに対応する値
   * @param allValue すべてのquestionに対応する値
   */
  validate(thisValueArr, allValue) {
  }
}
