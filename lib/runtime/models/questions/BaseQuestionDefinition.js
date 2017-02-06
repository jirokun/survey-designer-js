import { Record, List } from 'immutable';
import ChoiceDefinition from './ChoiceDefinition';

export const BaseQuestionDefinitionRecord = Record({
  id: null,
  type: 'CheckboxQuestion',
  title: '設問タイトル',
  plainTitle: '設問タイトル',
  description: '',
  random: false,    // ランダム
  unit: '',         // 単位
  choices: List().push(new ChoiceDefinition()),
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
  static randomize(choices) {
    const state = choices.map(() => false).toArray();
    const randomChoices = choices.map((choice, i) => {
      if (choice.isRandomFixed()) {
        state[i] = true;
        return choice;
      }
      // 次のindexを探す
      let index = Math.floor(Math.random() * choices.size);
      for (;; index++) {
        if (state.length <= index) {
          // 最大値を超えたら0からやりなおし
          index = -1;
        } else if (choices.get(index).isRandomFixed()) {
          // randomFixedのchoiceは対象外
        } else if (state[index]) {
          // すでに選択済みであればパスする
        } else {
          // 該当のindexを選択する
          state[index] = true;
          return choices.get(index);
        }
      }
    }).toList();
    return randomChoices;
  }

  getId() { return this.get('id'); }
  getType() { return this.get('type'); }
  getTitle() { return this.get('title'); }
  getPlainTitle() { return this.get('plainTitle'); }
  getDescription() { return this.get('description'); }
  isRandom() { return this.get('random'); }
  isShowTotal() { return this.get('showTotal'); }
  getChoices() { return this.get('choices'); }
  getUnit() { return this.get('unit'); }
  getMinCheckCount() { return this.get('minCheckCount'); }
  getMaxCheckCount() { return this.get('maxCheckCount'); }
  getMin() { return this.get('min'); }
  getMax() { return this.get('max'); }
  getTotalEqualTo() { return this.get('totalEqualTo'); }


  /** {$TEXT_INPUT}、ランダムなどの変換済みのchoicesを返す */
  getTransformedChoices() {
    const labelTransformedChoices = this.getChoices().map(choice => choice.parseLabel(this.getId()));
    if (this.isRandom()) {
      return BaseQuestionDefinition.randomize(labelTransformedChoices);
    }
    return labelTransformedChoices;
  }

}
