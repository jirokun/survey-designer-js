import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Well, Glyphicon } from 'react-bootstrap';
import { List } from 'immutable';
import * as EditorActions from '../../actions';

/**
 * 分岐設定をに表示している一つ一つのWellがこのコンポーネントに対応している
 */
class ConditionEditor extends Component {
  /** 条件を追加するボタンが押されたときに呼ばれるハンドラ。必ず押された行の下に条件が追加される */
  handleClickAddButton(ccIndex) {
    const { state, addChildCondition, condition } = this.props;
    const branch = state.findCurrentBranch();
    addChildCondition(branch.getId(), condition.getId(), ccIndex + 1);
  }

  /** 条件の削除ボタンを押したときのハンドラ */
  handleClickRemoveButton(childCondition) {
    const { state, removeChildCondition, condition } = this.props;
    const branch = state.findCurrentBranch();
    removeChildCondition(branch.getId(), condition.getId(), childCondition.getId());
  }

  /** Conditionの属性が変更となったときに呼ばれるハンドラ。 */
  handleChangeCondition(attr, value) {
    const { state, condition, changeConditionAttribute } = this.props;
    const branch = state.findCurrentBranch();
    changeConditionAttribute(branch.getId(), condition.getId(), attr, value);
  }

  /** ChildConditionが変更となるときに呼ばれるハンドラ */
  handleChangeChildCondition(childConditionId, attr, value) {
    const { state, condition, changeChildConditionAttribute } = this.props;
    const branch = state.findCurrentBranch();
    changeChildConditionAttribute(branch.getId(), condition.getId(), childConditionId, attr, value);
  }

  /** このnodeよりも前に存在するページに存在するすべてのQuestionのOutputDefinitionから選択肢を作成する */
  renderQuestionOptions(childCondition) {
    const { state } = this.props;
    const node = state.findCurrentNode();
    const precedingPageNodeIds = state.findPrecedingPageNodeIds(node.getId());
    const optionValues = List(precedingPageNodeIds).map((nodeId) => {
      const page = state.findPageFromNode(nodeId);
      const options = page.getQuestions().map(question =>
        question.getOutputDefinitions().map((od) => {
          const questionNo = state.calcQuestionNo(page.getId(), question.getId(), od.getPostfix());
          const key = `${this.constructor.name}_child_condition_${childCondition.getId()}_${od.getId()}`;
          return <option key={key} value={od.getId()}>{questionNo} {od.getLabel()}</option>;
        }).toList(),
      ).toList();
      return options;
    }).flatten();
    return optionValues;
  }

  /**
   * 条件の値を入力するフォームを表示する
   * OutputDefinitionのoutputTypeによって表示するエディタが異なる
   */
  renderConditionValue(childCondition) {
    const { state } = this.props;
    const outputId = childCondition.getOutputId();
    const allOutputDefinitionMap = state.getAllOutputDefinitionMap();
    const outputDefinition = allOutputDefinitionMap.get(outputId);
    // 未選択、または存在しないoutputIdの場合はなにも表示しない
    if (!outputDefinition) return null;

    const outputType = outputDefinition.getOutputType();
    const keyBase = `${this.constructor.name}-${childCondition.getId()}`;
    switch (outputType) {
      case 'text':
        return [
          (<span key={`${keyBase}-0`}>の入力値を</span>),
          (<select key={`${keyBase}-1`} className="form-control condition-ref-operator" value={childCondition.getOperator()} onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'operator', e.target.value)}>
            <option value="==">入力していない</option>
            <option value="!=">入力している</option>
          </select>),
        ];
      case 'number':
        return [
          (<span key={`${keyBase}-2`}>の入力値が</span>),
          (<input key={`${keyBase}-3`} type="number" className="form-control" value={childCondition.getValue()} size="3" onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)} />),
          (<select key={`${keyBase}-4`} className="form-control condition-ref-operator" value={childCondition.getOperator()} onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'operator', e.target.value)}>
            <option value="==">と等しい</option>
            <option value="!=">と等しくない</option>
            <option value=">=">以上</option>
            <option value="<=">以下</option>
            <option value=">">より大きい</option>
            <option value="<">より小さい</option>
          </select>),
        ];
      case 'checkbox':
        return [
          (<span key={`${keyBase}-5`}>を</span>),
          (<select key={`${keyBase}-6`} className="form-control" value={childCondition.getValue()} onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)}>
            <option value="">選択していない</option>
            <option value="on">選択している</option>
          </select>),
        ];
      case 'select':
      case 'radio': {
        const questionId = outputDefinition.getQuestionId();
        const question = state.findQuestion(questionId);
        // OutputDefinitionにoverrideItemsが定義されていれば、そちらを優先して表示する
        const overrideItems = outputDefinition.getOverrideItems();
        return [
          (<span key={`${keyBase}-7`}>で</span>),
          (<select key={`${keyBase}-8`} className="form-control" onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'value', e.target.value)} value={childCondition.getValue()}>
            <option value="" />
            {
              overrideItems ?
                overrideItems.map(value => <option key={`${questionId}_option_${value}`} value={value}>{value}</option>).toArray() :
                question.getItems().map(item => <option key={`${questionId}_option_${item.getIndex() + 1}`} value={`value${item.getIndex() + 1}`}>{item.getPlainLabel()}</option>).toArray()
            }
          </select>),
          (<span key={`${keyBase}-9`}>を選択している</span>),
        ];
      }
      default:
        throw new Error(`未定義のoutputTypeです。outputType: ${outputType}`);
    }
  }

  /** ChildConditionをレンダリングする */
  renderChildCondition(childCondition, index, childConditions) {
    const removeButtonStyle = childConditions.size === 1 ? { visibility: 'hidden' } : {};
    return (
      <div ref={(el) => { this.root = el; }} key={`child-conditions-${index}`} className="condition-editor">
        <Glyphicon
          className="clickable icon-button text-info"
          glyph="plus-sign"
          onClick={() => this.handleClickAddButton(index)}
        />
        <Glyphicon
          className="clickable icon-button text-danger"
          glyph="remove-sign"
          onClick={() => this.handleClickRemoveButton(childCondition)}
          style={removeButtonStyle}
        />
        <select className="form-control condition-ref-id" value={childCondition.getOutputId()} onChange={e => this.handleChangeChildCondition(childCondition.getId(), 'outputId', e.target.value)}>
          <option value="" />
          {this.renderQuestionOptions(childCondition)}
        </select>
        {this.renderConditionValue(childCondition)}
      </div>
    );
  }

  /**
   * 遷移先のページの一覧をoptionタグで返す
   * 遷移先のページは分自身のノードよりも後ろにあるものだけが条件となる
   */
  renderPageOptions() {
    const { state } = this.props;
    const node = state.findCurrentNode();
    const followingPageNodeIds = state.findFollowingPageAndFinisherNodeIds(node.getId());
    return followingPageNodeIds.map((nodeId) => {
      const key = `next_node_id_option_${this.props.index}_${nodeId}`;
      return <option key={key} value={nodeId}>{state.calcNodeLabel(nodeId)}</option>;
    });
  }

  /** 描画 */
  render() {
    const { condition, isDragging } = this.props;
    const opacity = isDragging ? 0 : 1;
    return (
      <Well className="branch-editor" style={{ opacity }}>
        <div className="branch-editor-header">
          <span>以下の</span>
          <select
            ref={(el) => { this.conditionTypeEl = el; }}
            className="form-control condition-type"
            value={condition.getConditionType()}
            onChange={e => this.handleChangeCondition('conditionType', e.target.value)}
          >
            <option value="all">全て</option>
            <option value="any">いずれか</option>
          </select>
          <span>を満たす場合</span>
          <select className="form-control condition-next-node-id" onChange={e => this.handleChangeCondition('nextNodeId', e.target.value)} value={condition.getNextNodeId()}>
            <option value="" />
            {this.renderPageOptions()}
          </select>
          <span>に遷移する</span>
        </div>
        <div className="branch-editor-body">
          {condition.getChildConditions().map((cc, i, childConditions) => this.renderChildCondition(cc, i, childConditions))}
        </div>
      </Well>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  addChildCondition: (branchId, conditionId, index) =>
    dispatch(EditorActions.addChildCondition(branchId, conditionId, index)),
  removeChildCondition: (branchId, conditionId, childConditionId) =>
    dispatch(EditorActions.removeChildCondition(branchId, conditionId, childConditionId)),
  changeConditionAttribute: (branchId, conditionId, attributeName, value) =>
    dispatch(EditorActions.changeConditionAttribute(branchId, conditionId, attributeName, value)),
  changeChildConditionAttribute: (branchId, conditionId, childConditionId, attributeName, value) =>
    dispatch(EditorActions.changeChildConditionAttribute(branchId, conditionId, childConditionId, attributeName, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(ConditionEditor);
