import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Action from '../actions';
import PageInGraph from './graphs/PageInGraph';
import BranchInGraph from './graphs/BranchInGraph';
import FinisherInGraph from './graphs/FinisherInGraph';

/** nodeを並べて表示するグラフ */
class Graph extends Component {
  /** コンストラクタ */
  constructor() {
    super();
    this.state = {
      popoverIndex: -1,
    };
  }

  /** popoverを表示する前に実行するメソッド */
  handleBeforePopoerveShown(popoverIndex) {
    // どのindexでpopoverが表示されるかをstateに格納
    this.setState({ popoverIndex });
  }

  /** ノードの追加を行うpopoverを返す */
  createNodePopover() {
    const { addNode } = this.props;
    const { popoverIndex } = this.state;
    return (
      <Popover id="popover-positioned-right" title="ページ・分岐の追加・終了ページ">
        <Button bsSize="small" bsStyle="default" block onClick={() => addNode(popoverIndex, 'page')}>ページ</Button>
        <Button bsSize="small" bsStyle="default" block onClick={() => addNode(popoverIndex, 'branch')}>分岐</Button>
        <Button bsSize="small" bsStyle="default" block onClick={() => addNode(popoverIndex, 'finisher')}>終了ページ</Button>
      </Popover>
    );
  }

  // nodeの追加をするためのエレメントを作成する */
  createInsertEl(key, index, showArrow) {
    return (
      <div key={key} className="arrow-down">
        <span className={classNames({ invisible: !showArrow })}><i className="glyphicon glyphicon-arrow-down" /></span>
        <OverlayTrigger
          rootClose
          trigger="click"
          placement="right"
          overlay={this.createNodePopover()}
          onEnter={() => this.handleBeforePopoerveShown(index)}
        >
          <Button bsStyle="info" className="btn-xs"><i className="glyphicon glyphicon-plus" /> ページ・分岐・終了追加</Button>
        </OverlayTrigger>
      </div>
    );
  }

  /** 描画 */
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
    return <div className="graph-pane">{pageEls}</div>;
  }
}

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
