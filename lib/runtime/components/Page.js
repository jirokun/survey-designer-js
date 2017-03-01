/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import S from 'string';
import Parsley from 'parsleyjs';
import ParsleyJa from 'parsleyjs/dist/i18n/ja.js';
import ParsleyJaExtra from 'parsleyjs/dist/i18n/ja.extra.js';
import Tooltipster from 'tooltipster';
import { findQuestionClass } from '../components/questions/Questions';
import * as Actions from '../actions';
import { findParentByClassName } from '../../utils';
import PageManager from '../PageManager';

class Page extends Component {
  constructor(props) {
    super(props);
    this.pageManager = new PageManager();
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
      const { state, page } = this.props;
      this.pageManager.firePageUnload(state, page);
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
    formElements.forEach((el) => {
      if (S(el.name).isEmpty()) return; // name属性が定義されていない場合は値を格納しない
      if (el.disabled) return; // disabledの場合は値を格納しない
      if (el.type === 'checkbox') {
        answers[el.name] = el.checked ? 'on' : '';
        return;
      }
      if (el.type === 'radio' && el.checked) {
        answers[el.name] = el.value;
        return;
      }
      answers[el.name] = el.value;
    });
    return answers;
  }

  handleClickNext() {
    const { state, page, submitPage } = this.props;

    if (!this.$parsley.validate()) {
      // validationに失敗したら次のページに行かない
      return;
    }

    // namesに対応する値を取得
    const answers = this.getAnswers();
    const mergedAnswers = Object.assign({}, state.getAnswers(), answers);
    this.pageManager.fireValidate(state, page, mergedAnswers)
      .then((results) => {
        const flatResults = Array.prototype.concat.apply([], results).filter(v => v !== undefined && v !== null);
        if (
          flatResults === undefined ||
          flatResults === null ||
          (Array.isArray(flatResults) && flatResults.length === 0)
        ) {
          // validateの結果が問題ない場合
          submitPage(answers);
          return;
        }
        const message = Array.isArray(flatResults) ? flatResults.join('\n') : flatResults.toString();
        this.pageManager.showMessage(message);
      }).catch((reason) => {
        console.error(reason);
        this.pageManager.showMessage(reason);
      });
  }

  parsley() {
    this.$parsley = $(this.pageEl).parsley();
  }

  /** validationエラー時に表示する表示位置のリファレンスになる要素を取得する */
  findBalloonTargetElement(name) {
    const targetElements = Array.prototype.slice.call(this.pageEl.querySelectorAll(`*[name="${name}"]`));
    if (targetElements.length > 1) {
      // name属性が複数存在する場合にはvalidation-hover-targetに対してバルーンを付ける
      return findParentByClassName(targetElements[0], 'validation-hover-target');
    } else if (targetElements.length === 1) {
      return targetElements[0];
    }
    throw new Error(`name=${name}が見つかりませんでした`);
  }

  /** validation結果をname指定で表示する */
  showValidationResult(name, validationResult) {
    const ownerDoc = this.pageEl.ownerDocument;
    // 一度validation-error-balloonを削除
    const previousBalloon = ownerDoc.body.querySelector(`.validation-error-balloon[data-target="${name}"]`);
    if (previousBalloon !== null) {
      ownerDoc.body.removeChild(previousBalloon);
    }
    // errも削除
    this.findBalloonTargetElement(name).classList.remove('err');

    // エラーがなければ終了
    if (!validationResult) {
      return;
    }
    const balloonTargetElement = this.findBalloonTargetElement(name);
    balloonTargetElement.classList.add('err');
    const rect = balloonTargetElement.getBoundingClientRect();
    const balloon = ownerDoc.createElement('div');
    balloon.style.position = 'absolute';
    balloon.style.left = `${window.pageXOffset + rect.left + rect.width}px`;
    balloon.style.top = `${window.pageYOffset + rect.top}px`;
    balloon.style.backgroundColor = '#888';
    balloon.className = 'validation-error-balloon';
    balloon.appendChild(ownerDoc.createTextNode(validationResult[0]));
    balloon.setAttribute('data-target', name);
    ownerDoc.body.appendChild(balloon);
  }

  // JavaScriptを評価する
  evaluateJavaScript() {
    const { state, page, answers } = this.props;
    const javaScriptCode = page.getJavaScriptCode();
    this.pageManager.init();
    if (S(javaScriptCode).isEmpty()) return;

    const ownerDoc = this.pageEl.ownerDocument;

    try {
      new Function('$', 'document', 'pageManager', javaScriptCode)($, ownerDoc, this.pageManager);
      this.pageManager.firePageLoad(state, page, answers);
    } catch (e) {
      console.error(e);
    }
  }

  // constraintsを作成する
  buildConstraints() {
    const { page } = this.props;
    // constraintsの作成
    const constraints = {};
    page.getQuestions().forEach((question) => { constraints[question.getId()] = question.getConstraint(); });
    return constraints;
  }

  makeQuestions() {
    const { page } = this.props;
    if (!page.questions) {
      return null;
    }
    return page.questions.map((q, index) => {
      const component = findQuestionClass(q.getDataType());
      const key = `${page.id}_${index + 1}`;
      const props = { id: key, question: q, page };
      return <div className="question questionBox" key={key}>{ React.createElement(component, props) }</div>;
    });
  }

  render() {
    return (
      <form ref={(el) => { this.pageEl = el; }} className="page questionsBox" data-parsley-excluded="[disabled=disabled]">
        { this.makeQuestions() }
        <div className="formButtons">
          <button type="button" id="pageSubmitButton" onClick={() => this.handleClickNext()}>進む</button>
          <div className="response-warning">
            <p>※回答中に回答数が規定数に達し、回答が受け付けられないことがありますのでご了承ください。</p>
            <p>※回答中にブラウザを閉じた場合、最初から回答をやりなおしとなりますのでご注意ください。</p>
          </div>
        </div>
      </form>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  submitPage: answers => dispatch(Actions.submitPage(answers)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Page);
