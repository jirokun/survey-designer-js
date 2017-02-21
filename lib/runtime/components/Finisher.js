import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as C from '../../constants';
import * as Actions from '../actions';

/** 回答完了画面。この画面を表示したときに回答データをサーバにpostする */
class Finisher extends Component {
  componentDidMount() {
    const { updatePostAnswerStatus, noPostAnswer } = this.props;
    if (noPostAnswer) {
      // postAnswerしないときはすぐにANSWER_POSTED_SUCCESSにする
      updatePostAnswerStatus(C.ANSWER_POSTED_SUCCESS);
      return;
    }
    this.executePostAnswer();
  }

  /** 回答をpostする。forceが指定された場合は、postAnswerStatusに関わらず送信する */
  executePostAnswer(force) {
    const { state, finisher, postAnswer } = this.props;
    const postAnswerStatus = state.getRuntime().getPostAnswerStatus();
    if (!force && postAnswerStatus !== C.ANSWER_NOT_POSTED) return;
    const postAnswerUrl = state.getOptions().getPostAnswerUrl();
    const options = state.getOptions();
    const extraPostParameters = options.getExtraPostParameters().toJS();
    postAnswer(postAnswerUrl, state.getAnswers().toJS(), finisher.isComplete(), extraPostParameters);
  }

  render() {
    const { state, finisher } = this.props;
    const postAnswerStatus = state.getRuntime().getPostAnswerStatus();
    if (postAnswerStatus === C.ANSWER_NOT_POSTED || postAnswerStatus === C.ANSWER_POSTING) {
      return <div className="notice">回答を登録しています</div>;
    }
    if (postAnswerStatus === C.ANSWER_POSTED_FAILED) {
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
  postAnswer: (postUrl, answers, isComplete, extraPostParameters) =>
    Actions.postAnswer(dispatch, postUrl, answers, isComplete, extraPostParameters),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Finisher);
