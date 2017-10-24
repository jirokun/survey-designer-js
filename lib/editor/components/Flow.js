import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';
import S from 'string';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Action from '../actions';
import PageInFlow from './flows/PageInFlow';
import BranchInFlow from './flows/BranchInFlow';
import FinisherInFlow from './flows/FinisherInFlow';

/** nodeを並べて表示するフロー */
class Flow extends Component {
  /** コンストラクタ */
  constructor() {
    super();
    this.state = {
      popoverIndex: -1,
      paths: null,
      svgHeight: null,
      transitionModels: null,
      positions: null,
    };
  }

  componentDidUpdate() {
    this.createTransitionPathModel();
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
        <Button className="enq-button__page" bsSize="small" bsStyle="default" block onClick={() => addNode(popoverIndex, 'page')}>ページ</Button>
        <Button className="enq-button__branch" bsSize="small" bsStyle="default" block onClick={() => addNode(popoverIndex, 'branch')}>分岐</Button> <Button className="enq-button__finisher" bsSize="small" bsStyle="default" block onClick={() => addNode(popoverIndex, 'finisher')}>終了ページ</Button>
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

  /** 遷移グラフに利用するモデルを生成する */
  createTransitionPathModel() {
    const { survey } = this.props;
    const rootEl = ReactDOM.findDOMNode(this);
    const positions = $(rootEl).find('.enq-page').map((i, el) => Object.assign({ top: el.offsetTop }, {
      height: $(el).height(),
      width: $(el).width(),
    })).toArray();

    let transitionModels = List();
    survey.getNodes().forEach((node, i) => {
      if (!node.isBranch()) return;

      const branch = survey.findBranch(node.getRefId());
      branch.getConditions().forEach((condition) => {
        const nextNodeId = condition.getNextNodeId();
        const targetIndex = survey.getNodes().findIndex(n => n.getId() === nextNodeId);
        if (targetIndex === -1) return;
        transitionModels = transitionModels.push({ branch, fromIndex: i, toIndex: targetIndex });
      });
    });

    if (
      this.state.positions === null ||
      JSON.stringify(this.state.positions) !== JSON.stringify(positions) ||
      JSON.stringify(this.state.transitionModels) !== JSON.stringify(transitionModels)
    ) {
      this.setState({ svgHeight: $(rootEl).height(), transitionModels, positions });
    }
  }

  /** 遷移グラフを表示する */
  createTransitionGraph() {
    const { svgHeight, transitionModels, positions } = this.state;
    if (positions === null) return null;

    // toIndexでsortし、toIndexからsortの順番を取得するためのオブジェクトを作成
    const sortedToIndex = transitionModels.map(m => m.toIndex).sort().filter((x, i, self) => self.indexOf(x) === i);

    const paths = transitionModels.map((model) => {
      const tp = positions[model.toIndex];
      const distance = 20 + (sortedToIndex.indexOf(model.toIndex) * 10);
      const sameGroupIndex = transitionModels
        .filter(m => m.fromIndex === model.fromIndex)
        .findIndex(m => m.toIndex === model.toIndex);
      const $conditionEl = $($($('.enq-page')[model.fromIndex]).find('li.condition')[sameGroupIndex]);
      const conditionRect = $conditionEl.position();
      const top =
        $conditionEl.offsetParent()[0].offsetTop +
        conditionRect.top +
        ($conditionEl.height() / 2);
      const right = distance;
      const left = 0;
      return (
        <path
          key={`${model.fromIndex}_${model.toIndex}`}
          stroke="black"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrow)"
          d={`M ${left},${top}
          Q ${left + (distance / 2)},${top} ${right},${top}
          L ${right},${tp.top + 6 + (tp.height / 2)}
          L ${left + 10},${tp.top + 6 + (tp.height / 2)}`}
        />
      );
    });

    return (
      <svg className="transition-graph" height={svgHeight}>
        <defs>
          <marker id="arrow" markerWidth="5" markerHeight="5" refX="0" refY="2" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,4 L3,2 z" fill="#000" />
          </marker>
        </defs>
        {paths}
      </svg>
    );
  }

  /** 描画 */
  render() {
    const { survey } = this.props;
    const pageEls = [];
    const nodes = survey.getNodes();
    nodes.forEach((node, i) => {
      const key = `Flow_${node.getId()}`;
      if (i === 0) {
        pageEls.push(this.createInsertEl(`${key}_arrow_${i}`, i, false));
      }
      if (node.isPage()) {
        pageEls.push(<PageInFlow key={key} node={node} />);
        pageEls.push(this.createInsertEl(`${key}_arrow_${i + 1}`, i + 1, i !== nodes.size - 1));
      } else if (node.isBranch()) {
        pageEls.push(<BranchInFlow key={key} node={node} />);
        pageEls.push(this.createInsertEl(`${key}_arrow_${i + 1}`, i + 1, i !== nodes.size - 1));
      } else if (node.isFinisher()) {
        pageEls.push(<FinisherInFlow key={key} node={node} />);
        pageEls.push(this.createInsertEl(`${key}_arrow_${i + 1}`, i + 1, false));
      } else {
        throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
      }
    });
    return (
      <div className="flow-pane">
        <div className="node-list">{pageEls}</div>
        {this.createTransitionGraph()}
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});

const actionsToProps = dispatch => ({
  addNode: (index, nodeType) => dispatch(Action.addNode(index, nodeType)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Flow);
