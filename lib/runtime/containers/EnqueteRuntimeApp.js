/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import _ from 'underscore';
import classNames from 'classnames';
import Raven from 'raven-js';
import queryString from 'query-string';
import 'parsleyjs';
import 'parsleyjs/src/extra/validator/comparison';
import 'parsleyjs/dist/i18n/ja';
import 'parsleyjs/dist/i18n/ja.extra';
import 'tooltipster';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import '../../jquery.plugins';
import Page from '../components/Page';
import Finisher from '../components/Finisher';
import PhotoSwipePart from '../components/parts/PhotoSwipePart';
import SurveyManager from '../SurveyManager';
import * as Actions from '../actions';
import { fixIphoneChromeBug, isDevelopment, setDevId, appendUrlParams } from '../../utils';
import NumericInput from '../components/plain/NumericInput';
import PersonalInfoJS from '../components/plain/PersonalInfoJS';

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
    const { survey } = this.props;

    // Reactを使わないコンポーネントを定義する
    new NumericInput(this.rootEl).initialize();
    new PersonalInfoJS(this.rootEl, survey).initialize();

    this.callPageLoadedFunction();
    fixIphoneChromeBug();

    const params = queryString.parse(location.search);
    if (params.nodeId) {
      // nodeIdが指定されていれば復元する
      this.restoreHistory(null, true);
    } else {
      // nodeIdが指定されていなければ最初のページをhistoryに登録する
      this.changeHistory(this.props.runtime.getCurrentNodeId(), window.history.replaceState);
    }

    // リソース読み込みエラーを検知する
    window.addEventListener('error', this.bindedHandleWindowErrorEvent, true);

    if (this.props.options.isUseBrowserHistory()) {
      window.addEventListener('popstate', (e) => {
        this.restoreHistory(e.state, true);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { runtime, survey } = this.props;
    if (isDevelopment()) setDevId(this.rootEl, survey);
    const currentNodeId = runtime.getCurrentNodeId();
    if (prevProps.runtime.getCurrentNodeId() !== currentNodeId) {
      this.callPageLoadedFunction();
      this.changeHistory(this.props.runtime.getCurrentNodeId(), window.history.pushState);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.bindedHandleWindowErrorEvent, true);
  }

  changeHistory(nodeId, method) {
    if (!this.props.options.isUseBrowserHistory()) return;
    if (this.doNotCallChangeHistory) {
      this.doNotCallChangeHistory = false;
      return;
    }
    const { runtime } = this.props;
    const params = queryString.parse(location.search);
    params.nodeId = nodeId;
    const answers = runtime.getAnswers().toJS();
    method.call(window.history, { answers }, null, `${location.pathname}?${queryString.stringify(params)}`);
  }

  restoreHistory(state = null, doNotCallChangeHistory = false) {
    if (!this.props.options.isUseBrowserHistory()) return;
    const { changeCurrentNodeId, replaceAnswers } = this.props;
    const params = queryString.parse(location.search);
    this.doNotCallChangeHistory = doNotCallChangeHistory;
    changeCurrentNodeId(params.nodeId);
    const answers = (state && state.answers) || {};
    replaceAnswers(answers);
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
       view,
       doNotPostAnswers,
       doNotTransition,
       doNotExecuteJavaScript,
       doNotValidate,
       showEditModeMessage,
       showAnswerDownloadLink,
       changeAnswers,
       nextPage,
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
            view={view}
            survey={survey}
            options={options}
            runtime={runtime}
            surveyManager={this.surveyManager}
            doNotTransition={doNotTransition}
            doNotExecuteJavaScript={doNotExecuteJavaScript}
            doNotValidate={doNotValidate}
            showEditModeMessage={showEditModeMessage}
            changeAnswers={changeAnswers}
            nextPage={nextPage}
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
    const { survey, options } = this.props;
    const headerHtml = options.getHeaderHtml();
    return (
      <div ref={(el) => { this.rootEl = el || this.rootEl; }}>
        {survey.getCssRuntimeUrls().toArray().map(url => <link key={url} type="text/css" rel="stylesheet" href={appendUrlParams(url, options.getCacheSuffix())} />)}
        { headerHtml ? <div className="survey-header" dangerouslySetInnerHTML={{ __html: headerHtml }} /> : null }
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
  replaceAnswers: answers => dispatch(Actions.replaceAnswers(answers)),
  changeCurrentNodeId: nodeId => dispatch(Actions.changeCurrentNodeId(nodeId)),
  restart: () => dispatch(Actions.restart()),
  nextPage: () => dispatch(Actions.nextPage()),
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnqueteRuntimeApp);
