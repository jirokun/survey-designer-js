/* eslint-env browser */
import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import $ from 'jquery';
import S from 'string';
import { animateScroll } from 'react-scroll';
import 'parsleyjs';
import 'parsleyjs/src/extra/validator/comparison';
import 'parsleyjs/dist/i18n/ja';
import 'parsleyjs/dist/i18n/ja.extra';
import 'tooltipster';
import { findQuestionClass } from '../components/questions/Questions';
import * as Actions from '../actions';
import makeErrorHandler from '../../errorUtil';
import PageManager from '../PageManager';
import PageDetail from './parts/PageDetail';

class Page extends Component {
  constructor(props) {
    super(props);
    this.pageManager = new PageManager();
    this.state = {
      hasErrorOccured: false,
    };
  }

  componentDidMount() {
    this.evaluateJavaScript();
    this.parsley();
  }

  /** Reactのライフサイクルメソッド */
  componentWillReceiveProps(nextProps) {
    const nextPage = nextProps.page;
    const currentPage = this.props.page;
    if (nextPage.getId() !== currentPage.getId()) {
      const { survey, page } = this.props;
      this.pageManager.firePageUnload(survey, page);
    }
  }

  /** Reactのライフサイクルメソッド */
  componentDidUpdate(prevProps) {
    const prevPage = prevProps.page;
    const currentPage = this.props.page;
    if (prevPage.getId() !== currentPage.getId()) {
      this.evaluateJavaScript();
    }
  }

  /** 入力値を取得する。validation済みであることを期待している */
  getAnswers() {
    const formElements = Array.prototype.slice.call(this.pageEl.querySelectorAll('input,textarea,select'));
    const answers = {};
    // ユーザの入力値
    formElements.forEach((el) => {
      if (S(el.name).isEmpty()) return; // name属性が定義されていない場合は値を格納しない
      if (el.disabled) return; // disabledの場合は値を格納しない
      if (el.type === 'checkbox') {
        if (answers[el.name] !== undefined) throw new Error(`タグのname属性が重複しています。name: ${el.name}`);
        answers[el.name] = el.checked ? el.value : '';
      } else if (el.type === 'radio') {
        if (!el.checked) return; // 選択されていない項目の値は格納しない
        if (answers[el.name] !== undefined) throw new Error(`タグのname属性が重複しています。name: ${el.name}`);
        answers[el.name] = el.value;
      } else {
        if (answers[el.name] !== undefined) throw new Error(`タグのname属性が重複しています。name: ${el.name}`);
        answers[el.name] = el.value;
      }
    });
    return answers;
  }

  handleClickNext() {
    const { options, runtime, survey, page, submitPage, doNotTransition, showEditModeMessage } = this.props;

    // doNotTransitionが指定されていたらなにも実行しない
    if (doNotTransition) return;

    // validationに失敗したら次のページに行かない
    if (!this.$parsley.validate()) return;

    const answers = runtime.getAnswers().toJS();
    // namesに対応する値を取得
    const pageAnswers = this.getAnswers();
    const mergedAnswers = Object.assign({}, answers, pageAnswers);
    this.pageManager.fireValidate(survey, page, mergedAnswers)
      .then((results) => {
        const flatResults = Array.prototype.concat.apply([], results).filter(v => v !== undefined && v !== null);
        if (
          flatResults === undefined ||
          flatResults === null ||
          (Array.isArray(flatResults) && flatResults.length === 0)
        ) {
          // validateの結果が問題ない場合
          // ロジック変数の評価
          const allOutputDefinitionMap = survey.getAllOutputDefinitionMap();
          const logicalVariableResults = page.evaluateLogicalVariable(allOutputDefinitionMap, mergedAnswers);
          submitPage(Object.assign(pageAnswers, logicalVariableResults));
          animateScroll.scrollToTop({
            smooth: true,
            duration: 100,
          });
          return;
        }
        const message = Array.isArray(flatResults) ? flatResults.join('\n') : flatResults.toString();
        this.pageManager.showMessage(message);
      }).catch((reason) => {
        console.error(reason);
        if (showEditModeMessage === true) {
          this.pageManager.showMessage('アンケートの設定が正しくありません。\nアンケートのバリデーションを行い正しく設定されているかを確認してください');
        } else {
          const msg = 'アンケート回答中にエラーが発生しました。';
          this.pageManager.showMessage(msg);
          makeErrorHandler(options.getErrorHandlerUrl)(`${msg} pageId=${page.getId()}`);
        }
      });
  }

  parsley() {
    const { options } = this.props;
    // showDetailのときはparsleyを有効にしない
    if (options.isShowDetail()) return;
    this.$parsley = $(this.pageEl).parsley();
  }

  // JavaScriptを評価する
  evaluateJavaScript() {
    const { options, survey, page, runtime, showEditModeMessage, doNotExecuteJavaScript } = this.props;
    if (doNotExecuteJavaScript) return;

    const javaScriptCode = page.getJavaScriptCode();
    this.pageManager.init();
    if (S(javaScriptCode).isEmpty()) return;

    const ownerDoc = this.pageEl.ownerDocument;

    try {
      new Function('$', 'document', 'pageManager', javaScriptCode)($, ownerDoc, this.pageManager);
      this.pageManager.firePageLoad(survey, page, runtime.getAnswers().toJS());
    } catch (e) {
      console.error(e);
      this.setState({ hasErrorOccured: true });
      if (showEditModeMessage === true) {
        this.pageManager.showMessage('このページに設定されているJavaScriptの実行に失敗しました。\nJavaScriptを見直してください');
      } else {
        const msg = 'システムエラーが発生しました。ブラウザを再読込し再度アクセスください。';
        this.pageManager.showMessage(msg);
        makeErrorHandler(options.getErrorHandlerUrl)(`${e} pageId=${page.getId()}`);
      }
    }
  }

  createQuestions() {
    const { survey, page } = this.props;
    if (!page.questions) {
      return null;
    }
    return page.questions.map((q, index) => {
      const component = findQuestionClass(q.getDataType());
      const key = `${page.id}_${index + 1}`;
      const props = { id: key, question: q, page, replacer: survey.getReplacer() };
      return <div className="question questionBox" key={key}>{ React.createElement(component, props) }</div>;
    });
  }

  createPageDetail() {
    const { options, page } = this.props;
    if (!options.isShowDetail()) return null;

    return <PageDetail page={page} />;
  }

  createButtons() {
    const { options } = this.props;
    if (options.isShowDetail()) return null;
    return (
      <div className="formButtons">
        <button
          type="button"
          className={classNames({ invisible: this.state.hasErrorOccured })}
          onClick={() => this.handleClickNext()}
        >進む</button>
        <div className="response-warning">
          <p>※回答中に回答数が規定数に達し、回答が受け付けられないことがありますのでご了承ください。</p>
          <p>※回答中にブラウザを閉じた場合、最初から回答をやりなおしとなりますのでご注意ください。</p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <form ref={(el) => { this.pageEl = el; }} className="page questionsBox" data-parsley-excluded="[disabled=disabled]">
        { this.createQuestions() }
        { this.createPageDetail() }
        { this.createButtons() }
      </form>
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
  submitPage: pageAnswers => dispatch(Actions.submitPage(pageAnswers)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Page);
