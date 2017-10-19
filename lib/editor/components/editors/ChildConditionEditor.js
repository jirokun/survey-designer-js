import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import * as EditorActions from '../../actions';
import ValueEditorPart from '../question_editors/parts/ValueEditorPart';
import ExSelect from '../question_editors/parts/ExSelect';

/**
 * 分岐設定をに表示している一つ一つのWellがこのコンポーネントに対応している
 */
class ChildConditionEditor extends Component {

  /** 条件を追加するボタンが押されたときに呼ばれるハンドラ。必ず押された行の下に条件が追加される */
  handleClickAddButton(ccIndex) {
    const { branch, addChildCondition, condition } = this.props;
    addChildCondition(branch.getId(), condition.getId(), ccIndex + 1);
  }

  /** 条件の削除ボタンを押したときのハンドラ */
  handleClickRemoveButton(childCondition) {
    const { branch, removeChildCondition, condition } = this.props;
    removeChildCondition(branch.getId(), condition.getId(), childCondition.getId());
  }

  /** ChildConditionが変更となるときに呼ばれるハンドラ */
  handleChangeChildCondition(childConditionId, attr, value) {
    const { branch, condition, changeChildConditionAttribute } = this.props;
    changeChildConditionAttribute(branch.getId(), condition.getId(), childConditionId, attr, value);
  }

  /** このnodeよりも前に存在するページに存在するすべてのQuestionのOutputDefinitionから選択肢を作成する */
  createQuestionOptions(childCondition) {
    const { survey, node } = this.props;
    return survey.findPrecedingOutputDefinition(node.getId())
      .filter(od => od.getOutputType() !== 'text') // テキストは現状の実装では必須なので分岐条件に含めない
      .map((od) => {
        const key = `ConditionEditor_child_condition_${childCondition.getId()}_${od.getId()}`;
        return <option key={key} value={od.getId()}>{od.getLabelForCondition()}</option>;
      }).toArray();
  }

  /**
   * 条件の値を入力するフォームを表示する
   * OutputDefinitionのoutputTypeによって表示するエディタが異なる
   */
  createConditionValue(childCondition) {
    const { survey, options, node } = this.props;
    const outputId = childCondition.getOutputId();
    const allOutputDefinitionMap = survey.getAllOutputDefinitionMap();
    const outputDefinition = allOutputDefinitionMap.get(outputId);
    // 未選択、または存在しないoutputIdの場合はなにも表示しない
    if (!outputDefinition) return null;

    const outputType = outputDefinition.getOutputType();
    const keyBase = `ChildConditionEditor-${childCondition.getId()}`;
    switch (outputType) {
      case 'text':
        return [
          (<span key={`${keyBase}-0`}>の入力値を</span>),
          (<ExSelect
            key={`${keyBase}-1`}
            className="form-control condition-ref-operator"
            value={childCondition.getOperator()}
            onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'operator', e.target.value)}
            detailMode={options.isShowDetail()}
          >
            <option value="==">入力していない</option>
            <option value="!=">入力している</option>
          </ExSelect>),
        ];
      case 'number': {
        const valueEditorStyle = options.isShowDetail() ? {} : { width: '200px' };
        return [
          (<span key={`${keyBase}-2`}>の入力値が</span>),
          (
            <ValueEditorPart
              key={`${keyBase}-3`}
              value={childCondition.getValue()}
              onChange={value => this.handleChangeChildCondition(childCondition.getId(), 'value', value)}
              style={valueEditorStyle}
              node={node}
            />
          ),
          (<ExSelect
            key={`${keyBase}-4`}
            className="form-control condition-ref-operator"
            value={childCondition.getOperator()}
            onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'operator', e.target.value)}
            detailMode={options.isShowDetail()}
          >
            <option value="==">と等しい</option>
            <option value="!=">と等しくない</option>
            <option value=">=">以上</option>
            <option value="<=">以下</option>
            <option value=">">より大きい</option>
            <option value="<">より小さい</option>
          </ExSelect>),
        ];
      }
      case 'checkbox':
        return [
          (<span key={`${keyBase}-5`}>を</span>),
          (<ExSelect
            key={`${keyBase}-6`}
            className="form-control condition-value"
            value={childCondition.getValue()}
            onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)}
            detailMode={options.isShowDetail()}
          >
            <option value="false">選択していない</option>
            <option value="true">選択している</option>
          </ExSelect>),
        ];
      // singleChoiceかどうか
      case 'select':
      case 'radio': {
        const question = outputDefinition.getQuestion();
        const questionId = question.getId();
        const choices = outputDefinition.getChoices();

        const value = childCondition.getValue();
        let unkownOption = null;
        if (value !== '' && choices.findIndex(choice => question.getChoiceReference(choice) === value) === -1) {
          unkownOption = <option value={value} data-error>エラー 不正な参照です</option>;
        }

        return [
          (<span key={`${keyBase}-7`}>で</span>),
          (<ExSelect
            key={`${keyBase}-8`}
            className="form-control condition-value"
            onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)}
            value={childCondition.getValue()}
            detailMode={options.isShowDetail()}
          >
            {unkownOption}
            <option value="" data-error />
            {choices.map(choice => <option key={`${questionId}_option_${choice.getValue()}`} value={question.getChoiceReference(choice)}>{choice.getLabel()}</option>).toArray()}
          </ExSelect>),
          (<span key={`${keyBase}-9`}>を</span>),
          (<ExSelect
            key={`${keyBase}-10`}
            className="form-control condition-ref-operator"
            value={childCondition.getOperator()}
            onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'operator', e.target.value)}
            detailMode={options.isShowDetail()}
          >
            <option value="!=">選択していない</option>
            <option value="==">選択している</option>
          </ExSelect>),
        ];
      }
      default:
        throw new Error(`未定義のoutputTypeです。outputType: ${outputType}`);
    }
  }

  /** ChildConditionをレンダリングする */
  render() {
    const { childCondition, index, childConditions, options } = this.props;
    return (
      <div key={`child-conditions-${index}`} className="condition-editor">
        <Glyphicon
          className="clickable icon-button text-info"
          glyph="plus-sign"
          onClick={() => this.handleClickAddButton(index)}
        />
        <Glyphicon
          className={classNames('clickable icon-button text-danger', { invisible: childConditions.size === 1 })}
          glyph="remove-sign"
          onClick={() => this.handleClickRemoveButton(childCondition)}
        />
        <ExSelect
          className="form-control condition-ref-id"
          value={childCondition.getOutputId()}
          onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'outputId', e.target.value)}
          detailMode={options.isShowDetail()}
        >
          <option value="" data-error />
          {this.createQuestionOptions(childCondition)}
        </ExSelect>
        {this.createConditionValue(childCondition)}
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
  addChildCondition: (branchId, conditionId, index) =>
    dispatch(EditorActions.addChildCondition(branchId, conditionId, index)),
  removeChildCondition: (branchId, conditionId, childConditionId) =>
    dispatch(EditorActions.removeChildCondition(branchId, conditionId, childConditionId)),
  changeChildConditionAttribute: (branchId, conditionId, childConditionId, attributeName, value) =>
    dispatch(EditorActions.changeChildConditionAttribute(branchId, conditionId, childConditionId, attributeName, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(ChildConditionEditor);
