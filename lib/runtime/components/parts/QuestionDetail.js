/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import S from 'string';
import CheckboxQuestionDefinition from '../../models/survey/questions/CheckboxQuestionDefinition';
import RadioQuestionDefinition from '../../models/survey/questions/RadioQuestionDefinition';
import MultiNumberQuestionDefinition from '../../models/survey/questions/MultiNumberQuestionDefinition';
import MatrixQuestionDefinition from '../../models/survey/questions/MatrixQuestionDefinition';
import VisibilityConditionDefinition from '../../models/survey/questions/internal/VisibilityConditionDefinition';
import * as ItemVisibility from '../../../constants/ItemVisibility';
import { OPERATORS } from '../../../constants/NumberValidationRuleConstants';

/** プレビューのためのコンテナ */
export default class QuestionDetail extends Component {
  componentDidMount() {
    const $rootEl = $(ReactDOM.findDOMNode(this));
    if (!S($rootEl.text()).isEmpty()) return;
    // hideしておかないと、枠が表示されてしまうため
    // 何も出力されない場合は表示しない
    $rootEl.hide();
  }

  createOptions() {
    const { question, random, subItemsRandom, matrixReverse, matrixHtml } = this.props;

    if (!random && !subItemsRandom && !matrixReverse && !matrixHtml) return null;

    return (
      <div className="display-control">
        表示制御
        <table>
          <tbody>
            {
              random ?
                <tr>
                  <th>{random === true ? 'ランダム' : random}</th>
                  <td>{question.isRandom() ? '◯' : null}</td>
                </tr> : null
            }
            {
              subItemsRandom ?
                <tr>
                  <th>列ランダム</th>
                  <td>{question.isSubItemsRandom() ? '◯' : null}</td>
                </tr> : null
            }
            {
              matrixReverse ?
                <tr>
                  <th>列でグルーピング</th>
                  <td>{question.isMatrixReverse() ? '◯' : null}</td>
                </tr> : null
            }
            {
              matrixHtml ?
                <tr>
                  <th>テーブルのカスタマイズ</th>
                  <td>{question.isMatrixHtmlEnabled() ? '◯' : null}</td>
                </tr> : null
            }
          </tbody>
        </table>
      </div>
    );
  }

  createNumberValidations() {
    const { survey, question } = this.props;

    const replacer = survey.getReplacer();
    const uniquedNumberValidationRules = question.getUniquedNumberValidationRules();

    if (uniquedNumberValidationRules.size === 0) return null;

    const tableRows = uniquedNumberValidationRules.map((numberValidationRule) => {
      const numberValidations = numberValidationRule.getNumberValidations();
      return numberValidations.map((numberValidation, index) => {
        const isReference = replacer.containsReferenceIdIn(numberValidation.getValue());
        const valueType = isReference ? '回答値' : '固定値';
        const value = isReference ? replacer.findReferenceLabelIn(numberValidation.getValue()) : numberValidation.getValue();
        const operatorLabel = OPERATORS[numberValidation.getOperator()];

        return (
          <tr>
            {index === 0 ? <th rowSpan={numberValidations.size}>数値制限{numberValidationRule.getValidationTypeInQuestion()}</th> : null}
            <td>{valueType}</td>
            <td>{value}</td>
            <td>{operatorLabel}</td>
          </tr>
        );
      });
    }).toArray();
    return (
      <div>
        数値制限
        <table>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }

  createCheckCountValidations() {
    const { question, minCheckCount, maxCheckCount } = this.props;
    if (!minCheckCount && !maxCheckCount) return null;

    return (
      <div className="check-count-validations">
        チェック数制限
        <table>
          <tbody>
            {
              minCheckCount ?
                <tr>
                  <th>最低選択数</th>
                  <td>{question.getMinCheckCount()}</td>
                </tr> : null
            }
            {
              maxCheckCount ?
                <tr>
                  <th>最大選択数</th>
                  <td>{question.getMaxCheckCount()}</td>
                </tr> : null
            }
          </tbody>
        </table>
      </div>
    );
  }


  createValidations() {
    const { minCheckCount, maxCheckCount } = this.props;
    if (!(minCheckCount || maxCheckCount)) return null;
    return (
      <div className="validation">
        {this.createCheckCountValidations()}
        {this.createNumberValidations()}
      </div>
    );
  }

  createItemVisibilityRow(item) {
    const { survey } = this.props;
    const vc = item.getVisibilityCondition();
    const od = survey.findOutputDefinition(vc.getOutputDefinitionId());
    const comparisonType = ItemVisibility.COMPARISON_TYPE_OPTIONS[vc.getComparisonType()];
    const replacer = survey.getReplacer();
    const value = (od && od.isOutputTypeSingleChoice()) || vc.getComparisonType() === 'answerValue' ? replacer.findReferenceLabelIn(vc.getValue()) : vc.getValue();
    const operator = VisibilityConditionDefinition.findOperatorSelectOptions(od)[vc.getOperator()];
    const visibilityType = ItemVisibility.VISIBLITY_TYPE_OPTIONS[vc.getVisibilityType()];
    return (
      <tr>
        <td>{item.getIndex() + 1}</td>
        <td>{item.getLabel()}</td>
        <td>{od ? od.getLabelForCondition(true) : '不正な参照です'}</td>
        <td>{comparisonType}</td>
        <td>{value}</td>
        <td>{operator}</td>
        <td>{visibilityType}</td>
      </tr>
    );
  }

  /** Itemの表示条件を表示する */
  createItemVisibilitiesTable(itemLabel, items) {
    if (items.size === 0) return null;

    return (
      <div>
        {itemLabel}の動的な表示・非表示制御
        <table>
          <thead>
            <tr>
              <th>{itemLabel}番号</th>
              <th>対象選択肢</th>
              <th>条件設問</th>
              <th>比較値タイプ</th>
              <th>比較値</th>
              <th>比較方法</th>
              <th>動作種別</th>
            </tr>
          </thead>
          <tbody>
            { items.map(item => this.createItemVisibilityRow(item))}
          </tbody>
        </table>
      </div>
    );
  }

  createItemVisibilities() {
    const { question } = this.props;

    const className = 'item-visibilities';
    if (question instanceof CheckboxQuestionDefinition || question instanceof RadioQuestionDefinition) {
      const tableEl = this.createItemVisibilitiesTable('選択肢', this.filterItems(question.getItems()));
      if (tableEl === null) return null;
      return <div className={className}>{tableEl}</div>;
    } else if (question instanceof MultiNumberQuestionDefinition) {
      const tableEl = this.createItemVisibilitiesTable('項目', this.filterItems(question.getItems()));
      if (tableEl === null) return null;
      return <div className={className}>{tableEl}</div>;
    } else if (question instanceof MatrixQuestionDefinition) {
      return (
        <div className={className}>
          {this.createItemVisibilitiesTable('行', this.filterItems(question.getItems()))}
          {this.createItemVisibilitiesTable('列', this.filterItems(question.getSubItems()))}
        </div>
      );
    }
    return null;
  }

  filterItems(items) {
    return items.filter(item => !!item.getVisibilityCondition());
  }

  render() {
    return (
      <div className="question-detail">
        <div>
          {this.createOptions()}
          {this.createCheckCountValidations()}
        </div>
        <div>{this.createNumberValidations()}</div>
        <div>{this.createItemVisibilities()}</div>
      </div>
    );
  }
}
