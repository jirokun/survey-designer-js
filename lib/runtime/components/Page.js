/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findQuestionClass } from '../components/questions/Questions';
import * as Actions from '../actions';
import validate from '../validators';
import * as utils from '../../utils';

class Page extends Component {
  componentDidMount() {
    this.attachEvent();
    this.executeJavaScript();
  }

  componentDidUpdate(prevProps) {
    const prevPage = prevProps.page;
    const currentPage = this.props.page;
    if (prevPage.id !== currentPage.id) {
      this.executeJavaScript();
    }
  }

  /** CheckboxQuestionのデータを取得する */
  getCheckboxQuestionValue(questionId) {
    const elements = Array.prototype.slice.call(this.pageEl.querySelectorAll(`[name="${questionId}"`));
    const values = [];
    elements.forEach((el) => {
      const index = parseInt(el.dataset.choiceIndex, 10);
      const key = el.dataset.key;
      const value = values[index] || {};
      values[index] = value;
      switch (key) {
        case 'checked':
          value[key] = el.checked;
          break;
        case 'freeText':
          value[key] = el.value;
          break;
        default:
          throw new Error(`unkown key=${key}`);
      }
    });
    return values;
  }

  /** RadioQuestionのデータを取得する */
  getRadioQuestionValue(questionId) {
    return this.getCheckboxQuestionValue(questionId).filter(v => v.checked)[0];
  }

  /**
   * nameに対応する値を取得する
   *
   * 値はすべて配列になる
   */
  getElementsValue(questionId) {
    const { state } = this.props;
    const question = state.findQuestion(questionId);
    if (question.getType() === 'CheckboxQuestion') {
      return this.getCheckboxQuestionValue(questionId);
    } else if (question.getType() === 'RadioQuestion') {
      return this.getRadioQuestionValue(questionId);
    }
    const elements = Array.prototype.slice.call(this.pageEl.querySelectorAll(`[name="${questionId}"`));
    const tagName = elements[0].tagName.toLowerCase();
    if (tagName === 'input') {
      const type = elements[0].type.toLowerCase();
      if (type === 'radio') {
        const checkedEl = elements.find(el => el.checked);
        return checkedEl ? checkedEl.value : null;
      }
      if (type === 'checkbox') {
        return elements.map(el => el.checked);
      }
      return elements.map(el => el.value);
    } else if (tagName === 'select') {
      // selectの同じ名前はない前提
      if (elements[0].multiple) {
        return Array.prototype.slice.call(elements[0].querySelectorAll('option')).map(el => el.selected);
      }
      const checkedOption = elements[0].querySelector('option:checked');
      return checkedOption ? checkedOption.value : null;
    }
    return elements.map(el => el.value);
  }

  /** pageに含まれるすべてのnameを取得する */
  getAllNameInPage() {
    const formElements = Array.prototype.slice.call(this.pageEl.querySelectorAll('input,textarea,select'));
    // 入力値のキーとなるnameをユニーク化して取得
    return formElements.map(el => el.name).filter((x, i, self) => self.indexOf(x) === i);
  }

  handleClickNext() {
    const { submitPage } = this.props;

    // namesに対応する値を取得
    const inputValues = {};
    this.getAllNameInPage().forEach((name) => { inputValues[name] = this.getElementsValue(name); });

    // validation
    if (!this.validateAll(inputValues)) {
      // validationに失敗したら次のページに行かない
      return;
    }
    submitPage(inputValues);
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

  /** validation結果を表示する */
  showValidationResultAll(validationResults) {
    this.getAllNameInPage().forEach(name => this.showValidationResult(name, validationResults[name]));
  }

  /** pageにある項目を全てvalidationする */
  validateAll(inputValues) {
    // 検証する
    const validationResults = validate(inputValues, this.buildConstraints(), { fullMessages: false });
    // 検証結果をvalidation-error-balloonにして表示
    this.showValidationResultAll(validationResults);

    return validationResults === undefined;
  }

  // JavaScriptを実行する
  executeJavaScript() {
    const { page, inputValues } = this.props;
    const js = this.props.page.javascript;
    if (!js && js === '') return;
    try {
      const func = new Function('document', 'pageEl', 'pageId', 'values', js);
      const ownerDoc = this.pageEl.ownerDocument;
      func(ownerDoc, this.pageEl, page.id, inputValues);
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

  validateIndividual(e) {
    const name = e.target.name;
    const validationResult = validate.single(this.getElementsValue(name), this.buildConstraints()[name], { fullMessages: false });
    this.showValidationResult(name, validationResult);
  }

  attachEvent() {
    this.pageEl.addEventListener('change', e => this.validateIndividual(e), false);
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
    const { state } = this.props;
    const flowStack = state.getFlowStack();
    const inputValues = state.getInputValues();
    const backButtonStyle = {
      visibility: flowStack.size === 0 ? 'hidden' : 'visible',
    };
    return (
      <div ref={(el) => { this.pageEl = el; }} className="page questionsBox">
        { this.makeQuestions() }
        <div className="formButtons">
          <button id="pageSubmitButton" onClick={() => this.handleClickNext()}>進む</button>
          <div className="response-warning">
            <p>※回答中に回答数が規定数に達し、回答が受け付けられないことがありますのでご了承ください。</p>
            <p>※回答中にブラウザを閉じた場合、最初から回答をやりなおしとなりますのでご注意ください。</p>
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  submitPage: inputValues => dispatch(Actions.submitPage(inputValues)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Page);
