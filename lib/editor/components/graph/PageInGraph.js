import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Actions from '../../actions';
import QuestionInGraph from './QuestionInGraph';
import NodeInGraph from './NodeInGraph';

class PageInGraph extends Component {
  constructor() {
    super();

    this.addQuestionPopover = (
      <Popover id="popover-positioned-right" title="ページへのアイテム追加">
        <Button bsSize="small" bsStyle="info" block onClick={() => this.handleAddQuestion('Checkbox')}>複数選択肢</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('Radio')} block>単一選択肢</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('MultiNumber')} block>数値記入</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('SingleText')} block>1行テキスト</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('Text')} block>複数行テキスト</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('Description')} block>説明文</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('ScreeningAgreement')} block>調査許諾</Button>
      </Popover>
    );
  }

  onPageSelect(node) {
    const { selectNode } = this.props;
    selectNode(node.getId());
  }

  handleAddQuestion(questionClassName) {
    const { state, node, addQuestion } = this.props;
    const page = state.findPageFromNode(node.getId());
    addQuestion(questionClassName, page.getId(), this.overlayIndex);
  }

  handleRemovePage(e) {
    const { removeNode, node } = this.props;
    e.stopPropagation();
    removeNode(node.getId());
  }

  handleRemoveQuestion(questionId) {
    const { state, removeQuestion, node } = this.props;
    const page = state.findPageFromNode(node.getId());
    removeQuestion(page.getId(), questionId);
  }

  createInsertElement(key, index) {
    return (
      <li key={key} className="insert-item-box">
        <div>
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={this.addQuestionPopover}
            onEnter={() => { this.overlayIndex = index; }}
            rootClose
          >
            <i className="glyphicon glyphicon-plus-sign" />
          </OverlayTrigger>
        </div>
      </li>
    );
  }

  render() {
    const { state, node } = this.props;
    const page = state.findPageFromNode(node.getId());
    const questionEls = [];
    const questions = page.getQuestions();
    if (questions.size === 0) {
      const sizeZeroKey = `${this.constructor.name}_${page.getId()}__0}`;
      questionEls.push(this.createInsertElement(`${sizeZeroKey}_insert_0`, 0));
    }
    questions.forEach((question, i) => {
      const key = `${this.constructor.name}_${page.getId()}_${question.getId()}`;
      if (i === 0) {
        questionEls.push(this.createInsertElement(`${key}_insert_${i}`, i));
      }
      questionEls.push(<QuestionInGraph key={key} node={node} page={page} question={question} />);
      questionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });
    const pageTitle = state.calcPageLabel(page.getId());
    return (
      <NodeInGraph node={node} nodeLabel={pageTitle}>
        <ul className="questions">{questionEls}</ul>
      </NodeInGraph>
    );
  }
}

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
  removeNode: nodeId => dispatch(Actions.removeNode(nodeId)),
  removeQuestion: (pageId, questionId) => dispatch(Actions.removeQuestion(pageId, questionId)),
  addPageNode: (x, y) => dispatch(Actions.addPageNode(x, y)),
  addBranchNode: (x, y) => dispatch(Actions.addBranchNode(x, y)),
  addQuestion: (questionClassName, pageId, index) => dispatch(Actions.addQuestion(questionClassName, pageId, index)),
  swapNode: (srcNodeId, destNodeId) => dispatch(Actions.swapNode(srcNodeId, destNodeId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PageInGraph);
