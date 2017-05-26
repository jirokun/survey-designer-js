/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Value from './Value';
import CheckboxQuestionDefinition from '../../models/survey/questions/CheckboxQuestionDefinition';
import RadioQuestionDefinition from '../../models/survey/questions/RadioQuestionDefinition';
import MultiNumberQuestionDefinition from '../../models/survey/questions/MultiNumberQuestionDefinition';
import MatrixQuestionDefinition from '../../models/survey/questions/MatrixQuestionDefinition';
import VisibilityConditionDefinition from '../../models/survey/questions/internal/VisibilityConditionDefinition';
import * as ItemVisibility from '../../../constants/ItemVisibility';

/** プレビューのためのコンテナ */
class QuestionDetail extends Component {
  createOptions() {
    const { question, random, subItemsRandom, matrixReverse } = this.props;
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
          </tbody>
        </table>
      </div>
    );
  }

  createValidations() {
    const { question, min, max, totalEqualTo, minCheckCount, maxCheckCount } = this.props;
    if (!(min || max || totalEqualTo || minCheckCount || maxCheckCount)) return null;
    return (
      <div className="validation">
        入力値制限
        <table>
          <tbody>
            {
              min ?
                <tr>
                  <th>最小値</th>
                  <td><Value value={question.getMin()} /></td>
                </tr> : null
            }
            {
              max ?
                <tr>
                  <th>最大値</th>
                  <td><Value value={question.getMax()} /></td>
                </tr> : null
            }
            {
              totalEqualTo ?
                <tr>
                  <td>合計値</td>
                  <td><Value value={question.getTotalEqualTo()} /></td>
                </tr> : null
            }
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

  createItemVisibilityRow(item) {
    const { survey } = this.props;
    const vc = item.getVisibilityCondition();
    const od = survey.findOutputDefinition(vc.getOutputDefinitionId());
    const comparisonType = ItemVisibility.COMPARISON_TYPE_OPTIONS[vc.getComparisonType()];
    const replacer = survey.getReplacer();
    const value = od.getOutputType() === 'radio' || vc.getComparisonType() === 'answerValue' ? replacer.findReferenceLabelIn(vc.getValue()) : vc.getValue();
    const operator = VisibilityConditionDefinition.findOperatorSelectOptions(od)[vc.getOperator()];
    const visibilityType = ItemVisibility.VISIBLITY_TYPE_OPTIONS[vc.getVisibilityType()];
    return (
      <tr>
        <td>{item.getIndex() + 1}</td>
        <td>{item.getLabel()}</td>
        <td>{od.getLabelForCondition(true)}</td>
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
      return <div className={className}>{this.createItemVisibilitiesTable('選択肢', this.filterItems(question.getItems()))}</div>;
    } else if (question instanceof MultiNumberQuestionDefinition) {
      return <div className={className}>{this.createItemVisibilitiesTable('項目', this.filterItems(question.getItems()))}</div>;
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
        {this.createOptions()}
        {this.createValidations()}
        {this.createItemVisibilities()}
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});

export default connect(
  stateToProps,
)(QuestionDetail);
