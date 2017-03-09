import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Actions from '../../actions';
import QuestionInFlow from './QuestionInFlow';
import NodeInFlow from './NodeInFlow';

/** Flowの中に描画するページ */
class PageInFlow extends Component {
  constructor() {
    super();
    this.state = {
      popoverIndex: -1,
    };
  }

  /** 設問を削除したときに処理 */
  handleRemoveQuestion(questionId) {
    const { state, removeQuestion, node } = this.props;
    const page = state.findPageFromNode(node.getId());
    removeQuestion(page.getId(), questionId);
  }

  /** popoverを表示する前に実行するメソッド */
  handleBeforePopoerveShown(popoverIndex) {
    // どのindexでpopoverが表示されるかをstateに格納
    this.setState({ popoverIndex });
  }

  // ページへのアイテム追加ボタンを押したときに表示されるポップアップ
  createQuestionPopover() {
    const { state, node, addQuestion } = this.props;
    const { popoverIndex } = this.state;
    const pageId = state.findPageFromNode(node.getId()).getId();

    return (
      <Popover id="popover-positioned-right" title="ページへのアイテム追加">
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('Checkbox', pageId, popoverIndex)} block>複数選択肢</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('Radio', pageId, popoverIndex)} block>単一選択肢</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('MultiNumber', pageId, popoverIndex)} block>数値記入</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('SingleText', pageId, popoverIndex)} block>1行テキスト</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('Text', pageId, popoverIndex)} block>複数行テキスト</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('Description', pageId, popoverIndex)} block>説明文</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('ScreeningAgreement', pageId, popoverIndex)} block>調査許諾</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('Schedule', pageId, popoverIndex)} block>日程</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => addQuestion('PersonalInfo', pageId, popoverIndex)} block>個人情報</Button>
      </Popover>
    );
  }

  /** 設問を追加するためのエレメントを作成 */
  createInsertElement(key, index) {
    return (
      <OverlayTrigger
        key={key} 
        rootClose
        trigger="click"
        placement="right"
        overlay={this.createQuestionPopover()}
        onEnter={() => this.handleBeforePopoerveShown(index)}
      >
        <li className="insert-item-box">
          <div>
            <i className="glyphicon glyphicon-plus-sign" />
          </div>
        </li>
      </OverlayTrigger>
    );
  }

  /** 描画 */
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
      questionEls.push(<QuestionInFlow key={key} node={node} page={page} question={question} />);
      questionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });
    const pageTitle = state.calcPageLabel(page.getId());
    return (
      <NodeInFlow node={node} nodeLabel={pageTitle}>
        <ul className="questions">{questionEls}</ul>
      </NodeInFlow>
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
)(PageInFlow);
