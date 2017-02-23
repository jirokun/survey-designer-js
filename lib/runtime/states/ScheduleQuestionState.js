import { Record, List } from 'immutable';

const ScheduleQuestionStateRecord = Record({
  // チェックボックスが選択されているかどうかを格納する
  // 二次元配列で下記のように格納する。
  // [
  //   [false, false, true],
  //   [false, true,  true],
  //   [true,  false, false],
  //   [false],
  // ]
  //
  // 最後列は一つしかcheckboxが無いのでlengthは1となる。
  // その他の列は3列固定。
  checkState: List(),
});

export default class ScheduleQuestionState extends ScheduleQuestionStateRecord {
  getCheckState() {
    return this.get('checkState');
  }

  /** チェックボックスの選択値を変更 */
  updateCheckState(itemIndex, periodIndex, checked) {
    const checkState = this.getCheckState();
    // 最後の行のチェックボックスが選択されたら排他処理のため、すべてのcheckedをfalseにする
    if (itemIndex === checkState.size - 1 && checked) {
      return this.set('checkState', checkState.update(list1 =>
        list1.map(list2 =>
          list2.map(() => false).toList(),
        ).toList(),
      )).setIn(['checkState', checkState.size - 1, 0], checked); // 最後の要素だけtrue
    }
    return this
      .setIn(['checkState', itemIndex, periodIndex], checked)
      .setIn(['checkState', checkState.size - 1, 0], false); // 最後の要素はfalse
  }
}
