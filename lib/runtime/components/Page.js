/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import Parsley from 'parsleyjs';
import ParsleyJa from 'parsleyjs/dist/i18n/ja.js';
import ParsleyJaExtra from 'parsleyjs/dist/i18n/ja.extra.js';
import Tooltipster from 'tooltipster';
import { findQuestionClass } from '../components/questions/Questions';
import * as Actions from '../actions';
import * as utils from '../../utils';

class Page extends Component {
  componentDidMount() {
    this.executeJavaScript();
    this.parsley();
  }

  parsley() {
    this.$parsley = $(this.pageEl).parsley();
  }

  componentDidUpdate(prevProps) {
    const prevPage = prevProps.page;
    const currentPage = this.props.page;
    if (prevPage.id !== currentPage.id) {
      this.executeJavaScript();
    }
  }

  /** 入力値を取得する。validation済みであることを期待している */
  getAnswers() {
    const formElements = Array.prototype.slice.call(this.pageEl.querySelectorAll('input,textarea,select'));
    const answers = {};
    formElements.forEach((el) => {
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
    const { submitPage } = this.props;

    if (!this.$parsley.validate()) {
      // validationに失敗したら次のページに行かない
      return;
    }
    // namesに対応する値を取得
    const answers = this.getAnswers();
    submitPage(answers);
  }

  /** validationエラー時に表示する表示位置のリファレンスになる要素を取得する */
  findBalloonTargetElement(name) {
    const targetElements = Array.prototype.slice.call(this.pageEl.querySelectorAll(`*[name="${name}"]`));
    if (targetElements.length > 1) {
      // name属性が複数存在する場合にはvalidation-hover-targetに対してバルーンを付ける
      return utils.findParentByClassName(targetElements[0], 'validation-hover-target');
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

  // JavaScriptを実行する
  executeJavaScript() {
    const { page, answers } = this.props;
    const js = this.props.page.javascript;
    if (!js && js === '') return;
    try {
      const func = new Function('document', 'pageEl', 'pageId', 'values', js);
      const ownerDoc = this.pageEl.ownerDocument;
      func(ownerDoc, this.pageEl, page.id, answers);
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
      const component = findQuestionClass(q.type);
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
