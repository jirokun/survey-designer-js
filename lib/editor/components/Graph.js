import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { loadState, setElementsPosition, changePosition, selectFlow, removeEdge, removeFlow, addBranch, addPageFlow, addBranchFlow, connectFlow, clonePage } from '../actions';
import PageInGraph from './graph/PageInGraph';
import BranchInGraph from './graph/BranchInGraph';

class Graph extends Component {
  constructor() {
    super();

    this.addPagePopover = (
      <Popover id="popover-positioned-right" title="ページ・分岐の追加">
        <Button bsSize="small" bsStyle="info" block>ページ</Button>
        <Button bsSize="small" bsStyle="info" block>分岐</Button>
      </Popover>
    );
  }

  createInsertEl(key, showArrow) {
    const arrowStyle = {
      visibility: showArrow ? 'visible' : 'hidden',
    };
    return (
      <div key={key} className="arrow-down">
        <span style={arrowStyle}>↓</span>
        <OverlayTrigger trigger="click" rootClose placement="right" overlay={this.addPagePopover}>
          <button className="btn btn-info btn-xs">ページ・分岐追加</button>
        </OverlayTrigger>
      </div>
    );
  }

  render() {
    const { state } = this.props;
    const pageEls = [];
    const flowDefs = state.getFlowDefs();
    flowDefs.forEach((flow, i) => {
      const key = `${this.constructor.name}_${flow.getId()}`;
      if (i === 0) {
        pageEls.push(this.createInsertEl(`${key}_arrow_${i}`, false));
      }
      if (flow.isPage()) {
        pageEls.push(<PageInGraph key={key} flow={flow} />);
      } else {
        pageEls.push(<BranchInGraph key={key} flow={flow} />);
      }
      pageEls.push(this.createInsertEl(`${key}_arrow_${i + 1}`, i !== flowDefs.size - 1));
    });
    return <div className="page-list">{pageEls}</div>;
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
