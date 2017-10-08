/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import S from 'string';
import Value from './Value';

class PageDetail extends Component {
  createLogicalVariables() {
    const { survey, page } = this.props;
    const logicalVariables = page.getLogicalVariables();
    if (logicalVariables.size === 0) return null;

    const details = logicalVariables.map((lv) => {
      const variableName = survey.calcLogicalVariableNo(page.getId(), lv.getId());
      const operands = lv.getOperands();
      const operators = lv.getOperators();
      const logicalVariableDetail = operands.map((operand, i) => {
        const key = `PageDetail_${page.getId()}_${lv.getId()}_${i}`;
        if (S(operand).isEmpty()) return <span key={key} />;
        const value = `{{${operand}.answer}}`;
        if (i === 0) {
          return <Value key={key} value={value} />;
        }
        return <span key={key}><Value value={operators.get(i - 1)} /><Value value={value} /></span>;
      }).toArray();

      const key = `PageDetail_${page.getId()}_${lv.getId()}`;
      return <tr key={key}><td>{variableName}</td><td>{logicalVariableDetail}</td></tr>;
    });

    return (
      <div>
        ロジック変数
        <table>
          <thead>
            <tr><th>変数名</th><th>定義</th></tr>
          </thead>
          <tbody>
            {details}
          </tbody>
        </table>
      </div>
    );
  }

  createPageSettings() {
    const { page } = this.props;
    let zeroSetting;
    if (page.getZeroSetting() === null) zeroSetting = '全体設定に従う';
    if (page.getZeroSetting() === true) zeroSetting = '有効';
    if (page.getZeroSetting() === false) zeroSetting = '無効';
    return (
      <div>
        ページオプション
        <table>
          <tr><th>フリーモード</th><td>{page.isFreeMode() ? '◯' : ''}</td></tr>
          <tr><th>ゼロ埋め</th><td>{zeroSetting}</td></tr>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div className="page-detail">
        <h3>ページ設定</h3>
        <div className="page-settings">
          {this.createPageSettings()}
          {this.createLogicalVariables()}
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});

export default connect(
  stateToProps,
)(PageDetail);
