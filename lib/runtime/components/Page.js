import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import InvalidTypeQuestion from '../components/questions/InvalidTypeQuestion';
import TextQuestion from '../components/questions/TextQuestion';
import TextareaQuestion from '../components/questions/TextareaQuestion';
import CheckboxQuestion from '../components/questions/CheckboxQuestion';
import RadioQuestion from '../components/questions/RadioQuestion';
import SelectQuestion from '../components/questions/SelectQuestion';
import MatrixQuestion from '../components/questions/MatrixQuestion';
import { nextPage, prevPage, valueChange } from '../actions';
import { findQuestions, findCustomPage, r } from '../../utils';

class Page extends Component {
  componentDidMount() {
    this.executeJavaScript();
  }
  componentDidUpdate(prevProps, prevState) {
    const prevPage = prevProps.page;
    const currentPage = this.props.page;
    if (prevPage.id !== currentPage.id) {
      this.executeJavaScript();
    }
  }
  // JavaScriptを実行する
  executeJavaScript() {
    const { page, inputValues } = this.props;
    const js = this.props.page.javascript;
    if (!js && js === '') return;
    try {
      const func = new Function('document', 'pageEl', 'pageId', 'values', js);
      const ownerDoc = this.refs.page.ownerDocument;
      func(ownerDoc, this.refs.page, page.id, inputValues);
    } catch (e) {
      console.error(e);
    }
  }
  handleClickNext() {
    const { valueChange, nextPage } = this.props;
    const root = ReactDOM.findDOMNode(this);
    const formElements = root.querySelectorAll('input,textarea,select');
    const values = {};
    for (let i = 0, len = formElements.length; i < len; i++) {
      const el = formElements[i];
      const name = el.name;
      if ((el.tagName === 'INPUT' && el.type === 'checkbox') ||
          (el.tagName === 'SELECT' && el.multiple)) {
        if (values[name] === undefined) {
          values[name] = [];
        }
        values[name].push({ value: el.value, checked: el.checked });
      } else {
        values[name] = el.value;
      }
    }
    valueChange(values);
    nextPage();
  }
  getElementsValue(name) {
    const elements = Array.prototype.slice.call(this.refs.page.querySelectorAll(`[name="${name}"`));
    const tagName = elements[0].tagName.toLowerCase();
    if (tagName === 'input') {
      const type = elements[0].type.toLowerCase();
      if (type === 'radio') {
        const checkedEl = elements.find(el => el.checked);
        return checkedEl ? checkedEl.value : null;
      }
      if (type === 'checkbox') {
        const ret = {};
        elements.forEach((el) => {
          ret[el.value] = el.checked;
        });
        return ret;
      }
    } else if (tagName === 'select') {
      // selectのnameは一つとする
      if (elements[0].multiple) {
        const ret = {};
        Array.prototype.slice.call(elements[0].querySelectorAll('option')).forEach((option) => {
          ret[option.value] = option.selected;
        });
        return ret;
      } else {
        const checkedOption = elements[0].querySelector('option:checked');
        return checkedOption ? checkedOption.value : null;
      }
    }
    return elements.map(el => el.value);
  }

  makeQuestions() {
    const { page } = this.props;
    if (!page.questions) {
      return;
    }
    return page.questions.map((q, index) => {
      let component;
      switch (q.type) {
        case 'text':
          component = TextQuestion;
          break;
        case 'textarea':
          component = TextareaQuestion;
          break;
        case 'checkbox':
          component = CheckboxQuestion;
          break;
        case 'radio':
          component = RadioQuestion;
          break;
        case 'select':
          component = SelectQuestion;
          break;
        case 'matrix':
          component = MatrixQuestion;
          break;
        default:
          component = InvalidTypeQuestion;
          break;
      }
      const key = `${page.id}_${index + 1}`;
      const props = { id: key, question: q, page };
      return <div className="question questionBox" key={key}>{ React.createElement(component, props) }</div>;
    });
  }
  render() {
    const { page, state, prevPage, nextPage } = this.props;
    const flowStack = state.getFlowStack();
    const inputValues = state.getInputValues();
    const backButtonStyle = {
      visibility: flowStack.size === 0 ? 'hidden' : 'visible'
    };
    return (
      <div ref="page" className="page questionsBox">
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
  valueChange: (itemName, value) => dispatch(valueChange(itemName, value)),
  prevPage: () => dispatch(prevPage()),
  nextPage: () => dispatch(nextPage()),
});

export default connect(
  stateToProps,
  actionsToProps,
)(Page);
