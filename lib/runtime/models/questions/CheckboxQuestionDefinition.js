import { Record, List } from 'immutable';
import uuid from 'node-uuid';
import ChoiceDefinition from './ChoiceDefinition';

export const CheckboxQuestionDefinitionRecord = Record({
  id: null,
  type: 'CheckboxQuestion',
  title: '設問タイトル',
  plainTitle: '設問タイトル',
  beforeNote: '',
  random: false,
  choices: List().push(new ChoiceDefinition()),
  minCheckCount: 0,
  maxCheckCount: 0,
});

export default class CheckboxQuestionDefinition extends CheckboxQuestionDefinitionRecord {
  static create() {
    return new CheckboxQuestionDefinition({ id: uuid.v4(), type: 'CheckboxQuestion' });
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

  getType() {
    return this.get('type');
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

  isRandom() {
    return this.get('random');
  }

  getChoices() {
    return this.get('choices');
  }

  /** {$TEXT_INPUT}、ランダムなどの変換済みのchoicesを返す */
  getTransformedChoices() {
    const labelTransformedChoices = this.getChoices().map(choice => choice.parseLabel(this.getId()));
    if (this.isRandom()) {
      return CheckboxQuestionDefinition.randomize(labelTransformedChoices);
    }
    return labelTransformedChoices;
  }

  getMinCheckCount() {
    return this.get('minCheckCount');
  }

  getMaxCheckCount() {
    return this.get('maxCheckCount');
  }

  getConstraint() {
    return {
      CheckboxQuestion: {
        minCheckCount: this.getMinCheckCount(),
        maxCheckCount: this.getMaxCheckCount(),
      },
    };
  }
}
