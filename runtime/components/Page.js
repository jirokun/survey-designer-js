import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Footer from '../components/Footer'
import InvalidTypeQuestion from '../components/questions/InvalidTypeQuestion'
import TextQuestion from '../components/questions/TextQuestion'
import TextareaQuestion from '../components/questions/TextareaQuestion'
import CheckboxQuestion from '../components/questions/CheckboxQuestion'
import RadioQuestion from '../components/questions/RadioQuestion'
import SelectQuestion from '../components/questions/SelectQuestion'
import MatrixQuestion from '../components/questions/MatrixQuestion'
import { valueChange } from '../actions'
import { findQuestions, findCustomPage, r } from '../../utils'

class Page extends Component {
  componentDidMount() {
    this.refs.page.addEventListener('change', this.onChangeValue.bind(this), false);
    this.refs.page.addEventListener('keyup', this.onChangeValue.bind(this), false);
    this.refs.page.addEventListener('click', this.onChangeValue.bind(this), false);
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
    } catch(e) {
      console.error(e);
    }
  }
  onChangeValue(e) {
    const target = e.target;
    const tagName = target.tagName.toLowerCase();
    switch (tagName) {
      case 'input':
      case 'textarea':
      case 'select':
        // これらだけが対象
        break;
      default:
        return;
    }

    const { valueChange } = this.props;
    const allElements = Array.prototype.slice.call(this.refs.page.querySelectorAll('[name]'));
    const names = allElements.map(el => el.name).filter((x, i, self) => self.indexOf(x) === i);
    const values = {};
    names.forEach(name => values[name] = this.getElementsValue(name));
    valueChange(values);
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
        Array.prototype.slice.call(elements[0].querySelectorAll('option')).forEach(option => {
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
    const { page, inputValues } = this.props;
    if (!page.questions) {
      return;
    }
    return page.questions.map((q, index) => {
      let component;
      switch(q.type) {
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
      return <div className="question">{ React.createElement(component, { key, id: key, inputValues, ...q }) }</div>
    });
  }
  render() {
    const { page, inputValues } = this.props;
    return (
      <div ref="page" className="page">
        <h2 className="page-title" dangerouslySetInnerHTML={{__html: r(page.title, inputValues)}} />
        { this.makeQuestions() }
        <Footer />
      </div>
    );
  }
}

Page.propTypes = {
  page: PropTypes.object.isRequired
};

const stateToProps = state => ({
  inputValues: state.values.inputValues
});
const actionsToProps = dispatch => ({
  valueChange: (itemName, value) => dispatch(valueChange(itemName, value)),
});

export default connect(
  stateToProps,
  actionsToProps
)(Page);
