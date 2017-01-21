import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Actions from '../../actions';

class PageInGraph extends Component {
  constructor() {
    super();

    this.addQuestionPopover = (
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
  }

  onPageSelect(flow) {
    const { selectFlow } = this.props;
    selectFlow(flow.getId());
  }

  createInsertElement(key) {
    return (
      <li key={key} className="insert-item-box">
        <div>
          <OverlayTrigger trigger="click" rootClose placement="right" overlay={this.addQuestionPopover}>
            <i className="glyphicon glyphicon-plus-sign" />
          </OverlayTrigger>
        </div>
      </li>
    );
  }

  render() {
    const { state, flow } = this.props;
    const page = state.findPageFromFlow(flow.getId());
    const questionEls = [];
    const questions = page.getQuestions();
    questions.forEach((question, i) => {
      const title = question.get('title');
      const key = `${this.constructor.name}_${page.getId()}_${question.getId()}`;
      if (i === 0) {
        questionEls.push(this.createInsertElement(`${key}_insert_${i}`));
      }
      questionEls.push(<li key={key} className="question"><button className="btn btn-info btn-xs">編集</button> {title}</li>);
      questionEls.push(this.createInsertElement(`${key}_insert_${i + 1}`));
    });
    const pageTitle = page.get('title');
    return (
      <div className="page" onClick={() => this.onPageSelect(flow)}>
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
  selectFlow: flowId => dispatch(Actions.selectFlow(flowId)),
  removeFlow: flowId => dispatch(Actions.removeFlow(flowId)),
  addPageFlow: (x, y) => dispatch(Actions.addPageFlow(x, y)),
  addBranchFlow: (x, y) => dispatch(Actions.addBranchFlow(x, y)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PageInGraph);
