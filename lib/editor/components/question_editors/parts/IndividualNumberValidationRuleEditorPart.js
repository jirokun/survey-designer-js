/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Glyphicon } from 'react-bootstrap';
import { List } from 'immutable';
import moment from 'moment';
import numbro from 'numbro';
import pikaday from 'pikaday';
import Zeroclipboard from 'zeroclipboard';
import Handsontable from 'handsontable';
import HotTable from 'react-handsontable';
import S from 'string';
import ValueEditorPart from './ValueEditorPart';
import ExSelect from './ExSelect';
import NumberValidationRuleDefinition from '../../../../runtime/models/survey/questions/internal/NumberValidationRuleDefinition';
import * as EditorActions from '../../../actions';
import { COMPARISON_TYPES, OPERATORS } from '../../../../constants/NumberValidationRuleConstants';

/**
 * 数値の入力値制限の詳細を編集するためのフォーム
 *
 * パフォーマンス対策のために、このコンポーネントの中でNumberValidationRuleを編集し、
 * componentWillUnmountのタイミングでReduxのstateの更新を行う。
 */
class IndividualNumberValidationRuleEditorPart extends Component {
  constructor(props) {
    super(props);

    // HotTableのColumn
    this.hotColumns = [
      // 比較値タイプ
      {
        data: 'comparisonType',
        editor: 'select',
        selectOptions: COMPARISON_TYPES,
        renderer: this.objectSelectRenderer.bind(this, COMPARISON_TYPES),
      },
      // 比較値
      {
        data: 'value',
        type: 'numeric',
        allowInvalid: false,
      },
      // 比較方法
      {
        data: 'operator',
        editor: 'select',
        selectOptions: OPERATORS,
        renderer: this.objectSelectRenderer.bind(this, OPERATORS),
      },
    ];

    const { question, outputDefinitionId } = props;
    // 将来的には条件に対してif文を設定できるように拡張予定のため、リストで保持する
    const numberValidationRule = (question.getNumberValidationRuleMap().get(outputDefinitionId) ||
      List([NumberValidationRuleDefinition.create()])).get(0); // 空の場合は空の入れ物を一つ作成
    this.state = { numberValidationRule };
  }

  componentWillUnmount() {
    const { page, question, outputDefinitionId, changeNumberValidationRule } = this.props;
    const { numberValidationRule } = this.state;
    changeNumberValidationRule(page.getId(), question.getId(), outputDefinitionId, numberValidationRule);
  }

  objectSelectRenderer(selectObject, instance, td, row, col, prop, value) {
    td.textContent = selectObject[value] || '';
    return td;
  }

  valueRenderer(instance, td, row, col, prop, value) {
    const { survey } = this.props;

    const visibilityCondition = this.getVisibilityConditionFromRow(row);
    if (visibilityCondition) {
      const od = survey.findOutputDefinition(visibilityCondition.getOutputDefinitionId());
      if (
        !od ||
        (od.getOutputType() !== 'number' && !od.isOutputTypeSingleChoice()) ||
        S(visibilityCondition.getComparisonType()).isEmpty()
      ) {
        td.classList.add('disabled');
      }
    }

    td.textContent = value;
    return td;
  }

  handleChangeValue() {
    if (!this.hotTable) return;
    const instance = this.hotTable.hotInstance;
    const height = 27 + (instance.countRows() * 23);
    instance.updateSettings({ height });
  }

  handleChangeNumberValidationAttribute(validation, attr, value) {
    const { numberValidationRule } = this.state;
    this.setState({ numberValidationRule: numberValidationRule.updateNumberValidationAttribute(validation.getId(), attr, value) });
  }

  handleClickAddValidation() {
    const { numberValidationRule } = this.state;
    this.setState({ numberValidationRule: numberValidationRule.addNumberValidation() });
  }

  handleClickRemoveButton(validation) {
    const { numberValidationRule } = this.state;
    this.setState({ numberValidationRule: numberValidationRule.removeNumberValidation(validation.getId()) });
  }

  createValidationRuleList() {
    const { survey, page, question } = this.props;
    const { numberValidationRule } = this.state;

    const node = survey.findNodeFromRefId(page.getId());

    return (
      <div key={numberValidationRule.getId()} className="validation-rule">
        {
          numberValidationRule.getNumberValidations().map(validation =>
            (
              <div key={validation.getId()} className="individual-number-validation">
                <div>
                  <ValueEditorPart node={node} question={question} value={validation.getValue()} onChange={value => this.handleChangeNumberValidationAttribute(validation, 'value', value)} />
                </div>
                <ExSelect className="form-control" value={validation.getOperator()} onChange={e => this.handleChangeNumberValidationAttribute(validation, 'operator', e.target.value)}>
                  <option />
                  { Object.keys(OPERATORS).map(key => <option key={`${validation.getId()}_${key}`} value={key}>{OPERATORS[key]}</option>) }
                </ExSelect>
                <Glyphicon
                  className="clickable icon-button"
                  glyph="remove-sign"
                  onClick={() => this.handleClickRemoveButton(validation)}
                />
              </div>
            ),
          )
        }
      </div>
    );
  }

  render() {
    const { question, outputDefinitionId } = this.props;
    const numberValidationRule = question.getNumberValidationRuleMap().get(outputDefinitionId) ||
      List([NumberValidationRuleDefinition.create()]); // 空の場合は空の入れ物を一つ作成

    const validationCount = numberValidationRule.flatMap(validationRule => validationRule.getNumberValidations()).size;

    return (
      <div>
        <div><Button bsStyle="primary" onClick={() => this.handleClickAddValidation()} disabled={validationCount >= 10}>条件追加</Button></div>
        <div className="individual-number-validation-container">{this.createValidationRuleList()}</div>
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
const actionsToProps = dispatch => ({
  changeNumberValidationRule: (pageId, questionId, outputDefinitionId, numberValidationRule) =>
    dispatch(EditorActions.changeNumberValidationRule(pageId, questionId, outputDefinitionId, numberValidationRule)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(IndividualNumberValidationRuleEditorPart);
