import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Action from '../actions';
import PageInGraph from './graph/PageInGraph';
import BranchInGraph from './graph/BranchInGraph';
import FinisherInGraph from './graph/FinisherInGraph';

class Graph extends Component {
  constructor() {
    super();
    this.state = {
      popoverIndex: -1,
    };
  }

  addPagePopover() {
    const { addNode } = this.props;
    const { popoverIndex } = this.state;
    return (
      <Popover id="popover-positioned-right" title="ページ・分岐の追加・終了ページ">
        <Button bsSize="small" bsStyle="info" block onClick={() => addNode(popoverIndex, 'page')}>ページ</Button>
        <Button bsSize="small" bsStyle="info" block onClick={() => addNode(popoverIndex, 'branch')}>分岐</Button>
        <Button bsSize="small" bsStyle="info" block onClick={() => addNode(popoverIndex, 'finisher')}>終了ページ</Button>
      </Popover>
    );
  }

  handleBeforePopoerveShown(popoverIndex) {
    this.setState({ popoverIndex });
  }

  createInsertEl(key, index, showArrow) {
    const arrowStyle = {
      visibility: showArrow ? 'visible' : 'hidden',
    };
    return (
      <div key={key} className="arrow-down">
        <span style={arrowStyle}>↓</span>
        <OverlayTrigger rootClose trigger="click" placement="right" overlay={this.addPagePopover()} onEnter={() => this.handleBeforePopoerveShown(index)}>
          <Button bsStyle="info" className="btn-xs">ページ・分岐・終了追加</Button>
        </OverlayTrigger>
      </div>
    );
  }

  render() {
    const { state } = this.props;
    const pageEls = [];
    const nodes = state.getNodes();
    nodes.forEach((node, i) => {
      const key = `${this.constructor.name}_${node.getId()}`;
      if (i === 0) {
        pageEls.push(this.createInsertEl(`${key}_arrow_${i}`, i, false));
      }
      if (node.isPage()) {
        pageEls.push(<PageInGraph key={key} node={node} />);
      } else if (node.isBranch()) {
        pageEls.push(<BranchInGraph key={key} node={node} />);
      } else if (node.isFinisher()) {
        pageEls.push(<FinisherInGraph key={key} node={node} />);
      } else {
        throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
      }
      pageEls.push(this.createInsertEl(`${key}_arrow_${i + 1}`, i + 1, i !== nodes.size - 1));
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
  addNode: (index, nodeType) => dispatch(Action.addNode(index, nodeType)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Graph);
