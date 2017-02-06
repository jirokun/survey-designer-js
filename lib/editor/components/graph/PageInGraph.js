import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover, Glyphicon } from 'react-bootstrap';
import * as Actions from '../../actions';

class PageInGraph extends Component {
  constructor() {
    super();

    this.addQuestionPopover = (
      <Popover id="popover-positioned-right" title="ページへのアイテム追加">
        <Button bsSize="small" bsStyle="info" block onClick={() => this.handleAddQuestion('CheckboxQuestion')}>複数選択肢</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('RadioQuestion')} block>単一選択肢</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('MultiNumberQuestion')} block>数値記入</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('dropdown')} block>ドロップダウン</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('matrix')} block>マトリクス</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('text')} block>1行テキスト</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('textarea')} block>複数行テキスト</Button>
        <Button bsSize="small" bsStyle="success" onClick={() => this.handleAddQuestion('checkbox')} block>テキスト</Button>
        <Button bsSize="small" bsStyle="success" onClick={() => this.handleAddQuestion('checkbox')} block>画像</Button>
      </Popover>
    );
  }

  onPageSelect(flow) {
    const { selectNode } = this.props;
    selectNode(flow.getId());
  }

  handleAddQuestion(questionClassName) {
    const { state, flow, addQuestion } = this.props;
    const page = state.findPageFromNode(flow.getId());
    addQuestion(questionClassName, page.getId(), this.overlayIndex);
  }

  handleRemovePage(e) {
    const { removeNode, flow } = this.props;
    e.stopPropagation();
    removeNode(flow.getId());
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
    const { state, flow } = this.props;
    const page = state.findPageFromNode(flow.getId());
    const questionEls = [];
    const questions = page.getQuestions();
    questions.forEach((question, i) => {
      const title = question.getPlainTitle();
      const key = `${this.constructor.name}_${page.getId()}_${question.getId()}`;
      if (i === 0) {
        questionEls.push(this.createInsertElement(`${key}_insert_${i}`, i));
      }
      questionEls.push(<li key={key} className="question"><button className="btn btn-info btn-xs">編集</button> {title}</li>);
      questionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });
    const pageTitle = page.getTitle();
    return (
      <div className="page" onClick={() => this.onPageSelect(flow)}>
        <div className="delete-button">
          <Glyphicon className="text-danger" glyph="minus-sign" onClick={e => this.handleRemovePage(e)} />
        </div>
        <div className="title">{pageTitle}</div>
        <ul className="questions">{questionEls}</ul>
      </div>
    );
  }
}

PageInGraph.propTypes = {
  state: PropTypes.object.isRequired,
};

const stateToProps = state => ({
  state,
});

const actionsToProps = dispatch => ({
  selectNode: flowId => dispatch(Actions.selectNode(flowId)),
  removeNode: flowId => dispatch(Actions.removeNode(flowId)),
  addPageNode: (x, y) => dispatch(Actions.addPageNode(x, y)),
  addBranchNode: (x, y) => dispatch(Actions.addBranchNode(x, y)),
  addQuestion: (questionClassName, pageId, index) => dispatch(Actions.addQuestion(questionClassName, pageId, index)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PageInGraph);
