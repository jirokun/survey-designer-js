import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { loadState, setElementsPosition, changePosition, selectFlow, removeEdge, removeFlow, addBranch, addPageFlow, addBranchFlow, connectFlow, clonePage } from '../actions';
import PageInGraph from './graph/PageInGraph';

class Graph extends Component {
  onPageSelect() {
    const { selectFlow } = this.props;
    selectFlow('F001');
  }
  onBranchSelect() {
    const { selectFlow } = this.props;
    selectFlow('F006');
  }
  render() {
    const addQuestionPopover = (
      <Popover id="popover-positioned-right" title="ページへのアイテム追加">
        <Button bsSize="small" bsStyle="info" block>複数選択肢</Button>
        <Button bsSize="small" bsStyle="info" block>単一選択肢</Button>
        <Button bsSize="small" bsStyle="info" block>ドロップダウン</Button>
        <Button bsSize="small" bsStyle="info" block>マトリクス</Button>
        <Button bsSize="small" bsStyle="info" block>1行テキスト</Button>
        <Button bsSize="small" bsStyle="info" block>複数行テキスト</Button>
        <Button bsSize="small" bsStyle="success" block>テキスト</Button>
        <Button bsSize="small" bsStyle="success" block>画像</Button>
      </Popover>
    );
    const addPagePopover = (
      <Popover id="popover-positioned-right" title="ページ・分岐の追加">
        <Button bsSize="small" bsStyle="info" block>ページ</Button>
        <Button bsSize="small" bsStyle="info" block>分岐</Button>
      </Popover>
    );
    const { state } = this.props;
    const dom = state.getFlowDefs().map((flow) => {
      const refId = flow.get('refId');
      const page = state.findPage(refId);
      if (page) {
        return <PageInGraph flow={flow} />;
      }
      const branch = state.findBranch(refId);
      if (branch) {
        return (
          <div className="branch" onClick={this.onBranchSelect.bind(this)}>
            <div className="title">
              <span>分岐</span>
            </div>
          </div>
        );
      }
      throw `undefined refId: ${refId} defined at flowId: ${flow.get('id')}`;
    }).interpose(
      <div className="arrow-down">
        ↓<OverlayTrigger trigger="click" rootClose placement="right" overlay={addPagePopover}><button className="btn btn-info btn-xs">ページ・分岐追加</button></OverlayTrigger>
      </div>
    ).toArray();
    return <div className="page-list">{dom}</div>;
  }
}

Graph.propTypes = {
  state: PropTypes.object.isRequired,
};

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  loadState: state => dispatch(loadState(state)),
  setElementsPosition: positions => dispatch(setElementsPosition(positions)),
  changePosition: (flowId, x, y) => dispatch(changePosition(flowId, x, y)),
  selectFlow: flowId => dispatch(selectFlow(flowId)),
  removeEdge: (sourceFlowId, targetFlowId) => dispatch(removeEdge(sourceFlowId, targetFlowId)),
  removeFlow: flowId => dispatch(removeFlow(flowId)),
  addPageFlow: (x, y) => dispatch(addPageFlow(x, y)),
  addBranchFlow: (x, y) => dispatch(addBranchFlow(x, y)),
  clonePage: (flowId, x, y) => dispatch(clonePage(flowId, x, y)),
  connectFlow: (sourceFlowId, targetFlowId) => dispatch(connectFlow(sourceFlowId, targetFlowId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Graph);
