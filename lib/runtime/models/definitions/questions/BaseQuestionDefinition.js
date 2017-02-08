import { Record, List } from 'immutable';
import ItemDefinition from './ItemDefinition';

export const BaseQuestionDefinitionRecord = Record({
  id: null,
  type: 'CheckboxQuestion',
  title: '設問タイトル',
  plainTitle: '設問タイトル',
  description: '',
  random: false,    // ランダム
  unit: '',         // 単位
  items: List().push(new ItemDefinition()),
  showTotal: false,
  // バリデーション系
  totalEqualTo: null,
  minCheckCount: 0, // チェックボックスの最低選択数
  maxCheckCount: 0, // チェックボックスの最大選択数
  min: null,        // 最小値
  max: null,        // 最大値
});

export default class BaseQuestionDefinition extends BaseQuestionDefinitionRecord {
  /** ランダム配置する */
  static randomize(items) {
    const state = items.map(() => false).toArray();
    const randomItems = items.map((item, i) => {
      if (item.isRandomFixed()) {
        state[i] = true;
        return item;
      }
      // 次のindexを探す
      let index = Math.floor(Math.random() * items.size);
      for (;; index++) {
        if (state.length <= index) {
          // 最大値を超えたら0からやりなおし
          index = -1;
        } else if (items.get(index).isRandomFixed()) {
          // randomFixedのitemは対象外
        } else if (state[index]) {
          // すでに選択済みであればパスする
        } else {
          // 該当のindexを選択する
          state[index] = true;
          return items.get(index);
        }
      }
    }).toList();
    return randomItems;
  }

  getId() { return this.get('id'); }
  getType() { return this.get('type'); }
  getTitle() { return this.get('title'); }
  getPlainTitle() { return this.get('plainTitle'); }
  getDescription() { return this.get('description'); }
  isRandom() { return this.get('random'); }
  isShowTotal() { return this.get('showTotal'); }
  getItems() { return this.get('items'); }
  getUnit() { return this.get('unit'); }
  getMinCheckCount() { return this.get('minCheckCount'); }
  getMaxCheckCount() { return this.get('maxCheckCount'); }
  getMin() { return this.get('min'); }
  getMax() { return this.get('max'); }
  getTotalEqualTo() { return this.get('totalEqualTo'); }


  /** {$TEXT_INPUT}、ランダムなどの変換済みのitemsを返す */
  getTransformedItems() {
    const labelTransformedItems = this.getItems().map(item => item.parseLabel(this.getId()));
    if (this.isRandom()) {
      return BaseQuestionDefinition.randomize(labelTransformedItems);
    }
    return labelTransformedItems;
  }

  /** indexの値を更新する */
  fixItemIndex() {
    return this.getItems().map((item, i) => item.set('index', i)).toList();
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions() {
    return List();
  }
}
