import cuid from 'cuid';
import { Record } from 'immutable';
import ChoiceDefinition from './ChoiceDefinition';

export const ItemRecord = Record({
  _id: null,                    // ID
  index: -1,                    // 定義順
  label: '',                    // HTMLとして評価されるラベル
  plainLabel: '',               // TEXTとして評価されるラベル
  value: '',                    // 値を指定したい場合に指定する
  additionalInput: false,       // 選択肢にテキスト入力を追加する場合true
  additionalInputType: 'text',  // 選択肢にテキスト入力する際の入力タイプ: textまたはnumber
  unit: '',                     // 単位
  randomFixed: false,           // 表示順ランダムで、この項目の配置を固定する場合にtrue
  exclusive: false,             // 排他の項目の場合true

  totalEqualTo: '',             // 合計値のバリデーション
});

export default class ItemDefinition extends ItemRecord {
  static create(index, value = '') {
    return new ItemDefinition({ _id: cuid(), index, value });
  }

  getId() {
    return this.get('_id');
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

  hasAdditionalInput() {
    return this.get('additionalInput');
  }

  isRandomFixed() {
    return this.get('randomFixed');
  }

  isExclusive() {
    return this.get('exclusive');
  }

  getAdditionalInputType() {
    return this.get('additionalInputType');
  }

  getUnit() {
    return this.get('unit');
  }

  getMinCheckCount() {
    return this.get('minCheckCount');
  }

  getMaxCheckCount() {
    return this.get('maxCheckCount');
  }

  getChoiceDefinition() {
    return new ChoiceDefinition({
      _id: this.getId(),
      label: this.getPlainLabel(),
      value: `value${this.getIndex() + 1}`,
    });
  }

  getTotalEqualTo() {
    return this.get('totalEqualTo');
  }
}
