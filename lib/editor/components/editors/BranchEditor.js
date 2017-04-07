import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Well, FormGroup, ControlLabel, Grid, Col, Row } from 'react-bootstrap';
import ConditionEditor from './ConditionEditor';
import * as EditorActions from '../../actions';

/**
 * 分岐のエディタ
 */
class BranchEditor extends Component {
  /** 分岐条件をdndで入れ替えしたときに呼ばれるハンドラ */
  handleSwapCondition(sourceIndex, toIndex) {
    const { swapCondition, branch } = this.props;
    swapCondition(branch.getId(), sourceIndex, toIndex);
  }

  /** 一つ一つのConditionEditorを表示する */
  createConditions() {
    const { branch } = this.props;
    return branch.get('conditions').map((condition, i) =>
      <ConditionEditor
        key={`${this.constructor.name}-${condition.getId()}`}
        condition={condition}
        index={i}
        branch={branch}
        handleSwapCondition={(sourceIndex, toIndex) => this.handleSwapCondition(sourceIndex, toIndex)}
      />,
    );
  }

  /** 描画 */
  render() {
    const { survey, options, node } = this.props;
    const nextNodeId = node.getNextNodeId();
    return (
      <Grid fluid className={classNames('branch-editor', { 'detail-mode': options.isShowDetail() })}>
        <Row>
          <Col md={12}>
            <FormGroup>
              <h4 className="enq-title enq-title__branch"><ControlLabel>分岐設定</ControlLabel></h4>
              {this.createConditions()}
              <Well>
                <div className="branch-editor-header">
                  <span>上記以外の場合</span>
                  <span className="node-reference-label">{survey.calcNodeLabel(nextNodeId)}</span>
                  <span>に遷移する</span>
                </div>
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
  changeBranch: (branchId, value) => dispatch(EditorActions.changeBranch(branchId, value)),
  swapCondition: (branchId, sourceIndex, toIndex) => dispatch(EditorActions.swapCondition(branchId, sourceIndex, toIndex)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(BranchEditor);
