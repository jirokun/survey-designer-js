import { Record, List } from 'immutable';
import uuid from 'node-uuid';
import ChoiceDefinition from './ChoiceDefinition';

export const QuestionDefinitionRecord = Record({
  id: null,
  type: 'checkbox',
  title: '設問タイトル',
  plainTitle: '設問タイトル',
  beforeNote: '',
  direction: 'vertical',
  vertical: false,
  random: false,
  choices: List().push(new ChoiceDefinition()),
  checkMinCount: 0,
  checkMaxCount: 0,
  validations: List(),
});

export default class QuestionDefinition extends QuestionDefinitionRecord {
  static create() {
    return new QuestionDefinition({ id: uuid.v1() });
  }

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

  getId() {
    return this.get('id');
  }

  getTitle() {
    return this.get('title');
  }

  getPlainTitle() {
    return this.get('plainTitle');
  }

  getBeforeNote() {
    return this.get('beforeNote');
  }

  getDirection() {
    return this.get('direction');
  }

  isRandom() {
    return this.get('random');
  }

  getChoices() {
    return this.get('choices');
  }

  /** {$TEXT_INPUT}、ランダムなどの変換済みのchoicesを返す */
  getTransformedChoices() {
    const labelTransformedChoices = this.getChoices().map((choice, index) =>
      choice.set('label', ChoiceDefinition.transformLabel(this.getId(), index, choice.getLabel())));
    if (this.isRandom()) {
      return QuestionDefinition.randomize(labelTransformedChoices);
    }
    return labelTransformedChoices;
  }

  getCheckMinCount() {
    return this.get('checkMinCount');
  }

  getCheckMaxCount() {
    return this.get('checkMaxCount');
  }

  getValidations() {
    return this.get('validations');
  }
}
