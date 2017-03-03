/* eslint-env browser */
import React, { Component } from 'react';
import classNames from 'classnames';
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

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasErrorOccured: false,
    };
  }

  componentDidMount() {
    this.executeJavaScript();
    this.parsley();
  }

  /** Reactのライフサイクルメソッド */
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
    const { submitPage } = this.props;

    if (!this.$parsley.validate()) {
      // validationに失敗したら次のページに行かない
      return;
    }
    // namesに対応する値を取得
    const answers = this.getAnswers();
    submitPage(answers);
  }

  parsley() {
    this.$parsley = $(this.pageEl).parsley();
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
      alert('システムエラーが発生しました。ブラウザを再読込し再度アクセスください。');
      this.setState({ hasErrorOccured: true });
    }
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
