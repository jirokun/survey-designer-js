import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../components/Page';
import Finisher from '../components/Finisher';
import plainComponents from '../../plainComponents';

/** アンケートのランタイムコンテナ */
class EnqueteRuntimeApp extends Component {
  componentDidMount() {
    // Reactを使わないコンポーネントを定義する
    plainComponents(this.rootEl);
    this.callPageLoadedFunction();
  }

  componentDidUpdate(prevProps) {
    const { runtime } = this.props;
    if (prevProps.runtime.getCurrentNodeId() !== runtime.getCurrentNodeId()) {
      this.callPageLoadedFunction();
    }
  }

  /** optionsに指定されたpageLoadedFnを呼び出す */
  callPageLoadedFunction() {
    const { survey, options, runtime } = this.props;
    const pageLoadedFn = options.getPageLoadedFn();
    if (!pageLoadedFn) return;
    pageLoadedFn(survey, runtime);
  }

  /** nodeを描画 */
  createNode() {
    const { survey, runtime, doNotPostAnswers, doNotTransition, showEditModeMessage, showAnswerDownloadLink } = this.props;
    const currentNode = runtime.findCurrentNode(survey);

    if (currentNode === null) {
      return <div>指定のページがありません</div>;
    } else if (currentNode.isPage()) {
      return <Page page={runtime.findCurrentPage(survey)} doNotTransition={doNotTransition} showEditModeMessage={showEditModeMessage} />;
    } else if (currentNode.isBranch()) {
      return <div>分岐は表示できません</div>;
    } else if (currentNode.isFinisher()) {
      return (
        <Finisher
          finisher={runtime.findCurrentFinisher(survey)}
          doNotPostAnswers={doNotPostAnswers}
          showAnswerDownloadLink={showAnswerDownloadLink}
        />
      );
    }
    throw new Error(`不明なnodeTypeです。type: ${currentNode.getType()}`);
  }

  render() {
    const { survey } = this.props;
    return (
      <div ref={(el) => { this.rootEl = el; }}>
        <div id="content">
          <div id="surveyBox">
            <h1>{survey.getTitle()}</h1>
          </div>
          <div className="questionsEditBox">
            {this.createNode()}
          </div>
        </div>
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

export default connect(
  stateToProps,
)(EnqueteRuntimeApp);
