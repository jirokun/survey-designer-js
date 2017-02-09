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
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('SingleTextQuestion')} block>1行テキスト</Button>
        <Button bsSize="small" bsStyle="info" onClick={() => this.handleAddQuestion('TextQuestion')} block>複数行テキスト</Button>
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
      const questionNo = state.calcQuestionNo(page.getId(), question.getId());
      const title = `${questionNo}. ${question.getPlainTitle()}`;
      const key = `${this.constructor.name}_${page.getId()}_${question.getId()}`;
      if (i === 0) {
        questionEls.push(this.createInsertElement(`${key}_insert_${i}`, i));
      }
      questionEls.push(<li key={key} className="question"><button className="btn btn-info btn-xs">編集</button> {title}</li>);
      questionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`, i + 1));
    });
    const pageTitle = state.calcPageLabel(page.getId());
    return (
      <div className="page" onClick={() => this.onPageSelect(node)}>
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
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
  removeNode: nodeId => dispatch(Actions.removeNode(nodeId)),
  addPageNode: (x, y) => dispatch(Actions.addPageNode(x, y)),
  addBranchNode: (x, y) => dispatch(Actions.addBranchNode(x, y)),
  addQuestion: (questionClassName, pageId, index) => dispatch(Actions.addQuestion(questionClassName, pageId, index)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PageInGraph);
