/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import numbro from 'numbro';
import pikaday from 'pikaday';
import Zeroclipboard from 'zeroclipboard';
import Handsontable from 'handsontable';
import HotTable from 'react-handsontable';
import S from 'string';
import 'handsontable/dist/handsontable.full.css';
import Replacer from '../../../../Replacer';
import * as EditorActions from '../../../actions';
import * as ItemVisibility from '../../../../constants/ItemVisibility';

class ItemVisibilityEditorPart extends Component {
  constructor(props) {
    super(props);

    // HotTableのColumn
    this.hotColumns = [
      { data: 'label', readOnly: true },
      {
        data: 'outputDefinitionId',
        editor: 'select',
        selectOptions: this.outputDefinitionIdSelectOptions.bind(this),
        renderer: this.outputDefinitionIdRenderer.bind(this),
      },
      {
        data: 'comparisonType',
        editor: 'select',
        selectOptions: this.comparisonTypeSelectOptions.bind(this),
        renderer: this.comparisonTypeRenderer.bind(this),
      },
      {
        data: 'value',
        // selectOptions, editorがoutputDefinition.outputTypeによって変わるのでcellsで対応している
        renderer: this.valueRenderer.bind(this),
      },
      {
        data: 'operator',
        editor: 'select',
        selectOptions: this.operatorSelectOptions.bind(this),
        renderer: this.operatorRenderer.bind(this),
      },
      {
        data: 'visibilityType',
        editor: 'select',
        selectOptions: this.visibilityTypeSelectOptions.bind(this),
        renderer: this.visiblityTypeRenderer.bind(this),
      },
    ];
  }

  shouldComponentUpdate(nextProps) {
    // パフォーマンス対応
    return nextProps.items !== this.props.items;
  }

  handleChangeValue(changes, source) {
    const { question, subItem, changeItemVisibilityConditions, changeSubItemVisibilityConditions } = this.props;
    // loadDataのときは何もしない
    if (source === 'loadData') return;

    const { items } = this.props;

    const valueObj = {};
    const declaredDatKeys = this.hotColumns.map(column => column.data);

    changes.forEach((change) => {
      const row = change[0];
      const prop = change[1];
      const oldVal = change[2];
      const newVal = change[3];
      const item = items.get(row);
      if (oldVal === newVal) return;
      if (!declaredDatKeys.includes(prop)) return;
      valueObj[item.getId()] = valueObj[item.getId()] || {};
      valueObj[item.getId()][prop] = typeof newVal === 'number' ? `${newVal}` : newVal;
    });

    if (subItem === true) {
      changeSubItemVisibilityConditions(question.getId(), valueObj);
    } else {
      changeItemVisibilityConditions(question.getId(), valueObj);
    }
    this.forceUpdate();
  }

  /**
   * 行番号からOutputDefinitionを取得する
   * そもそもvisibilityConditionが設定されていない場合はnullを返す
   */
  findVisibilityConditionFromRow(row) {
    const { items } = this.props;
    const item = items.get(row);
    return item.getVisibilityCondition();
  }

  /**
   * 行番号からOutputDefinitionを取得する
   * そもそもvisibilityConditionが設定されていない場合はnullを返す
   */
  findOutputDefinitionFromRow(row) {
    const visibilityCondition = this.findVisibilityConditionFromRow(row);
    if (!visibilityCondition) return null;
    const { survey } = this.props;
    return survey.findOutputDefinition(visibilityCondition.getOutputDefinitionId());
  }

  cells(row, col, prop) {
    const emptyCellProperties = {};
    if (prop === 'value') {
      // valueだけはエディタが変更となるので、cellsでカスケードする
      const outputDefinition = this.findOutputDefinitionFromRow(row);
      if (!outputDefinition) return emptyCellProperties;

      const outputType = outputDefinition.getOutputType();

      if (outputType === 'number') {
        const visibilityCondition = this.findVisibilityConditionFromRow(row);
        const comparisonType = visibilityCondition.getComparisonType();
        if (comparisonType === 'answerValue') {
          return {
            editor: 'select',
            selectOptions: this.referenceSelectOptions(),
            renderer: this.referenceRenderer.bind(this),
          };
        } else if (comparisonType === 'fixedValue') {
          return { type: 'numeric' };
        }
      } else if (outputType === 'radio') {
        return {
          editor: 'select',
          selectOptions: this.radioSelectOptions(outputDefinition),
          renderer: this.choiceReferenceRenderer.bind(this),
        };
      }
    }
    return emptyCellProperties;
  }

  cellComparisonType(outputDefinition) {
    const cellProperties = {};
    if (!outputDefinition) return cellProperties;
    switch (outputDefinition.getOutputType()) {
      case 'number':
        cellProperties.selectOptions = ItemVisibility.COMPARISON_TYPE_OPTIONS;
        return cellProperties;
      default:
        cellProperties.selectOptions = {};
        return cellProperties;
    }
  }

  cellOperator(outputDefinition) {
    const cellProperties = {};
    if (!outputDefinition) return cellProperties;
    switch (outputDefinition.getOutputType()) {
      case 'checkbox':
        cellProperties.selectOptions = {
          '!!': 'を選択している',
          '!': 'を選択していない',
        };
        break;
      case 'radio':
        cellProperties.selectOptions = {
          '!!': 'を選択している',
          '!': 'を選択していない',
        };
        break;
      default:
        cellProperties.selectOptions = {
          '==': 'と等しい場合',
          '!=': 'と等しくない場合',
          '>': 'より大きい場合',
          '<': 'より小さい場合',
          '>=': '以上の場合',
          '<=': '以下の場合',
        };
    }
    return cellProperties;
  }

  referenceRenderer(instance, td, row, col, prop, value) {
    const { survey } = this.props;
    if (!value) {
      td.textContent = '';
      return td;
    }
    const outputDefinitionId = Replacer.extractIdFrom(value);
    const od = survey.findOutputDefinition(outputDefinitionId);
    if (od) td.textContent = od.getLabelForCondition();
    else td.textContent = '不正な値です';
    return td;
  }

  /** outputTypeがradioを選択したに使用するchoiceのレンダラー */
  choiceReferenceRenderer(instance, td, row, col, prop, value) {
    const { survey } = this.props;
    if (!value) {
      td.textContent = '';
      return td;
    }
    const replacer = survey.getReplacer();
    td.textContent = replacer.findReferenceLabelIn(value) || '不正な値です';
    return td;
  }

  radioSelectOptions(outputDefinition) {
    const replacer = this.props.survey.getReplacer();
    const choices = outputDefinition.getChoices();
    const question = outputDefinition.getQuestion();
    const options = {};
    choices.forEach((choice) => {
      const value = question.getChoiceReference(choice);
      options[value] = replacer.findReferenceLabelIn(value);
    });
    return options;
  }

  referenceSelectOptions() {
    const { page, survey } = this.props;
    const node = survey.findNodeFromRefId(page.getId());
    const options = {};
    const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId(), true);
    outputDefinitions.forEach((od) => {
      if (od.getOutputType() !== 'number') return;
      options[`{{${od.getId()}.answer}}`] = od.getLabelForCondition();
    });
    return options;
  }

  outputDefinitionIdSelectOptions() {
    const { page, survey } = this.props;
    const node = survey.findNodeFromRefId(page.getId());
    const options = {};
    const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId(), true);
    outputDefinitions.forEach((od) => {
      options[od.getId()] = od.getLabelForCondition();
    });
    return options;
  }

  comparisonTypeSelectOptions(row) {
    const outputDefinition = this.findOutputDefinitionFromRow(row);
    const emptyOptions = {};
    if (!outputDefinition) return emptyOptions;
    switch (outputDefinition.getOutputType()) {
      case 'number':
        return ItemVisibility.COMPARISON_TYPE_OPTIONS;
      default:
        return emptyOptions;
    }
  }

  outputDefinitionIdRenderer(instance, td, row, col, prop, value) {
    const { survey } = this.props;
    if (S(value).isEmpty()) {
      td.textContent = '';
      return td;
    }
    const targetOutputDefinition = survey.findOutputDefinition(value);
    // 見つからなかった場合削除されている
    if (!targetOutputDefinition) td.textContent = '不正な条件設問です';
    else td.textContent = targetOutputDefinition.getLabelForCondition(true);
    return td;
  }

  operatorSelectOptions(row) {
    const outputDefinition = this.findOutputDefinitionFromRow(row);
    const emptyOptions = {};
    if (!outputDefinition) return emptyOptions;
    switch (outputDefinition.getOutputType()) {
      case 'checkbox':
        return {
          '!!': ItemVisibility.OPERATOR_OPTIONS['!!'],
          '!': ItemVisibility.OPERATOR_OPTIONS['!'],
        };
      case 'radio':
        return {
          '!!': ItemVisibility.OPERATOR_OPTIONS['!!'],
          '!': ItemVisibility.OPERATOR_OPTIONS['!'],
        };
      default:
        return {
          '==': ItemVisibility.OPERATOR_OPTIONS['=='],
          '!=': ItemVisibility.OPERATOR_OPTIONS['!='],
          '>': ItemVisibility.OPERATOR_OPTIONS['>'],
          '<': ItemVisibility.OPERATOR_OPTIONS['<'],
          '>=': ItemVisibility.OPERATOR_OPTIONS['>='],
          '<=': ItemVisibility.OPERATOR_OPTIONS['<='],
        };
    }
  }

  visibilityTypeSelectOptions(row, col) {
    const visibilityCondition = this.getVisibilityConditionFromRow(row);
    if (!visibilityCondition) return {};
    return ItemVisibility.VISIBLITY_TYPE_OPTIONS;
  }

  comparisonTypeRenderer(instance, td, row, col, prop, value) {
    const { survey } = this.props;
    this.commonRenderer(td, row);

    const visibilityCondition = this.getVisibilityConditionFromRow(row);
    if (visibilityCondition) {
      const od = survey.findOutputDefinition(visibilityCondition.getOutputDefinitionId());
      if (!od || od.getOutputType() !== 'number') {
        td.classList.add('disabled');
      }
    }

    td.textContent = ItemVisibility.COMPARISON_TYPE_OPTIONS[value] || '';
    return td;
  }

  getVisibilityConditionFromRow(row) {
    const { items } = this.props;
    const item = items.get(row);
    return item.getVisibilityCondition();
  }

  valueRenderer(instance, td, row, col, prop, value) {
    const { survey } = this.props;
    this.commonRenderer(td, row);

    const visibilityCondition = this.getVisibilityConditionFromRow(row);
    if (visibilityCondition) {
      const od = survey.findOutputDefinition(visibilityCondition.getOutputDefinitionId());
      if (
        !od ||
        (od.getOutputType() !== 'number' && od.getOutputType() !== 'radio') ||
        S(visibilityCondition.getComparisonType()).isEmpty()
      ) {
        td.classList.add('disabled');
      }
    }

    td.textContent = value;
    return td;
  }

  operatorRenderer(instance, td, row, col, prop, value) {
    this.commonRenderer(td, row);
    td.textContent = ItemVisibility.OPERATOR_OPTIONS[value] || '';
    return td;
  }

  visiblityTypeRenderer(instance, td, row, col, prop, value) {
    this.commonRenderer(td, row);
    td.textContent = ItemVisibility.VISIBLITY_TYPE_OPTIONS[value] || '';
    return td;
  }

  commonRenderer(td, row) {
    const visibilityCondition = this.getVisibilityConditionFromRow(row);

    if (!visibilityCondition) {
      td.classList.add('disabled');
    } else {
      td.classList.remove('disabled');
    }
  }

  render() {
    const { items } = this.props;
    const visibilityConditions = items.map((item) => {
      const vc = item.getVisibilityCondition();
      return vc ? Object.assign(vc.toJS(), { label: item.getPlainLabel() }) : { label: item.getPlainLabel() };
    }).toJS();
    return (
      <HotTable
        className="item-visibility-editor"
        data={visibilityConditions}
        height={400}
        width={750}
        columns={this.hotColumns}
        colHeaders={['対象選択肢', '条件設問', '比較値タイプ', '比較値', '比較方法', '動作種別']}
        afterChange={(changes, source) => this.handleChangeValue(changes, source)}
        cells={(row, col, prop) => this.cells(row, col, prop)}
      />
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
  changeItemVisibilityConditions: (questionId, value) =>
    dispatch(EditorActions.changeItemVisibilityConditions(questionId, value)),
  changeSubItemVisibilityConditions: (questionId, value) =>
    dispatch(EditorActions.changeSubItemVisibilityConditions(questionId, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(ItemVisibilityEditorPart);
