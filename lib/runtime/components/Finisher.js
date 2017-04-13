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
    const { runtime, options, finisher, asyncPostAnswer } = this.props;
    const postAnswerStatus = runtime.getPostAnswerStatus();
    if (!force && postAnswerStatus !== ANSWER_NOT_POSTED) return;

    const postAnswerUrl = options.getPostAnswerUrl();
    const extraPostParameters = options.getExtraPostParameters().toJS();
    asyncPostAnswer(postAnswerUrl, runtime.getAnswers().toJS(), finisher.isComplete(), extraPostParameters);
  }

  /** 確認用に回答データをDLできるフォームを作成する */
  createAnswerDownloadForm() {
    const { survey, runtime, options, finisher, showAnswerDownloadLink } = this.props;
    if (!showAnswerDownloadLink) return null;

    const previewDownloadUrl = options.getPreviewDownloadUrl();
    const answers = runtime.getAnswers().toJS();
    const extraPostParameters = options.getExtraPostParameters().toJS();
    const doc = JSON.stringify(survey);
    const outputDefinitions = JSON.stringify(survey.getAllOutputDefinitions());
    const value = JSON.stringify(Object.assign(answers, extraPostParameters));
    return (
      <form action={previewDownloadUrl} method="POST" className="notice">
        <input type="hidden" name="_doc" value={doc} />
        <input type="hidden" name="output_definitions" value={outputDefinitions} />
        <input type="hidden" name="value" value={value} />
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
      <div className="finisher">
        <div className="notice" dangerouslySetInnerHTML={{ __html: replacer.id2Value(finisher.getHtml()) }} />
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
  asyncPostAnswer: (postUrl, answers, isComplete, extraPostParameters) =>
    Actions.asyncPostAnswer(dispatch, postUrl, answers, isComplete, extraPostParameters),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Finisher);
