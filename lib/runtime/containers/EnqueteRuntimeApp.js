/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import _ from 'underscore';
import classNames from 'classnames';
import Raven from 'raven-js';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import '../../jquery.plugins';
import Page from '../components/Page';
import Finisher from '../components/Finisher';
import PhotoSwipePart from '../components/parts/PhotoSwipePart';
import SurveyManager from '../SurveyManager';
import * as Actions from '../actions';
import { fixIphoneChromeBug, isDevelopment, setDevId } from '../../utils';
import NumericInput from '../components/plain/NumericInput';
import Matrix from '../components/plain/Matrix';
import Schedule from '../components/plain/Schedule';

/** アンケートのランタイムコンテナ */
class EnqueteRuntimeApp extends Component {
  constructor(props) {
    super(props);

    const { survey, options, changeAnswers } = props;
    this.surveyManager = new SurveyManager(survey, changeAnswers);

    if (options.isExposeSurveyJS()) {
      const exposeName = options.isExposeSurveyJS() === true ? 'SurveyJS' : options.isExposeSurveyJS();
      window[exposeName] = this.surveyManager;
    }

    this.bindedHandleWindowErrorEvent = this.handleWindowErrorEvent.bind(this);
  }

  componentDidMount() {
    // Reactを使わないコンポーネントを定義する
    new NumericInput(this.rootEl).initialize();
    new Matrix(this.rootEl).initialize();
    new Schedule(this.rootEl).initialize();

    this.callPageLoadedFunction();
    fixIphoneChromeBug();

    // リソース読み込みエラーを検知する
    window.addEventListener('error', this.bindedHandleWindowErrorEvent, true);
  }

  componentDidUpdate(prevProps) {
    const { runtime, survey } = this.props;
    if (isDevelopment()) setDevId(this.rootEl, survey);
    if (prevProps.runtime.getCurrentNodeId() !== runtime.getCurrentNodeId()) {
      this.callPageLoadedFunction();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.bindedHandleWindowErrorEvent, true);
  }

  /** リソース読み込みエラーを検知する */
  handleWindowErrorEvent(e) {
    const { survey, runtime } = this.props;
    const currentNode = runtime.findCurrentNode(survey);

    // srcのあるelement以外は何もしない
    if (!e || !e.target || !e.target.src) return;

    const tags = {};
    if (currentNode.isPage()) {
      const page = runtime.findCurrentPage(survey);
      tags.pageId = page.getId();
      tags.pageNo = survey.calcPageNo(page.getId());
    } else if (currentNode.isFinisher()) {
      const finisher = runtime.findCurrentFinisher(survey);
      tags.finisherId = finisher.getId();
      tags.finisherNo = survey.calcFinisherNo(finisher.getId());
    }

    Raven.captureMessage('リソースの読み込みに失敗しました', {
      level: 'error',
      tags,
      extra: {
        url: e.target.src,
      },
    });
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
    const {
       survey,
       runtime,
       options,
       doNotPostAnswers,
       doNotTransition,
       doNotExecuteJavaScript,
       doNotValidate,
       showEditModeMessage,
       showAnswerDownloadLink,
     } = this.props;
    const currentNode = runtime.findCurrentNode(survey);
    const showPageNo = options.isShowPageNo();

    if (currentNode === null) {
      return <div>指定のページがありません</div>;
    } else if (currentNode.isPage()) {
      const page = runtime.findCurrentPage(survey);
      return (
        <div>
          <div className={classNames('page-no', { hidden: !showPageNo })} data-dev-id-label={page.getDevId()}>
            ページ {survey.calcPageNo(page.getId())}
          </div>
          <Page
            key={page.getId()}
            page={page}
            surveyManager={this.surveyManager}
            doNotTransition={doNotTransition}
            doNotExecuteJavaScript={doNotExecuteJavaScript}
            doNotValidate={doNotValidate}
            showEditModeMessage={showEditModeMessage}
          />
        </div>
      );
    } else if (currentNode.isBranch()) {
      return <div>分岐は表示できません</div>;
    } else if (currentNode.isFinisher()) {
      const finisher = runtime.findCurrentFinisher(survey);
      return (
        <div>
          <div className={classNames('finisher-no', { hidden: !showPageNo })}>終了 {survey.calcFinisherNo(finisher.getId())} {finisher.isComplete() ? 'COMPLETE' : 'SCREEN'}</div>
          <Finisher
            finisher={finisher}
            doNotPostAnswers={doNotPostAnswers}
            showAnswerDownloadLink={showAnswerDownloadLink}
          />
        </div>
      );
    }
    throw new Error(`不明なnodeTypeです。type: ${currentNode.getType()}`);
  }

  render() {
    const { survey } = this.props;
    return (
      <div ref={(el) => { this.rootEl = el || this.rootEl; }}>
        <div id="content">
          <div id="surveyBox">
            <h1>{survey.getTitle()}</h1>
          </div>
          <div className="questionsEditBox">
            {this.createNode()}
          </div>
        </div>
        <PhotoSwipePart />
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
  changeAnswers: answers => dispatch(Actions.changeAnswers(answers)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnqueteRuntimeApp);
