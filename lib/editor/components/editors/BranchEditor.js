import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import S from 'string';
import { Well, FormGroup, ControlLabel, Grid, Col, Row } from 'react-bootstrap';
import ConditionEditor from './ConditionEditor';
import ExSelect from '../question_editors/parts/ExSelect';
import * as EditorActions from '../../actions';

/**
 * 分岐のエディタ
 */
class BranchEditor extends Component {
  /**
   * 遷移先のページの一覧をoptionタグで返す
   * 遷移先のページは分自身のノードよりも後ろにあるものだけが条件となる
   */
  static createPageOptions(survey, node, keyPrefix) {
    const followingPageNodeIds = survey.findFollowingPageAndFinisherNodeIds(node.getId());
    return followingPageNodeIds.map((nodeId, index) => {
      const key = `${keyPrefix}_next_node_id_option_${index}_${nodeId}`;
      return <option key={key} value={nodeId}>{survey.calcNodeLabel(nodeId)}</option>;
    });
  }

  /** 分岐条件をdndで入れ替えしたときに呼ばれるハンドラ */
  handleSwapCondition(sourceIndex, toIndex) {
    const { swapCondition, branch } = this.props;
    swapCondition(branch.getId(), sourceIndex, toIndex);
  }

  /** 一つ一つのConditionEditorを表示する */
  createConditions() {
    const { branch, node } = this.props;
    return branch.get('conditions').map((condition, i) =>
      <ConditionEditor
        key={`BranchEditor-${condition.getId()}`}
        condition={condition}
        index={i}
        branch={branch}
        node={node}
        handleSwapCondition={(sourceIndex, toIndex) => this.handleSwapCondition(sourceIndex, toIndex)}
      />,
    );
  }

  /** 描画 */
  render() {
    const { survey, options, node, changeBranchAttribute } = this.props;
    const branch = survey.findBranchFromNode(node.getId());
    let nextNodeId;
    if (branch.getNextNodeId()) {
      nextNodeId = branch.getNextNodeId(); // 指定したページが表示される
    } else if (node.getNextNodeId()) {
      nextNodeId = ''; // 空文字の場合、「次のページ」が選択される
    } else {
      nextNodeId = undefined; // undefinedの場合、不正なページと表示される
    }
    const branchNo = survey.calcBranchNo(node.getRefId());
    return (
      <Grid fluid className={classNames('branch-editor-container', { 'detail-mode': options.isShowDetail() })}>
        <Row>
          <Col md={12}>
            <FormGroup>
              <h4 className="enq-title enq-title__branch"><ControlLabel>分岐 {branchNo} 設定</ControlLabel></h4>
              {this.createConditions()}
              <Well>
                {branch.getConditions().size > 0 ? <span>上記以外の場合</span> : null}
                <ExSelect
                  className="form-control branch-next-node-id"
                  onChange={e => changeBranchAttribute(branch.getId(), 'nextNodeId', S(e.target.value).isEmpty() ? null : e.target.value)}
                  value={nextNodeId}
                  detailMode={options.isShowDetail()}
                  notExistsLabel="不正なページ"
                >
                  <option value="">次のページ ({survey.calcNodeLabel(node.getNextNodeId())})</option>
                  {BranchEditor.createPageOptions(survey, node, 'BranchEditor')}
                </ExSelect>
                <span>に遷移する</span>
              </Well>
            </FormGroup>
          </Col>
        </Row>
      </Grid>
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
  changeBranchAttribute: (branchId, attributeName, value) => dispatch(EditorActions.changeBranchAttribute(branchId, attributeName, value)),
  changeBranch: (branchId, value) => dispatch(EditorActions.changeBranch(branchId, value)),
  swapCondition: (branchId, sourceIndex, toIndex) => dispatch(EditorActions.swapCondition(branchId, sourceIndex, toIndex)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BranchEditor);
