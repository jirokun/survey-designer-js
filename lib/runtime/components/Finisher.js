import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ANSWER_NOT_POSTED, ANSWER_POSTED_SUCCESS, ANSWER_POSTED_FAILED, ANSWER_POSTING } from '../../constants/states';
import * as Actions from '../actions';

/** 回答完了画面。この画面を表示したときに回答データをサーバにpostする */
class Finisher extends Component {
  componentDidMount() {
    const { updatePostAnswerStatus, noPostAnswer } = this.props;
    if (noPostAnswer) {
      // postAnswerしないときはすぐにANSWER_POSTED_SUCCESSにする
      updatePostAnswerStatus(ANSWER_POSTED_SUCCESS);
      return;
    }
    this.executePostAnswer();
  }

  /** 回答をpostする。forceが指定された場合は、postAnswerStatusに関わらず送信する */
  executePostAnswer(force) {
    const { state, finisher, asyncPostAnswer } = this.props;
    const postAnswerStatus = state.getRuntime().getPostAnswerStatus();
    if (!force && postAnswerStatus !== ANSWER_NOT_POSTED) return;

    const options = state.getOptions();
    const postAnswerUrl = options.getPostAnswerUrl();
    const extraPostParameters = options.getExtraPostParameters().toJS();
    asyncPostAnswer(postAnswerUrl, state.getAnswers().toJS(), finisher.isComplete(), extraPostParameters);
  }

  render() {
    const { state, finisher } = this.props;
    const postAnswerStatus = state.getRuntime().getPostAnswerStatus();
    if (postAnswerStatus === ANSWER_NOT_POSTED || postAnswerStatus === ANSWER_POSTING) {
      return <div className="notice">回答を登録しています</div>;
    }

    if (postAnswerStatus === ANSWER_POSTED_FAILED) {
      return (
        <div className="notice">回答の登録に失敗しました。<br />
          下記のボタンを押して再度回答を登録してください。<br />
          繰り返し回答の登録に失敗する場合はお問い合わせください。<br />
          <button type="button" onClick={() => this.executePostAnswer(true)}>回答の再登録</button>
        </div>
      );
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
  updatePostAnswerStatus: type => dispatch(Actions.updatePostAnswerStatus(type)),
  asyncPostAnswer: (postUrl, answers, isComplete, extraPostParameters) =>
    Actions.asyncPostAnswer(dispatch, postUrl, answers, isComplete, extraPostParameters),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Finisher);
