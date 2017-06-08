import { Record, List } from 'immutable';
import cuid from 'cuid';
import S from 'string';
import * as ItemVisibility from '../../../../../constants/ItemVisibility';
import Replacer from '../../../../../Replacer';

/** ItemのVisibilityを定義するクラス */
export const VisibilityConditionDefinitionRecord = Record({
  _id: null,                // 内部で使用するID
  outputDefinitionId: null, // 参照するOutputDefinitionのID
  comparisonType: null,     // 比較方法, fixedValueまたはanswerValue
  value: null,              // 比較する値
  operator: null,           // 対応する値
  visibilityType: ItemVisibility.HIDE,     // 条件が真のときにどのような動作をするか。show, hide の2つがある
});

export default class VisibilityConditionDefinition extends VisibilityConditionDefinitionRecord {
  static create() {
    return new VisibilityConditionDefinition({ _id: cuid() });
  }

  /** outputDefinitionに対応するOperatorと文言のmapを返す */
  static findOperatorSelectOptions(outputDefinition) {
    if (!outputDefinition) return {};
    switch (outputDefinition.getOutputType()) {
      case 'checkbox':
        return {
          '!!': 'を選択している場合',
          '!': 'を選択していない場合',
        };
      case 'select':
      case 'radio':
        return {
          '==': 'を選択している場合',
          '!=': 'を選択していない場合',
        };
      default:
        return {
          '==': 'と等しい場合',
          '!=': 'と等しくない場合',
          '>': 'より大きい場合',
          '<': 'より小さい場合',
          '>=': '以上の場合',
          '<=': '以下の場合',
        };
    }
  }

  getId() {
    return this.get('_id');
  }

  getOutputDefinitionId() {
    return this.get('outputDefinitionId');
  }

  getComparisonType() {
    return this.get('comparisonType');
  }

  getValue() {
    return this.get('value');
  }

  getOperator() {
    return this.get('operator');
  }

  getVisibilityType() {
    return this.get('visibilityType');
  }

  /** valueMapを基に値を更新する */
  updateProperties(survey, outputDefinitions, valueMap) {
    let newState = this;
    if (!valueMap) return null;
    Object.keys(valueMap).forEach((key) => {
      newState = newState.set(key, valueMap[key]);
    });
    if (S(newState.getOutputDefinitionId()).isEmpty()) {
      return null;
    }
    const outputDefinition = outputDefinitions.find(od => od.getId() === newState.getOutputDefinitionId());
    // 存在しないOutputDefinitionならクリアする
    if (!outputDefinition) return null;

    // 指定できない比較値タイプが設定されていた場合は比較値タイプが空になる
    const outputType = outputDefinition.getOutputType();
    let comparisonType = newState.getComparisonType();
    if ((['checkbox', 'radio', 'select'].includes(outputType)) && !S(comparisonType).isEmpty()) {
      comparisonType = null;
      newState = newState.set('comparisonType', comparisonType);
    }

    // fixedValueとanswerValueしか設定できない
    if (!S(comparisonType).isEmpty() && !['fixedValue', 'answerValue'].includes(comparisonType)) {
      comparisonType = null;
      newState = newState.set('comparisonType', comparisonType);
    }

    // outputTypeがsingleChoiceではなくcomparisonTypeが空の場合はvalueも空にする
    let value = newState.getValue();
    if (!outputDefinition.isOutputTypeSingleChoice() && S(comparisonType).isEmpty()) {
      value = null;
      newState = newState.set('value', value);
    }

    // comparisonTypeがfixedValueの場合、数値以外の値がvalueに設定されていたら空にする
    if (comparisonType === 'fixedValue' && !S(value).isNumeric()) {
      value = null;
      newState = newState.set('value', value);
    }

    // comparisonTypeがanswerValueかつvalueに存在しない参照値が入力された場合入力値が空にする
    if (outputDefinition.isOutputTypeSingleChoice() || comparisonType === 'answerValue') {
      const replacer = survey.getReplacer();
      const id = Replacer.extractIdFrom(value);
      if (S(id).isEmpty() || !replacer.validate(value, outputDefinitions)) {
        // もし存在しないidならvalueを空にする
        value = null;
        newState = newState.set('value', value);
      }
    }

    // 指定できないoperatorが設定されていた場合はoperatorが空になる
    let operator = newState.getOperator();
    if (
      (outputType === 'checkbox' && !['!!', '!'].includes(operator)) ||
      (outputDefinition.isOutputTypeSingleChoice() && !['==', '!='].includes(operator)) ||
      (outputType === 'number' && !['==', '!=', '<', '<=', '>', '>='].includes(operator))
    ) {
      operator = null;
      newState = newState.set('operator', operator);
    }

    return newState;
  }

  validate(survey, node, page, question, item) {
    let errors = List();
    const location = '表示条件で';
    const outputDefinitionId = this.getOutputDefinitionId();
    const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId(), false);
    const outputDefinition = outputDefinitions.find(od => od.getId() === outputDefinitionId);
    if (!outputDefinition) {
      errors = errors.push(`${location}条件設問の値が不正です`);
      return errors;
    }

    const outputType = outputDefinition.getOutputType();
    const comparisonType = this.getComparisonType();
    const value = this.getValue();
    if (outputType === 'number' && S(comparisonType).isEmpty()) errors = errors.push(`${location}比較値タイプが不正です`);
    if (comparisonType === 'fixedValue' && !S(value).isNumeric()) {
      errors = errors.push(`${location}比較値が不正です`);
    } else if ((outputType === 'number' && comparisonType === 'answerValue') || outputDefinition.isOutputTypeSingleChoice()) {
      const replacer = survey.getReplacer();
      const id = Replacer.extractIdFrom(value);
      if (S(id).isEmpty() || !replacer.validate(value, outputDefinitions)) {
        errors = errors.push(`${location}比較値が不正です`);
      }
    }
    if (S(this.getOperator()).isEmpty()) errors = errors.push(`${location}比較方法が不正です`);
    if (S(this.getVisibilityType()).isEmpty()) errors = errors.push(`${location}動作種別が不正です`);
    return errors;
  }
}
