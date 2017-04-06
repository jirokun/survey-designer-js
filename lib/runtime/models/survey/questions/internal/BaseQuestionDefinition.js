import { Record, List } from 'immutable';
import ItemDefinition from './ItemDefinition';

export const BaseQuestionDefinitionRecord = Record({
  _id: null,
  dataType: 'Checkbox',                            // 設問のタイプ
  title: '設問タイトル',                             // タイトル
  plainTitle: '設問タイトル',                        // タイトル。HTMLではなくプレーンなテキスト。
  description: '',                                 // 補足
  random: false,                                   // ランダム
  subItemsRandom: false,                           // subItemsをランダム
  unit: '',                                        // 単位
  items: List().push(ItemDefinition.create(0)),    // アイテムのリスト
  subItems: List().push(ItemDefinition.create(0)), // サブアイテムのリスト
  showTotal: false,                                // 合計を表示するかどうか
  matrixType: null,                                // MatrixQuestionの入力項目のタイプを指定するradio, checkbox, text, numberが使用可能
  matrixReverse: false,                            // MatrixQuestionの行と列を入れ替えるかどうか
  matrixSumRows: false,                            // Matrixの列合計を表示するか
  matrixSumCols: false,                            // Matrixの行合計を表示するか

  // バリデーション系
  totalEqualTo: '',                              // 合計値がここに設定した値になるよう制限する
  minCheckCount: 1,                              // チェックボックスの最低選択数
  maxCheckCount: 0,                              // チェックボックスの最大選択数
  min: '',                                       // 最小値
  max: '',                                       // 最大値
});

export default class BaseQuestionDefinition extends BaseQuestionDefinitionRecord {
  /** outputNoを生成する */
  static createOutputNo(...args) {
    return args.join('-');
  }

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

  getId() { return this.get('_id'); }
  getDataType() { return this.get('dataType'); }
  getTitle() { return this.get('title'); }
  getPlainTitle() { return this.get('plainTitle'); }
  getDescription() { return this.get('description'); }
  isRandom() { return this.get('random'); }
  isSubItemsRandom() { return this.get('subItemsRandom'); }
  isShowTotal() { return this.get('showTotal'); }
  getItems() { return this.get('items'); }
  getSubItems() { return this.get('subItems'); }
  getMatrixType() { return this.get('matrixType'); }
  isMatrixReverse() { return this.get('matrixReverse'); }
  isMatrixSumRows() { return this.get('matrixSumRows'); }
  isMatrixSumCols() { return this.get('matrixSumCols'); }
  getUnit() { return this.get('unit'); }
  getMinCheckCount() { return this.get('minCheckCount'); }
  getMaxCheckCount() { return this.get('maxCheckCount'); }
  getMin() { return this.get('min'); }
  getMax() { return this.get('max'); }
  getTotalEqualTo() { return this.get('totalEqualTo'); }


  /** ランダムなどの変換済みのitemsを返す */
  getTransformedItems() {
    const items = this.getItems();
    if (this.isRandom()) {
      return BaseQuestionDefinition.randomize(items);
    }
    return items;
  }

  /** ランダムなどの変換済みのitemsを返す */
  getTransformedSubItems() {
    const items = this.getSubItems();
    if (this.isSubItemsRandom()) {
      return BaseQuestionDefinition.randomize(items);
    }
    return items;
  }

  /** indexの値を更新する */
  fixItemIndex() {
    return this.set('items', this.getItems().map((item, i) =>
      item
        .set('index', i)
        .set('value', `value${i + 1}`),
    ).toList());
  }

  /** subIndexの値を更新する */
  fixSubItemIndex() {
    return this.set('subItems', this.getSubItems().map((item, i) =>
      item
        .set('index', i)
        .set('value', `value${i + 1}`),
    ).toList());
  }

  /** 設問が出力する項目の一覧を返す */
  getOutputDefinitions(pageNo, questionNo) {
    return List();
  }

  /** 正しく設定されているかチェックする */
  validate(survey) {
    let errors = List();
    const replacer = survey.getReplacer();
    if (!replacer.validate(this.getTitle())) errors = errors.push('タイトルで存在しない参照があります');
    if (!replacer.validate(this.getDescription())) errors = errors.push('補足で存在しない参照があります');
    if (!replacer.validate(this.getUnit())) errors = errors.push('単位で存在しない参照があります');
    if (!replacer.validate(this.getMin())) errors = errors.push('最小値で存在しない参照があります');
    if (!replacer.validate(this.getMax())) errors = errors.push('最大値で存在しない参照があります');
    if (!replacer.validate(this.getTotalEqualTo())) errors = errors.push('合計値で存在しない参照があります');
    return errors;
  }
}
