/* eslint-env browser */
import React, { Component } from 'react';
import Raven from 'raven-js';
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
import PageDetail from './parts/PageDetail';
import PageManager from '../PageManager';
import { showOutputNo, findEnabledFormElement } from '../../utils';

class Page extends Component {
  constructor(props) {
    super(props);
    this.pageManager = new PageManager();
    this.state = {
      hasErrorOccured: false,
    };
  }

  componentDidMount() {
    const { options, executeNextTick } = this.props;
    this.setCurrentPageAnswer();
    this.evaluateJavaScript(this.createSurveyJS());
    this.parsley();
    if (options.isShowOutputNo()) showOutputNo(this.pageEl);
    $(this.pageEl).on('change keyup', 'input,select,textarea', () => {
      // ChoiceQuestionBaseなどではReactのcontrolled componentで値を変更している
      // しかし、ブラウザによってはこちらのイベントの方が早く実行されてしまうため、期待した値にならない
      // そのため必ずReactのcontrolled comoponentの更新が先に実行されるようにsetTimeoutする
      executeNextTick(this.setCurrentPageAnswer.bind(this));
    });

    this.hideQuestionIfNoInputElements();
    this.skipPageIfNoInputElements();
  }

  /** Reactのライフサイクルメソッド */
  componentWillUnmount() {
    const { survey, page } = this.props;
    try {
      this.pageManager.firePageUnload(survey, page);
    } catch (e) {
      this.handleError(e);
    }
  }

  setCurrentPageAnswer() {
    const { survey, runtime, page } = this.props;
    const answers = runtime.getAnswers().toJS();

    // 現在のページの値を取得
    const pageAnswers = this.getAnswers();

    // ロジック変数も評価
    const mergedAnswers = Object.assign({}, answers, pageAnswers);
    const allOutputDefinitionMap = survey.getAllOutputDefinitionMap();
    const logicalVariableResults = page.evaluateLogicalVariable(allOutputDefinitionMap, mergedAnswers);
    Object.assign(pageAnswers, logicalVariableResults);

    this.props.changeCurrentPageAnswers(pageAnswers);
  }

  /** 入力値を取得する。validation済みであることを期待している */
  getAnswers() {
    const formElements = Array.prototype.slice.call(this.pageEl.querySelectorAll('input,textarea,select'));
    const answers = {};
    // ユーザの入力値
    formElements.forEach((el) => {
      if (S(el.name).isEmpty()) return; // name属性が定義されていない場合は値を格納しない
      if (el.type === 'checkbox') {
        if ($(el).is(':hidden')) return; // 要素が表示されていない場合は値を格納しない
        if (el.disabled) { // disabledの場合はチェックしていないとみなす
          answers[el.name] = '0';
        } else {
          if (answers[el.name] !== undefined) throw new Error(`タグのname属性が重複しています。name: ${el.name}`);
          answers[el.name] = el.checked ? el.value : '0';
        }
      } else if (el.type === 'radio') {
        if ($(el).is(':hidden')) return; // 要素が表示されていない場合は値を格納しない
        if (el.disabled) return; // disabledの場合は値を格納しない
        if (!el.checked) return; // 選択されていない項目の値は格納しない
        if (answers[el.name] !== undefined) throw new Error(`タグのname属性が重複しています。name: ${el.name}`);
        answers[el.name] = el.value;
      } else if (el.tagName.toLowerCase() === 'select') {
        if ($(el).is(':hidden')) return; // 要素が表示されていない場合は値を格納しない
        if (el.disabled) return; // disabledの場合は値を格納しない
        if (el.selectedIndex === 0) return; // 選択されていない項目の値は格納しない
        if (answers[el.name] !== undefined) throw new Error(`タグのname属性が重複しています。name: ${el.name}`);
        answers[el.name] = el.value;
      } else if (el.type === 'hidden') {
        // hiddenの場合は条件なしに登録する
        answers[el.name] = el.value;
      } else {
        if ($(el).is(':hidden')) return; // 要素が表示されていない場合は値を格納しない
        if (el.disabled) return; // disabledの場合は値を格納しない
        if (answers[el.name] !== undefined) throw new Error(`タグのname属性が重複しています。name: ${el.name}`);
        answers[el.name] = el.value;
      }
    });
    return answers;
  }

  /** SurveyJSを作成する */
  createSurveyJS() {
    const { options, surveyManager } = this.props;

    // SurveyJSの定義
    const SurveyJS = {
      surveyManager,
      pageManager: this.pageManager,
    };
    if (options.isExposeSurveyJS()) {
      const exposeName = options.isExposeSurveyJS() === true ? 'SurveyJS' : options.isExposeSurveyJS();
      window[exposeName] = SurveyJS;
    }
    return SurveyJS;
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleClickNext() {
    const { runtime, survey, surveyManager, page, submitPage, doNotTransition } = this.props;

    // doNotTransitionが指定されていたらなにも実行しない
    if (doNotTransition) return;

    // validationに失敗したら次のページに行かない
    if (!this.$parsley.validate()) return;

    const answers = runtime.getAnswers().toJS();
    // namesに対応する値を取得
    const pageAnswers = this.getAnswers();
    const mergedAnswers = Object.assign({}, answers, pageAnswers);
    surveyManager.refresh(mergedAnswers);
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
      }).catch((e) => {
        this.handleError(e);
      });
  }

  /** Question内に一つも設問がない場合には設問を非表示にする */
  hideQuestionIfNoInputElements() {
    $(this.pageEl).find('.questionBox').each((index, questionBoxEl) => {
      const $visibleElements = findEnabledFormElement(questionBoxEl);
      if ($visibleElements.length === 0) {
        $(questionBoxEl).hide();
      }
    });
  }

  /** 同ページに一つも設問がない場合にはスキップする */
  skipPageIfNoInputElements() {
    const $visibleElements = findEnabledFormElement(this.pageEl);
    if ($visibleElements.length === 0) {
      this.handleClickNext();
    }
  }

  parsley() {
    const { options, doNotValidate } = this.props;
    if (doNotValidate) return;
    // showDetailのときはparsleyを有効にしない
    if (options.isShowDetail()) return;
    this.$parsley = $(this.pageEl).parsley({
      // デフォルト値に:hiddenを加えている。非表示項目はvalidationしない
      excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], :hidden, :disabled',
      // parsley.jsのデフォルトgetValueではmultipleのvalidation時に非表示の値も取得してしまうため値の取得ロジックを変更
      value: (field) => {
        const $el = field.$element;
        if (field.__class__ === 'Field') { // 単項目チェックのときの値取得
          return $el.val();
        } else if (field.__class__ === 'FieldMultiple') { // multiple項目チェックのときの値取得
          const el = $el[0];
          // parsley.jsのmultiple.jsのgetValueを参考に作成
          if (el.nodeName === 'INPUT') {
            if (el.type === 'radio') {
              return field._findRelated().filter(':checked:visible:enabled').val() || '';
            }

            if (el.type === 'checkbox') {
              const values = [];

              field._findRelated().filter(':checked:visible:enabled').each((i, e) => {
                values.push($(e).val());
              });

              return values;
            }
          }

          if (el.nodeName === 'SELECT' && $el.val() === null) {
            return [];
          }
          throw new Error(`Unexpected form element nodeName:${el.nodeName} type:${el.type}`);
        } else {
          throw new Error(`Unexpected parsley field class ${field.__class__}`);
        }
      },
    });
  }

  /** エラーが発生したときはSentryにエラー内容を送る */
  handleError(e) {
    const { showEditModeMessage } = this.props;
    this.setState({ hasErrorOccured: true });
    console.error(e);
    if (showEditModeMessage === true) {
      this.pageManager.showMessage('このページに設定されているJavaScriptの実行に失敗しました。\nJavaScriptを見直してください');
    } else {
      this.pageManager.showMessage('システムエラーが発生しました。ブラウザを再読込し再度アクセスください。');
      Raven.captureException(e);
    }
  }

  // JavaScriptを評価する
  evaluateJavaScript(SurveyJS) {
    const { survey, page, runtime, surveyManager, doNotExecuteJavaScript } = this.props;
    if (doNotExecuteJavaScript) return;

    const javaScriptCode = page.getJavaScriptCode();
    this.pageManager.init();
    if (S(javaScriptCode).isEmpty()) return;

    const ownerDoc = this.pageEl.ownerDocument;

    try {
      new Function('$', 'document', 'SurveyJS', javaScriptCode)($, ownerDoc, SurveyJS);
      const answers = runtime.getAnswers().toJS();
      surveyManager.refresh(answers);
      this.pageManager.firePageLoad(survey, page, answers);
    } catch (e) {
      this.handleError(e);
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
      const currentPageAnswers = this.state.currentPageAnswers;
      const props = { id: key, question: q, page, replacer: survey.getReplacer(), currentPageAnswers };
      return <div className="question questionBox" key={key}>{ React.createElement(component, props) }</div>;
    });
  }

  createPageDetail() {
    const { options, page } = this.props;
    if (!options.isShowDetail()) return null;

    return <PageDetail page={page} />;
  }

  createButtons() {
    const { options, runtime } = this.props;
    if (options.isShowDetail()) return null;
    const disabled = runtime.isExecuting();

    return (
      <div className="formButtons">
        <button
          type="button"
          className={classNames({ invisible: this.state.hasErrorOccured })}
          disabled={disabled}
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
      <form ref={(el) => { this.pageEl = el || this.pageEl; }} className="page questionsBox" data-parsley-excluded="[disabled=disabled]" onSubmit={e => this.handleSubmit(e)}>
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
  changeCurrentPageAnswers: answers => dispatch(Actions.changeCurrentPageAnswers(answers)),
  executeNextTick: func => Actions.executeNextTick(dispatch, func),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Page);
