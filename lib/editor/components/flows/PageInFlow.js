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
    const { survey, removeQuestion, node } = this.props;
    const page = survey.findPageFromNode(node.getId());
    removeQuestion(page.getId(), questionId);
  }

  /** popoverを表示する前に実行するメソッド */
  handleBeforePopoerveShown(popoverIndex) {
    // どのindexでpopoverが表示されるかをstateに格納
    this.setState({ popoverIndex });
  }

  // ページへのアイテム追加ボタンを押したときに表示されるポップアップ
  createQuestionPopover() {
    const { survey, node, addQuestion } = this.props;
    const { popoverIndex } = this.state;
    const pageId = survey.findPageFromNode(node.getId()).getId();

    const questions = [
      { dataType: 'Checkbox', label: '複数選択肢' },
      { dataType: 'Radio', label: '単一選択肢' },
      { dataType: 'MultiNumber', label: '数値記入' },
      { dataType: 'SingleText', label: '1行テキスト' },
      { dataType: 'Text', label: '複数行テキスト' },
      { dataType: 'Matrix', label: '表形式' },
      { dataType: 'Description', label: '説明文' },
      { dataType: 'ScreeningAgreement', label: '調査許諾' },
      { dataType: 'Schedule', label: '日程' },
      { dataType: 'PersonalInfo', label: '個人情報' },
    ];

    return (
      <Popover id="popover-positioned-right" title="ページへのアイテム追加">
        {questions.map(question => (
          <Button
            key={`${this.constructor.name}_${question.dataType}`}
            bsSize="small"
            bsStyle="default"
            onClick={() => addQuestion(question.dataType, pageId, popoverIndex)}
            block
          >
            {question.label}
          </Button>
        ))}
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
    const { survey, node } = this.props;
    const page = survey.findPageFromNode(node.getId());
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
    const pageTitle = survey.calcPageLabel(page.getId());
    return (
      <NodeInFlow node={node} nodeLabel={pageTitle}>
        <ul className="questions">{questionEls}</ul>
      </NodeInFlow>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
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
