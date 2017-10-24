/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Raven from 'raven-js';
import classNames from 'classnames';
import $ from 'jquery';
import S from 'string';
import { animateScroll } from 'react-scroll';
import { findQuestionClass } from '../components/questions/Questions';
import PageDetail from './parts/PageDetail';
import PageManager from '../PageManager';
import { findEnabledFormElement, setDevId } from '../../utils';
import BaseQuestionDefinition from '../models/survey/questions/internal/BaseQuestionDefinition';
import { EXCLUDED_OPTION } from '../../constants/parsleyConstants';
import ImagePopup from './plain/ImagePopup';
import NumberValidation from './plain/NumberValidation';
import ZeroSetting from './plain/ZeroSetting';
import Reprint from './plain/Reprint';
import CheckboxQuestionJS from './plain/CheckboxQuestionJS';
import RadioQuestionJS from './plain/RadioQuestionJS';
import SelectQuestionJS from './plain/SelectQuestionJS';
import MultiNumberQuestionJS from './plain/MultiNumberQuestionJS';
import MatrixQuestionJS from './plain/MatrixQuestionJS';
import ScheduleQuestionJS from './plain/ScheduleQuestionJS';

export default class Page extends Component {
  constructor(props) {
    super(props);

    this.pageManager = new PageManager(props.page);
    this.state = {
      hasErrorOccured: false,
    };
  }

  componentWillMount() {
    const { survey, runtime } = this.props;
    // Firefoxでは最初のページでreplacerが初期化されていないことがあるので、このタイミングで更新する
    survey.refreshReplacer(runtime.getAnswers().toJS());
  }

  componentDidMount() {
    const { survey } = this.props;
    const pageEl = ReactDOM.findDOMNode(this);
    setDevId(pageEl, survey); // dev-id を各要素セット

    this.convertCheckboxAndRadio();
    const SurveyJS = this.createSurveyJS();
    this.evaluateJavaScript(SurveyJS);
    this.initializePageComponent(SurveyJS);
    this.parsley(SurveyJS);
    // ユーザの行動をトレースする
    $(pageEl).on('change', this.handleChange.bind(this));

    this.hideQuestionIfNoInputElements();
    this.skipPageIfNoInputElements();
  }

  componentDidUpdate() {
    this.convertCheckboxAndRadio();
  }

  createRavenMessage(message) {
    return `${message}`;
  }

  createRavenFingerPrint() {
    const { survey, options, page } = this.props;
    return [survey.getId(), options.getUserId(), page.getId()];
  }

  componentWillUnmount() {
    for (const key in this.plainComponents) {
      if (!Object.prototype.hasOwnProperty.call(this.plainComponents, key)) continue;
      this.plainComponents[key].deInitialize();
    }
  }

  /** 入力値を取得する。validation済みであることを期待している */
  getAnswers() {
    const pageEl = ReactDOM.findDOMNode(this);
    const formElements = Array.prototype.slice.call(pageEl.querySelectorAll('input,textarea,select'));
    const answers = {};
    // ユーザの入力値
    formElements.forEach((el) => {
      if (S(el.name).isEmpty()) return; // name属性が定義されていない場合は値を格納しない
      if (el.type === 'checkbox') {
        if ($(el).is(':hidden')) return; // 要素が表示されていない場合は値を格納しない
        if (el.disabled) {
          // 集計のためcheckboxのdisabledの場合はチェックしていないとみなす。
          // 回答値を含めたくない場合には非表示にする必要がある。
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

  convertCheckboxAndRadio() {
    // 編集時のプレビューペインでは画面の表示が変わる毎にMatrixのcheckboxとradioの変換処理をかける必要があるため、ここで実行する。
    // 回答画面の場合はcomponentDidUpdateとcomponentDidMountの中で2度実行されるが、内部で再度変換しない仕様となっているので問題ない
    const { page } = this.props;
    const pageEl = ReactDOM.findDOMNode(this);
    page
      .getQuestions()
      .filter(question => question.getDataType() === 'Matrix')
      .forEach((question) => {
        MatrixQuestionJS.convertCheckboxAndRadio(question, pageEl);
      });
  }

  initializePageComponent(SurveyJS) {
    const { survey, runtime, options, page, doNotTransition } = this.props;

    this.plainComponents = {};
    if (options.isShowDetail() || doNotTransition) return;

    const pageEl = ReactDOM.findDOMNode(this);
    (this.plainComponents.imagePopup = new ImagePopup(pageEl)).initialize();
    (this.plainComponents.numberValidation = new NumberValidation(pageEl, survey, page, runtime)).initialize();
    (this.plainComponents.zeroSetting = new ZeroSetting(pageEl, survey, page, SurveyJS)).initialize();
    (this.plainComponents.reprint = new Reprint(pageEl, survey, page, runtime)).initialize();
    (this.plainComponents.checkboxQuestionJS = new CheckboxQuestionJS(pageEl, survey, page, runtime)).initialize();
    (this.plainComponents.radioQuestionJS = new RadioQuestionJS(pageEl, survey, page, runtime)).initialize();
    (this.plainComponents.selectQuestionJS = new SelectQuestionJS(pageEl, survey, page, runtime)).initialize();
    (this.plainComponents.multiNumberQuestionJS = new MultiNumberQuestionJS(pageEl, survey, page, runtime)).initialize();
    (this.plainComponents.matrixQuestionJS = new MatrixQuestionJS(pageEl, survey, page, runtime)).initialize();
    (this.plainComponents.scheduleQuestionJS = new ScheduleQuestionJS(pageEl, survey, page, runtime)).initialize();
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

  handleChange(e) {
    // 回答データをあとで取得できるように全てのchangeイベントをBreadcrumbに記録する。
    const $target = $(e.target);
    const name = $target.attr('name');
    const value = $target.attr('type') === 'checkbox' ? $target.prop('checked') : $target.val();
    const outputNo = $target.data('output-no');
    Raven.captureBreadcrumb({
      message: '入力値が変更されました',
      category: 'change',
      data: { name, value, outputNo },
    });
  }

  handleClickNext() {
    const { runtime, survey, surveyManager, page, nextPage, changeAnswers, doNotTransition } = this.props;

    // doNotTransitionが指定されていたらなにも実行しない
    if (doNotTransition) return;

    // validationに失敗したら次のページに行かない
    if (!this.$parsley.validate()) return;

    const pageEl = ReactDOM.findDOMNode(this);
    const answers = runtime.getAnswers().toJS();
    // namesに対応する値を取得
    const pageAnswers = this.getAnswers();

    // 回答データが登録されず、なおかつ説明文がQuestionにない場合にエラーとする
    // まずはエラーログだけを取得する
    const pageId = page.getId();
    const pageNo = survey.calcPageNo(pageId);
    if (Object.keys(pageAnswers).length === 0 && !page.getQuestions().find(q => q.getDataType() === 'Description')) {
      const pageHtml = pageEl ? pageEl.innerHTML : null;
      Raven.captureMessage(this.createRavenMessage('ページ内の回答データを取得できませんでした'), {
        level: 'error',
        tags: { pageId, pageNo },
        fingerprint: this.createRavenFingerPrint(),
        extra: {
          pageHtml,
          answers: runtime.getAnswers().toJS(),
        },
      });
    }

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
          const logicalVariableResults = page.evaluateLogicalVariable(survey, mergedAnswers);

          changeAnswers(Object.assign(pageAnswers, logicalVariableResults));
          // submitする前にpageUnloadを呼ぶ
          try {
            const answerForPageUnload = Object.assign({}, mergedAnswers, logicalVariableResults);
            surveyManager.refresh(answerForPageUnload);
            this.pageManager.firePageUnload(survey, page, answerForPageUnload);
          } catch (e) {
            this.handleError(e);
          }

          nextPage();
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
    const pageEl = ReactDOM.findDOMNode(this);
    $(pageEl).find('.questionBox').each((index, questionBoxEl) => {
      const $visibleElements = findEnabledFormElement(questionBoxEl);
      if ($visibleElements.length === 0) {
        $(questionBoxEl).hide();
      }
    });
  }

  /** 同ページに一つも設問がない場合にはスキップする */
  skipPageIfNoInputElements() {
    const { doNotTransition } = this.props;
    if (doNotTransition) return;

    const pageEl = ReactDOM.findDOMNode(this);
    const $visibleElements = findEnabledFormElement(pageEl);
    if ($visibleElements.length === 0) {
      const { nextPage } = this.props;
      nextPage();
    }
  }

  parsley(SurveyJS) {
    const { options, doNotValidate, doNotTransition } = this.props;
    if (doNotValidate || doNotTransition) return;
    // showDetailのときはparsleyを有効にしない
    if (options.isShowDetail()) return;
    const pageEl = ReactDOM.findDOMNode(this);
    this.$parsley = $(pageEl).parsley({
      // デフォルト値に:hiddenを加えている。非表示項目はvalidationしない
      excluded: EXCLUDED_OPTION,
      // parsley.jsのデフォルトgetValueではmultipleのvalidation時に非表示の値も取得してしまうため値の取得ロジックを変更
      SurveyJS,
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

    const pageEl = ReactDOM.findDOMNode(this);
    const ownerDoc = pageEl.ownerDocument;

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
    const { survey, page, options, runtime, view } = this.props;
    if (!page.questions) {
      return null;
    }

    if (page.isFreeMode()) {
      return <div className="questions" dangerouslySetInnerHTML={{ __html: survey.getReplacer().id2Span(page.getHtml()) }} />;
    }

    const questions = page.questions.map((q, index) => {
      const component = findQuestionClass(q.getDataType());
      const key = `${page.id}_${index + 1}`;
      const props = { id: key, question: q, page, replacer: survey.getReplacer(), survey, options, runtime, view };
      const questionNo = BaseQuestionDefinition.createOutputNo(
        survey.calcPageNo(page.getId()),
        survey.calcQuestionNo(page.getId(), q.getId()),
      );
      return <div className="question questionBox" key={key} data-question-no={questionNo}>{ React.createElement(component, props) }</div>;
    });
    return <div className="questions">{questions}</div>;
  }

  createPageDetail() {
    const { options, page } = this.props;
    if (!options.isShowDetail()) return null;

    return <PageDetail page={page} />;
  }

  createButtons() {
    const { options, hideButtons } = this.props;
    if (hideButtons || options.isShowDetail()) return null;
    return (
      <div className="formButtons">
        <button
          type="button"
          className={classNames('next-page', { invisible: this.state.hasErrorOccured })}
          onClick={() => this.handleClickNext()}
        >進む</button>
        <div className="response-warning">
          <p>※回答中にブラウザを閉じた場合、最初から回答をやりなおしとなりますのでご注意ください。</p>
        </div>
      </div>
    );
  }

  render() {
    const { page } = this.props;
    return (
      <form className="page questionsBox" data-parsley-excluded="[disabled=disabled]" onSubmit={e => this.handleSubmit(e)} id={page.getId()}>
        { this.createQuestions() }
        { this.createPageDetail() }
        { this.createButtons() }
      </form>
    );
  }
}
