import $ from 'jquery';
import { zenkakuNum2Hankaku } from '../../../utils';

/**
 * 数値の全角入力を半角に変換するクラス
 *
 * 有効となる条件
 * inputにclass="sdj-numeric"
 */
export default class NumericInput {
  constructor(el) {
    this.el = el;
  }

  initialize() {
    $(this.el).on('change', '.sdj-numeric', (e) => {
      const value = $(e.target).val();
      const hankakuValue = zenkakuNum2Hankaku(value);
      $(e.target).val(hankakuValue);
    });
  }

  deInitialize() {
  }
}
