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
import { findQuestions, findCustomPage } from '../../utils'

class Page extends Component {
  componentDidMount() {
    this.refs.page.addEventListener('change', this.onChangeValue.bind(this), false);
    this.refs.page.addEventListener('keyup', this.onChangeValue.bind(this), false);
    this.refs.page.addEventListener('click', this.onChangeValue.bind(this), false);
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
        return elements.find(el => el.checked).value;
      }
      if (type === 'checkbox') {
        const ret = {};
        elements.forEach((el) => {
          ret[el.value] = el.checked;
        });
        return ret;
      }
    }
    return elements.map(el => el.value);
  }

  makeQuestions() {
    const { page } = this.props;
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
      const key = `${page.id}-${index + 1}`;
      return <div className="question">{ React.createElement(component, { key, id: key, ...q }) }</div>
    });
  }
  render() {
    const { page } = this.props;
    return (
      <div ref="page" className="page">
        <h2 className="page-title">{page.title}</h2>
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
});
const actionsToProps = dispatch => ({
  valueChange: (itemName, value) => dispatch(valueChange(itemName, value)),
});

export default connect(
  stateToProps,
  actionsToProps
)(Page);
