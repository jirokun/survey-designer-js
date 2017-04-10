/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Button, Glyphicon, Form, Col, FormControl } from 'react-bootstrap';
import classNames from 'classnames';
import { List } from 'immutable';
import * as EditorActions from '../../actions';

class LogicalVariableForm extends Component {
  /** logicalVariableからstateを生成する */
  static generateState(logicalVariable) {
    return {
      editMode: false,
      variableName: logicalVariable.getVariableName(),
      operands: logicalVariable.getOperands(),
      operators: logicalVariable.getOperators(),
      errorMessage: null,
    };
  }

  constructor(props) {
    super(props);
    const { logicalVariable } = props;
    this.state = LogicalVariableForm.generateState(logicalVariable);
  }

  /** editModeの変更 */
  handleSubmit(e) {
    e.preventDefault();
    this.handleClickSave();
  }

  /** editModeの変更 */
  handleChangeEditMode(editMode) {
    this.setState({ editMode });
  }

  /** LogicalVariableの変更 */
  handleRemoveLogicalVariable() {
    const { page, logicalVariable, removeLogicalVariable } = this.props;
    removeLogicalVariable(page.getId(), logicalVariable.getId());
  }

  /** LogicalVariableの変更 */
  handleClickCancel() {
    const { logicalVariable } = this.props;
    this.setState(LogicalVariableForm.generateState(logicalVariable));
  }

  /** LogicalVariableの変更 */
  handleClickSave() {
    const { logicalVariable, page, changeLogicalVariable } = this.props;
    const variableName = this.state.variableName;
    if (!page.isUniqueLogicalVariableName(logicalVariable.getId(), variableName)) {
      this.setState({ errorMessage: 'ラベルが重複しています' });
      return;
    }
    const invalidChars = [
      { char: ' ', desc: '半角スペース' },
      { char: '#', desc: '半角シャープ' },
      { char: '{', desc: '半角左ブレース' },
      { char: '}', desc: '半角右ブレース' },
    ];
    for (let i = 0; i < invalidChars.length; i++) {
      if (variableName.indexOf(invalidChars[i].char) !== -1) {
        this.setState({ errorMessage: `ラベルに使用できない文字が含まれています。<br />使用できない文字<br />${invalidChars.map(c => `'${c.char}':${c.desc}`).join('<br />')}` });
        return;
      }
    }

    const newLogicalVariable = logicalVariable
      .set('variableName', this.state.variableName)
      .set('operands', this.state.operands)
      .set('operators', this.state.operators);
    changeLogicalVariable(page.getId(), newLogicalVariable.getId(), newLogicalVariable);
    this.setState({ editMode: false, errorMessage: null });
  }

  /** 名前の変更 */
  handleChangeName(variableName) {
    this.setState({ variableName });
  }

  /** オペランドの追加*/
  handleAddOperand(index) {
    const { operands, operators } = this.state;
    this.setState({
      operands: operands.insert(index + 1, ''),
      operators: operators.insert(index, ''),
    });
  }

  /** オペランドの削除 */
  handleRemoveOperand(index) {
    const { operands, operators } = this.state;
    this.setState({
      operands: operands.delete(index),
      operators: operators.delete(index - 1),
    });
  }

  /** 式が変更されたときのハンドラ */
  handleChangeExpression() {
    const operands = List(Array.prototype.slice.call(this.rootEl.getElementsByClassName('operand')).map(el => el.value));
    const operators = List(Array.prototype.slice.call(this.rootEl.getElementsByClassName('operator')).map(el => el.value));

    this.setState({
      operands,
      operators,
    });
  }

  /** 計算式部分を作成する */
  createExpression(editMode, operand, operator, precedingOutputDefinitions, index) {
    const { logicalVariable } = this.props;
    const { operators } = this.state;
    const key = `${this.constructor.name}_${logicalVariable.getId()}_${index}`;
    return (
      <div key={key} className="expression">
        <FormControl className="operand" componentClass="select" disabled={!editMode} value={operand} onChange={() => this.handleChangeExpression()}>
          <option value="" />
          {this.createOutputDefinitionOptions(precedingOutputDefinitions, index)}
        </FormControl>
        <Glyphicon
          className={classNames('clickable icon-button text-info', { invisible: !editMode })}
          glyph="plus-sign"
          onClick={() => this.handleAddOperand(index)}
        />
        <Glyphicon
          className={classNames('clickable icon-button text-danger', { invisible: !editMode || index === 0 || operators.size === 1 })}
          glyph="remove-sign"
          onClick={() => this.handleRemoveOperand(index)}
        />
        { operator !== undefined ? (
          <FormControl className="operator" componentClass="select" disabled={!editMode} value={operator} onChange={() => this.handleChangeExpression()}>
            <option value="" />
            <option value="+">＋</option>
            <option value="-">−</option>
          </FormControl>
        ) : null }
      </div>
    );
  }

  /** outputdefinitionのoptionを作成する */
  createOutputDefinitionOptions(precedingOutputDefinitions, index) {
    const { logicalVariable } = this.props;
    return precedingOutputDefinitions.map((od, i) => {
      const key = `${this.constructor.name}_${logicalVariable.getId()}_${index}_${i}`;
      return <option key={key} value={od.getId()}>{od.getOutputNo()} {od.getLabel()}</option>;
    });
  }

  /** パネルのヘッダーを作成する */
  createPanelHeader(variableName) {
    const { survey, page } = this.props;
    const name = `${survey.calcPageNo(page.getId())}-L-${variableName}`;
    return (
      <div>
        {name}
        <i className="fa fa-trash pull-right text-danger delete-button" onClick={e => this.handleRemoveLogicalVariable(e)} />
      </div>
    );
  }

  render() {
    const { runtime, survey, logicalVariable } = this.props;
    const { editMode, variableName, operands, operators, errorMessage } = this.state;
    const precedingOutputDefinitions = survey.findPrecedingOutputDefinition(runtime.findCurrentNode(survey).getId())
      .filter(od => od.getOutputType() === 'number') // numberのものに限る
      .filter(od => od.getName() !== logicalVariable.getId());  // 自分自身は除く
    return (
      <div ref={(el) => { this.rootEl = el; }}>
        <Panel header={this.createPanelHeader(variableName)} collapsible defaultExpanded={false}>
          <Form onSubmit={e => this.handleSubmit(e)}>
            <div>
              <Col md={3}>ラベル</Col>
              <Col md={9}>定義</Col>
            </div>
            <div>
              <Col md={3}>
                <FormControl type="text" value={variableName} disabled={!editMode} onChange={e => this.handleChangeName(e.target.value)} />
              </Col>
              <Col md={9}>
                {operands.map((operand, i) => this.createExpression(editMode, operand, operators.get(i), precedingOutputDefinitions, i))}
              </Col>
            </div>
            <div>
              <Col md={12}>
                <Button className={classNames('pull-right', { hidden: editMode })} bsStyle="default" onClick={() => this.handleChangeEditMode(true)}>編集</Button>
                <Button className={classNames('pull-right', { hidden: !editMode })} bsStyle="primary" onClick={() => this.handleClickSave(false)}>保存</Button>
                <Button className={classNames('pull-right', { hidden: !editMode })} onClick={() => this.handleClickCancel(false)}>キャンセル</Button>
                <span className="pull-right text-danger form-control-static" dangerouslySetInnerHTML={{ __html: errorMessage }} />
              </Col>
            </div>
          </Form>
        </Panel>
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
});
const actionsToProps = dispatch => ({
  changeLogicalVariable: (pageId, logicalVariableId, logicalVariable) => dispatch(EditorActions.changeLogicalVariable(pageId, logicalVariableId, logicalVariable)),
  removeLogicalVariable: (pageId, logicalVariableId) => dispatch(EditorActions.removeLogicalVariable(pageId, logicalVariableId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(LogicalVariableForm);
