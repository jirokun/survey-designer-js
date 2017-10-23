/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ANSWER_NOT_POSTED, ANSWER_POSTED_SUCCESS, ANSWER_POSTED_FAILED, ANSWER_POSTING } from '../../constants/states';
import * as Actions from '../actions';

/** 回答完了画面。この画面を表示したときに回答データをサーバにpostする */
class Finisher extends Component {
  componentDidMount() {
    const { updatePostAnswerStatus, doNotPostAnswers } = this.props;
    if (doNotPostAnswers) {
      // postAnswerしないときはすぐにANSWER_POSTED_SUCCESSにする
      updatePostAnswerStatus(ANSWER_POSTED_SUCCESS);
      return;
    }
    this.executePostAnswer();
  }

  /** 回答をpostする。forceが指定された場合は、postAnswerStatusに関わらず送信する */
  executePostAnswer(force) {
    const { survey, runtime, options, finisher, asyncPostAnswer } = this.props;
    const postAnswerStatus = runtime.getPostAnswerStatus();
    if (!force && postAnswerStatus !== ANSWER_NOT_POSTED) return;

    asyncPostAnswer(survey, finisher, runtime.getAnswers().toJS(), finisher.isComplete(), options);
  }

  /** 確認用に回答データをDLできるフォームを作成する */
  createAnswerDownloadForm() {
    const { survey, runtime, options, finisher, showAnswerDownloadLink } = this.props;
    if (!showAnswerDownloadLink) return null;

    const extraPostParameters = options.getExtraPostParameters().toJS();
    const answers = JSON.stringify(Object.assign(runtime.getAnswers().toJS(), extraPostParameters));

    return (
      <form action={options.getPreviewDownloadUrl()} method="POST" className="notice">
        <input type="hidden" name="survey" value={JSON.stringify(survey)} />
        <input type="hidden" name="output_definitions" value={JSON.stringify(survey.getAllOutputDefinitions())} />
        <input type="hidden" name="answers" value={answers} />
        <input type="hidden" name="is_complete" value={finisher.isComplete()} />
        <button type="submit">回答のDL</button>
      </form>
    );
  }

  render() {
    const { survey, runtime, finisher } = this.props;
    const postAnswerStatus = runtime.getPostAnswerStatus();
    const replacer = survey.getReplacer();
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
      <div className="finisher" id={finisher.getId()}>
        <div className="notice" dangerouslySetInnerHTML={{ __html: replacer.id2Span(finisher.getHtml()) }} />
        <div className="formButtons">
          <a href="javascript:window.close();">閉じる</a>
        </div>
        {this.createAnswerDownloadForm()}
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});
const actionsToProps = dispatch => ({
  updatePostAnswerStatus: type => dispatch(Actions.updatePostAnswerStatus(type)),
  asyncPostAnswer: (survey, finisher, answers, isComplete, options) =>
    Actions.asyncPostAnswer(dispatch, survey, finisher, answers, isComplete, options),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Finisher);
