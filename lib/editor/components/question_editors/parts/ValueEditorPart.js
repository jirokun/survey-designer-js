import React, { Component } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import S from 'string';
import { List } from 'immutable';
import NumericInput from 'react-numeric-input';
import ExSelect from './ExSelect';

/**
 * 直接値を入力するか、再掲値を選択するかを選ぶことのできるエディタ
 */
class ValueEditorPart extends Component {
  static makeReferenceValue(od) {
    return `{{${od.getId()}.answer}}`;
  }

  constructor(props) {
    super(props);

    this.cuid = cuid();
    const { value } = props;
    this.state = {
      mode: S(value).isEmpty() || S(value).isNumeric() ? 'fixedValue' : 'answerValue',
    };
  }

  handleChangeMode(mode) {
    this.props.onChange('');
    this.setState({ mode });
  }

  handleChangeQuestionAttribute(value) {
    this.props.onChange(value);
  }

  createValueElement() {
    const { options, survey, runtime, value } = this.props;
    if (this.state.mode === 'fixedValue') {
      if (options.isShowDetail()) {
        return <span>{value}</span>;
      }
      return (
        <NumericInput
          className="form-control"
          value={value}
          onChange={(numValue, strValue) => this.handleChangeQuestionAttribute(strValue)}
        />
      );
    }
    const keyBase = this.cuid;
    let optionList = List().push(<option key={`${keyBase}-empty`} value="" />);
    const precedingOutputDefinitions = survey.findPrecedingOutputDefinition(runtime.findCurrentNode(survey).getId(), false);
    if (value !== '' && precedingOutputDefinitions.findIndex(od => ValueEditorPart.makeReferenceValue(od) === value) === -1) {
      optionList = optionList.push(<option key={`${keyBase}-deleted`} value={value}>削除されました</option>);
    }
    optionList = optionList.concat(
      precedingOutputDefinitions.filter(od => od.getOutputType() === 'number')
        .map(od => <option key={`${keyBase}-${od.getId()}`} value={ValueEditorPart.makeReferenceValue(od)}>{od.getOutputNo()} {od.getLabel()}</option>)
        .toList());

    return (
      <ExSelect
        className="form-control"
        value={value}
        onChange={e => this.handleChangeQuestionAttribute(e.target.value)}
        detailMode={options.isShowDetail()}
      >
        {optionList}
      </ExSelect>
    );
  }

  render() {
    const { options, style } = this.props;
    return (
      <div className="input-group value-editor-part" style={style}>
        <ExSelect
          className="form-control"
          value={this.state.mode}
          onChange={e => this.handleChangeMode(e.target.value)}
          detailMode={options.isShowDetail()}
        >
          <option value="fixedValue">固定値</option>
          <option value="answerValue">回答値</option>
        </ExSelect>
        {this.createValueElement()}
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  options: state.getOptions(),
});

export default connect(
  stateToProps,
)(ValueEditorPart);
