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
    // 排他選択肢をcheckした場合
    if (checked) {
      return this
        .updateIn(['itemState'], state =>
          state.map((v, i) => {
            if (i === index) {
              // 選択した排他選択肢はdisabledとcheckedを更新
              return v
                .set('disabled', false)
                .set('checked', true);
            }
            // 選択した排他選択肢ではない場合はdisabledを更新
            return v
              .set('disabled', true);
          }),
        );
    }

    // 排他選択肢のチェックを外した場合
    return this
      .updateIn(['itemState'], state =>
        state.map((v, i) => {
          if (i === index) {
            // 選択を外した排他選択肢はdisabledとcheckedを更新
            return v
              .set('disabled', false)
              .set('checked', false);
          }
          // 選択を外した排他選択肢ではない場合はdisabledを更新
          return v
            .set('disabled', false);
        }),
      );
  }
}
