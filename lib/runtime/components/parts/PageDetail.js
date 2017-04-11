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
        const key = `${this.constructor.name}_${page.getId()}_${lv.getId()}_${i}`;
        if (S(operand).isEmpty()) return <span key={key} />;
        const value = `{{${operand}.answer}}`;
        if (i === 0) {
          return <Value key={key} value={value} />;
        }
        return <span key={key}><Value value={operators.get(i - 1)} /><Value value={value} /></span>;
      }).toArray();

      const key = `${this.constructor.name}_${page.getId()}_${lv.getId()}`;
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

  render() {
    return (
      <div className="page-detail">
        {this.createLogicalVariables()}
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
