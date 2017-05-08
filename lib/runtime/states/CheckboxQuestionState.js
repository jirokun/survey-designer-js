import BaseTransformedQuestionState from './BaseTransformedQuestionState';

/** CheckboxQuestionで使用するstate */
export default class CheckboxQuestionState extends BaseTransformedQuestionState {
  /** indexのcheckboxの値を更新する */
  setItemState(index, checked) {
    // transformedQuestionをindexで並び替え
    const item = this.getTransformedItems().sort((a, b) => {
      if (a.getIndex() < b.getIndex()) return -1;
      if (a.getIndex() === b.getIndex()) return 0;
      return 1;
    }).get(index);

    // 排他処理がない場合
    if (!item.isExclusive()) {
      return this.setIn(['itemState', index, 'checked'], checked);
    }
    // disabledも合わせて設定することに注意
    if (checked) {
      return this
        .updateIn(['itemState'], state =>
          state.map((v, i) =>
            v
              .set('disabled', i !== index)
              .set('checked', i === index),
          ),
        );
    }
    return this
      .updateIn(['itemState'], state =>
        state.map(v =>
          v
            .set('disabled', false)
            .set('checked', false),
        ),
      );
  }
}
