import React, { Component } from 'react';
import { connect } from 'react-redux';
import S from 'string';
import { List } from 'immutable';
import NumericInput from 'react-numeric-input';
import * as EditorActions from '../../../actions';

/**
 * 直接値を入力するか、再掲値を選択するかを選ぶことのできるエディタ
 */
class ValueEditorPart extends Component {
  static makeReferenceValue(od) {
    return `{{${od.getName()}.answer}}`;
  }

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

  createValueElement() {
    const { survey, runtime, attr, value, question } = this.props;
    if (this.state.mode === 'fixedValue') {
      return (
        <NumericInput
          className="form-control"
          value={value}
          onChange={(numValue, strValue) => this.handleChangeQuestionAttribute(strValue)}
        />
      );
    }
    const keyBase = `${question.getId()}-${attr}`;
    let options = List().push(<option key={`${keyBase}-empty`} value="" />);
    const precedingOutputDefinitions = survey.findPrecedingOutputDefinition(runtime.findCurrentNode(survey).getId(), false);
    if (value !== '' && precedingOutputDefinitions.findIndex(od => ValueEditorPart.makeReferenceValue(od) === value) === -1) {
      options = options.push(<option key={`${keyBase}-deleted`} value={value}>削除されました</option>);
    }
    options = options.concat(
      precedingOutputDefinitions.filter(od => od.getOutputType() === 'number')
        .map(od => <option key={`${keyBase}-${od.getId()}`} value={ValueEditorPart.makeReferenceValue(od)}>{od.getOutputNo()} {od.getLabel()}</option>)
        .toList());

    return (
      <select
        className="form-control"
        value={value}
        onChange={e => this.handleChangeQuestionAttribute(e.target.value)}
      >
        {options}
      </select>
    );
  }

  render() {
    return (
      <div className="input-group value-editor-part">
        <select className="form-control" value={this.state.mode} onChange={e => this.handleChangeMode(e.target.value)}>
          <option value="fixedValue">固定値を指定</option>
          <option value="answerValue">ユーザの回答値を指定</option>
        </select>
        {this.createValueElement()}
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
