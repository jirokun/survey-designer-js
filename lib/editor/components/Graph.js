import React, { Component, PropTypes } from 'react';
import { cloneObj, nextFlowId, findPage, findFlow, makeCytoscapeElements } from '../../utils';
import { connect } from 'react-redux';
import { loadState, setElementsPosition, changePosition, selectFlow, removeEdge, removeFlow, addBranch, addPageFlow, addBranchFlow, connectFlow, clonePage } from '../actions';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

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
    const { state, defs } = this.props;
    const { pageDefs, flowDefs } = defs;
    return (
      <div className="page-list">
        <div className="page" onClick={this.onPageSelect.bind(this)}>
          <div className="title">
            <span>1</span>.<span>最初に先生ご自身について教えてください</span>
          </div>
          <ul className="questions">
            <li className="question"><button className="btn btn-info btn-xs">編集</button> QF1.経営形態</li>
            <li className="insert-item-box"><div><OverlayTrigger trigger="click" rootClose placement="right" overlay={addQuestionPopover}><i className="glyphicon glyphicon-plus-sign" /></OverlayTrigger></div></li>
            <li className="question"><button className="btn btn-info btn-xs">編集</button> QF2.病床数</li>
            <li className="insert-item-box"><div><OverlayTrigger trigger="click" rootClose placement="right" overlay={addQuestionPopover}><i className="glyphicon glyphicon-plus-sign" /></OverlayTrigger></div></li>
            <li className="question"><button className="btn btn-info btn-xs">編集</button> QF3.先生の主な診療科</li>
            <li className="insert-item-box"><div><OverlayTrigger trigger="click" rootClose placement="right" overlay={addQuestionPopover}><i className="glyphicon glyphicon-plus-sign" /></OverlayTrigger></div></li>
            <li className="question"><button className="btn btn-info btn-xs">編集</button> 説明</li>
            <li className="insert-item-box"><div><OverlayTrigger trigger="click" rootClose placement="right" overlay={addQuestionPopover}><i className="glyphicon glyphicon-plus-sign" /></OverlayTrigger></div></li>
            <li className="question"><button className="btn btn-info btn-xs">編集</button> QF4.先生のご年齢</li>
            <li className="insert-item-box"><div><OverlayTrigger trigger="click" rootClose placement="right" overlay={addQuestionPopover}><i className="glyphicon glyphicon-plus-sign" /></OverlayTrigger></div></li>
          </ul>
        </div>
        <div className="arrow-down">
          ↓<OverlayTrigger trigger="click" rootClose placement="right" overlay={addPagePopover}><button className="btn btn-info btn-xs">ページ・分岐追加</button></OverlayTrigger>
        </div>
        <div className="branch" onClick={this.onBranchSelect.bind(this)}>
          <div className="title">
            <span>分岐</span>
          </div>
        </div>
        <div className="arrow-down">
          ↓<OverlayTrigger trigger="click" rootClose placement="right" overlay={addPagePopover}><button className="btn btn-info btn-xs">ページ・分岐追加</button></OverlayTrigger>
        </div>
        <div className="page" onClick={this.onPageSelect.bind(this)}>
          <div className="title">
            <span>2. 先生が、血液疾患の中でも特に専門とされている疾患をお知らせください。</span>
          </div>
        </div>
      </div>
    );
  }
}

Graph.propTypes = {
  state: PropTypes.object.isRequired,
};

const stateToProps = state => ({
  state,
  defs: state.defs,
  pageDefs: state.defs.pageDefs,
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
