import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Well, Glyphicon } from 'react-bootstrap';
import * as EditorActions from '../../actions';
import BranchEditor from './BranchEditor';
import ChildConditionEditor from './ChildConditionEditor';
import ValueEditorPart from '../question_editors/parts/ValueEditorPart';
import ExSelect from '../question_editors/parts/ExSelect';

/**
 * 分岐設定をに表示している一つ一つのWellがこのコンポーネントに対応している
 */
class ConditionEditor extends Component {
  /** Conditionの属性が変更となったときに呼ばれるハンドラ。 */
  handleChangeCondition(attr, value) {
    const { branch, condition, changeConditionAttribute } = this.props;
    changeConditionAttribute(branch.getId(), condition.getId(), attr, value);
  }

  /** 描画 */
  render() {
    const { survey, node, options, condition, dragging } = this.props;
    const opacity = dragging ? 0 : 1;
    return (
      <Well className="branch-editor" style={{ opacity }}>
        <div className="branch-editor-header">
          <span>以下の</span>
          <ExSelect
            className="form-control condition-type"
            value={condition.getConditionType()}
            onChange={e => this.handleChangeCondition('conditionType', e.target.value)}
            detailMode={options.isShowDetail()}
          >
            <option value="all">全て</option>
            <option value="some">いずれか</option>
          </ExSelect>
          <span>を</span>
          <ExSelect
            className="form-control condition-type"
            value={condition.getSatisfactionType()}
            onChange={e => this.handleChangeCondition('satisfactionType', e.target.value)}
            detailMode={options.isShowDetail()}
          >
            <option value="satisfy">満たす</option>
            <option value="notSatisfy">満たさない</option>
          </ExSelect>
          <span>場合</span>
          <ExSelect
            className="form-control condition-next-node-id"
            onChange={e => this.handleChangeCondition('nextNodeId', e.target.value)}
            value={condition.getNextNodeId()}
            detailMode={options.isShowDetail()}
            notExistsLabel="不正なページ"
          >
            <option value="" data-error />
            {BranchEditor.createPageOptions(survey, node, 'ConditionEditor')}
          </ExSelect>
          <span>に遷移する</span>
        </div>
        <div className="branch-editor-body">
          {condition.getChildConditions().map((cc, i, childConditions) => {
            const props = Object.assign({}, this.props, { childCondition: cc, index: i, childConditions });
            return <ChildConditionEditor key={cc.getId()} {...props} />;
          })}
        </div>
      </Well>
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
  changeConditionAttribute: (branchId, conditionId, attributeName, value) =>
    dispatch(EditorActions.changeConditionAttribute(branchId, conditionId, attributeName, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(ConditionEditor);
