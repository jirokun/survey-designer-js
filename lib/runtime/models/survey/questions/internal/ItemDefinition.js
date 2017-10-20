import cuid from 'cuid';
import { Record, List } from 'immutable';
import S from 'string';
import classNames from 'classnames';
import ChoiceDefinition from './ChoiceDefinition';
import * as ItemVisibility from '../../../../../constants/ItemVisibility';
import { booleanize } from '../../../../../utils';

export const ItemRecord = Record({
  _id: null,                    // ID
  index: -1,                    // 定義順
  devId: null,                  // JavaScriptで指定するためのid
  label: '',                    // HTMLとして評価されるラベル
  plainLabel: '',               // TEXTとして評価されるラベル
  value: '',                    // 値を指定したい場合に指定する
  additionalInput: false,       // 選択肢にテキスト入力を追加する場合true
  additionalInputType: 'text',  // 選択肢にテキスト入力する際の入力タイプ: textまたはnumber
  unit: '',                     // 単位
  randomFixed: false,           // 表示順ランダムで、この項目の配置を固定する場合にtrue
  exclusive: false,             // 排他の項目の場合true
  optional: false,              // 任意入力かどうか
  visibilityCondition: null,    // 表示条件

  totalEqualTo: '',             // 合計値のバリデーション
});

export default class ItemDefinition extends ItemRecord {
  static create(devId, index, value = '', label = '名称未設定') {
    return new ItemDefinition({ _id: cuid(), devId, index, value, label, plainLabel: label });
  }

  getId() {
    return this.get('_id');
  }

  getIndex() {
    return this.get('index');
  }

  getDevId() {
    return this.get('devId');
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

  isOptional() {
    return this.get('optional');
  }

  getVisibilityCondition() {
    return this.get('visibilityCondition');
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
      value: `${this.getIndex() + 1}`,
    });
  }

  getTotalEqualTo() {
    return this.get('totalEqualTo');
  }

  /** visibilityConditionを評価した結果を返す */
  matchesVisibilityCondition(survey, answers) {
    const visibilityCondition = this.getVisibilityCondition();
    if (!visibilityCondition) return true; // 設定されていない場合は無条件で表示

    const outputDefinition = survey.findOutputDefinition(visibilityCondition.getOutputDefinitionId());
    if (!outputDefinition) return true; // すでに削除されているoutputDefinitionの場合。設定されていないとみなしtrueを返す
    const op = visibilityCondition.getOperator();

    let answerValue = answers.get(outputDefinition.getName());
    if (!S(answerValue).isEmpty()) answerValue = answerValue.toString(); // 必ず文字列として比較するようにする

    const replacer = survey.getReplacer();
    const value = replacer.id2Value(visibilityCondition.getValue());

    // TODO: BranchDefinitionのcreateEvaluateChildConditionClosureとほぼおなじ実装だが
    // !!と!の扱いが異なる。こちらの方が扱いやすいので、将来的に分岐条件のエディタもItemVisibilityEditorPartと
    // 共通化する。
    switch (op) {
      case '!!':
        return booleanize(answerValue).toString() === 'true';
      case '!':
        return booleanize(answerValue).toString() === 'false';
      case '==':
        return answerValue === value;
      case '!=':
        return answerValue !== value;
      case '>=':
        return parseFloat(answerValue) >= parseFloat(value);
      case '<=':
        return parseFloat(answerValue) <= parseFloat(value);
      case '>':
        return parseFloat(answerValue) > parseFloat(value);
      case '<':
        return parseFloat(answerValue) < parseFloat(value);
      case null:
        return true; // まだ定義されていない状態。edit時に発生する
      default:
        throw new Error(`未定義のoperatorです。operator: ${op}`);
    }
  }

  /** matchesVisibilityConditionの結果をもとに設定するclassを返す */
  calcVisibilityClassName(survey, answers) {
    const visibilityCondition = this.getVisibilityCondition();
    // 設定されていない場合はshow
    if (!visibilityCondition) {
      return ItemVisibility.CLASS_NAME_SHOW;
    }
    const visibilityType = visibilityCondition.getVisibilityType();
    if (this.matchesVisibilityCondition(survey, answers)) {
      switch (visibilityType) {
        case ItemVisibility.HIDE:
          return ItemVisibility.CLASS_NAME_HIDDEN;
        case ItemVisibility.SHOW:
          return ItemVisibility.CLASS_NAME_SHOW;
        default:
          return ItemVisibility.CLASS_NAME_SHOW;
      }
    } else {
      switch (visibilityType) {
        case ItemVisibility.HIDE:
          return ItemVisibility.CLASS_NAME_SHOW;
        case ItemVisibility.SHOW:
          return ItemVisibility.CLASS_NAME_HIDDEN;
        default:
          return ItemVisibility.CLASS_NAME_SHOW;
      }
    }
  }

  validate(survey, node, page, question) {
    if (this.getVisibilityCondition() === null) return List();
    return this.getVisibilityCondition().validate(survey, node, page, question, this);
  }
}
