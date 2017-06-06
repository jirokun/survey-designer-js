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
import VisibilityConditionDefinition from '../../../../runtime/models/survey/questions/internal/VisibilityConditionDefinition';
import * as EditorActions from '../../../actions';
import * as ItemVisibility from '../../../../constants/ItemVisibility';

class ItemVisibilityEditorPart extends Component {
  constructor(props) {
    super(props);

    // HotTableのColumn
    this.hotColumns = [
      // 対象選択肢の定義
      { data: 'label', readOnly: true },
      // 条件設問の定義
      {
        data: 'outputDefinitionId',
        editor: 'select',
        selectOptions: this.outputDefinitionIdSelectOptions.bind(this),
        renderer: this.outputDefinitionIdRenderer.bind(this),
      },
      // 比較値タイプの定義
      {
        data: 'comparisonType',
        editor: 'select',
        selectOptions: this.comparisonTypeSelectOptions.bind(this),
        renderer: this.comparisonTypeRenderer.bind(this),
      },
      // 比較値の定義
      {
        data: 'value',
        // selectOptions, editorがoutputDefinition.outputTypeによって変わるのでcellsで対応している
        renderer: this.valueRenderer.bind(this),
      },
      // 比較方法の定義
      {
        data: 'operator',
        editor: 'select',
        selectOptions: this.operatorSelectOptions.bind(this),
        renderer: this.operatorRenderer.bind(this),
      },
      // 動作種別の定義
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
    const { page, question, subItem, changeItemVisibilityConditions, changeSubItemVisibilityConditions } = this.props;
    // loadDataのときは何もしない
    if (source === 'loadData') return;

    const { items } = this.props;

    const newValueMap = {};
    const declaredDatKeys = this.hotColumns.map(column => column.data);

    // changesは変更を表すchangeの配列。
    // changeには変更情報が下記のように格納されている。
    // change[0]: 行のindex
    // change[1]: prop変更されたデータのプロパティ名。具体的にはthis.hotColumnsのdataプロパティ値が入る。outputDefinitionId, comparisonType, value, operator, visibilityType
    // change[2]: 変更される前の値
    // change[3]: 変更された後の値
    changes.forEach((change) => {
      const row = change[0];
      const prop = change[1];
      const oldVal = change[2];
      const newVal = change[3];
      const item = items.get(row);
      if (oldVal === newVal) return;
      if (!declaredDatKeys.includes(prop)) return;
      newValueMap[item.getId()] = newValueMap[item.getId()] || {};
      // Handsontableの変更情報からitem毎の変更点valueMapに変換している
      newValueMap[item.getId()][prop] = typeof newVal === 'number' ? `${newVal}` : newVal;
    });

    if (subItem === true) {
      changeSubItemVisibilityConditions(page.getId(), question.getId(), newValueMap);
    } else {
      changeItemVisibilityConditions(page.getId(), question.getId(), newValueMap);
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

  /**
   * handsontableのセル毎の設定を変更するメソッド
   * see: https://docs.handsontable.com/pro/1.11.0-beta2/Options.html#cells
   */
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
      } else if (outputDefinition.isOutputTypeSingleChoice()) {
        return {
          editor: 'select',
          selectOptions: this.singleChoiceSelectOptions(outputDefinition),
          renderer: this.referenceRenderer.bind(this),
        };
      }
    }
    return emptyCellProperties;
  }

  /** 参照値を表示するrenderer */
  referenceRenderer(instance, td, row, col, prop, value) {
    const { survey } = this.props;
    if (!value) {
      td.textContent = '';
      return td;
    }
    const replacer = survey.getReplacer();
    td.textContent = replacer.findReferenceLabelIn(value) || '不正な値です';
    return td;
  }

  singleChoiceSelectOptions(outputDefinition) {
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
    const outputDefinitions = survey.findPrecedingOutputDefinition(node.getId(), true).filter(od => (
      od.getOutputType() === 'number' ||
      od.getOutputType() === 'checkbox' ||
      od.isOutputTypeSingleChoice()
    ));
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
    const { survey, page } = this.props;
    if (S(value).isEmpty()) {
      td.textContent = '';
      return td;
    }
    const node = survey.findNodeFromRefId(page.getId());
    const targetOutputDefinition = survey.findPrecedingOutputDefinition(node.getId(), true).find(od => od.getId() === value);
    // 見つからなかった場合削除されている
    if (!targetOutputDefinition) {
      td.textContent = '不正な条件設問です';
    } else {
      td.textContent = targetOutputDefinition.getLabelForCondition(true);
    }
    return td;
  }

  operatorSelectOptions(row) {
    const outputDefinition = this.findOutputDefinitionFromRow(row);
    return VisibilityConditionDefinition.findOperatorSelectOptions(outputDefinition);
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
        (od.getOutputType() !== 'number' && !od.isOutputTypeSingleChoice()) ||
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
    const outputDefinition = this.findOutputDefinitionFromRow(row);
    td.textContent = VisibilityConditionDefinition.findOperatorSelectOptions(outputDefinition)[value] || '';
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
        allowInsertRow={false}
        allowInsertColumn={false}
        cells={(row, col, prop) => this.cells(row, col, prop)}
        fillHandle={false}
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
  changeItemVisibilityConditions: (pageId, questionId, value) =>
    dispatch(EditorActions.changeItemVisibilityConditions(pageId, questionId, value)),
  changeSubItemVisibilityConditions: (pageId, questionId, value) =>
    dispatch(EditorActions.changeSubItemVisibilityConditions(pageId, questionId, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(ItemVisibilityEditorPart);
