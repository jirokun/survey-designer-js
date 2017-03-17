import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormControl } from 'react-bootstrap';
import S from 'string';
import NumericInput from 'react-numeric-input';
import * as EditorActions from '../../../actions';

/**
 * 直接値を入力するか、再掲値を選択するかを選ぶことのできるエディタ
 */
class ValueEditorPart extends Component {
  constructor(props) {
    super(props);

    const { value } = props;
    this.state = {
      mode: S(value).isEmpty() || S(value).isNumeric() ? 'fixedValue' : 'answerValue',
    };
  }

  handleChangeMode(mode) {
    const { page, question, attr, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), attr, '');
    this.setState({ mode });
  }

  handleChangeQuestionAttribute(value) {
    const { page, question, attr, changeQuestionAttribute } = this.props;
    changeQuestionAttribute(page.getId(), question.getId(), attr, value);
  }

  render() {
    const { survey, runtime, attr, value } = this.props;
    const options = survey.findPrecedingOutputDefinition(runtime.findCurrentNode(survey).getId(), false)
      .filter(od => od.getOutputType() === 'number')
      .map((od) => {
        const key = `${this.constructor.name}_${attr}_${od.getId()}`;
        return <option key={key} value={`{{${od.getName()}.answer}}`}>{od.getOutputNo()} {od.getLabel()}</option>;
      })
    .toList();
    const formEl = this.state.mode === 'fixedValue' ?
      <NumericInput className="form-control" value={value} onChange={(numValue, strValue) => this.handleChangeQuestionAttribute(strValue)} />
      : <select className="form-control" value={value} onChange={e => this.handleChangeQuestionAttribute(e.target.value)}><option value="" />{options}</select>;

    return (
      <div className="input-group value-editor-part">
        <select className="form-control" value={this.state.mode} onChange={e => this.handleChangeMode(e.target.value)}>
          <option value="fixedValue">固定値を指定</option>
          <option value="answerValue">ユーザの回答値を指定</option>
        </select>
        {formEl}
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
});
const actionsToProps = dispatch => ({
  changeQuestionAttribute: (pageId, questionId, attribute, value, subValue) =>
    dispatch(EditorActions.changeQuestionAttribute(pageId, questionId, attribute, value, subValue)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(ValueEditorPart);
