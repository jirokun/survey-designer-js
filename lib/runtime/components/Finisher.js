import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as C from '../../constants';
import * as Actions from '../actions';

class Finisher extends Component {
  componentDidMount() {
    const { state, finisher, noPostAnswer, updatePostStatus, postAnswer } = this.props;
    if (!postAnswer) {
      // postAnswerしないときはすぐにANSWER_POSTED_SUCCESSにする
      updatePostStatus(C.ANSWER_POSTED_SUCCESS);
      return;
    }
    if (this.state.getPostAnswerStatus() !== C.ANSWER_NOT_POSTED) return;
    const postAnswerUrl = state.getOptions().getPostAnswerUrl();
    postAnswer(postAnswerUrl, state.getAnswers().toJS(), finisher.isComplete());
  }

  render() {
    const { state, finisher } = this.props;
    const postAnswerStatus = state.getRuntime().getPostAnswerStatus();
    if (postAnswerStatus === C.ANSWER_NOT_POSTED || postAnswerStatus === C.ANSWER_POSTING) {
      return <div className="notice">回答を登録しています</div>;
    }
    return (
      <div className="notice" dangerouslySetInnerHTML={{ __html: finisher.getHtml() }} />
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  updatePostStatus: type => dispatch(Actions.updatePostStatus(type)),
  postAnswer: (postUrl, answers, isComplete) => Actions.submitPage(dispatch, postUrl, answers, isComplete),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Finisher);
