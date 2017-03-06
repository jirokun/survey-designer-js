/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Button, Glyphicon, Form, Col, FormControl, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';
import { List } from 'immutable';
import * as EditorActions from '../../actions';

class LogicVariableForm extends Component {
  /** logicVariableからstateを生成する */
  static generateState(logicVariable) {
    return {
      editMode: false,
      variableName: logicVariable.getVariableName(),
      operands: logicVariable.getOperands(),
      operators: logicVariable.getOperators(),
      errorMessage: null,
    };
  }

  constructor(props) {
    super(props);
    const { logicVariable } = props;
    this.state = LogicVariableForm.generateState(logicVariable);
  }

  /** editModeの変更 */
  handleChangeEditMode(editMode) {
    this.setState({ editMode });
  }

  /** LogicVariableの変更 */
  handleRemoveLogicVariable() {
    const { page, logicVariable, removeLogicVariable } = this.props;
    removeLogicVariable(page.getId(), logicVariable.getId());
  }

  /** LogicVariableの変更 */
  handleClickCancel() {
    const { logicVariable } = this.props;
    this.setState(LogicVariableForm.generateState(logicVariable));
  }

  /** LogicVariableの変更 */
  handleClickSave() {
    const { logicVariable, page, changeLogicVariable } = this.props;
    const variableName = this.state.variableName;
    if (!page.isUniqueLogicVariableName(logicVariable.getId(), variableName)) {
      this.setState({ errorMessage: '変数名が重複しています' });
      return;
    }
    const newLogicVariable = logicVariable
      .set('variableName', this.state.variableName)
      .set('operands', this.state.operands)
      .set('operators', this.state.operators);
    changeLogicVariable(page.getId(), newLogicVariable.getId(), newLogicVariable);
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
    const { logicVariable } = this.props;
    const { operators } = this.state;
    const key = `${this.constructor.name}_${logicVariable.getId()}_${index}`;
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
            <option value="*">×</option>
            <option value="/">÷</option>
          </FormControl>
        ) : null }
      </div>
    );
  }

  /** outputdefinitionのoptionを作成する */
  createOutputDefinitionOptions(precedingOutputDefinitions, index) {
    const { logicVariable } = this.props;
    return precedingOutputDefinitions.map((od, i) => {
      const key = `${this.constructor.name}_${logicVariable.getId()}_${index}_${i}`;
      return <option key={key} value={od.getId()}>{od.getOutputNo()} {od.getLabel()}</option>;
    });
  }

  /** パネルのヘッダーを作成する */
  createPanelHeader() {
    const { state, page } = this.props;
    const { variableName } = this.state;
    const pageNo = state.calcPageNo(page.getId());
    return (
      <div>
        変数名: {pageNo}-{variableName}
        <i className="fa fa-trash pull-right text-danger delete-button" onClick={e => this.handleRemoveLogicVariable(e)} />
      </div>
    );
  }

  render() {
    const { state, page } = this.props;
    const { editMode, variableName, operands, operators, errorMessage } = this.state;
    const pageNo = state.calcPageNo(page.getId());
    const precedingOutputDefinitions = state.findPrecedingOutputDefinition(state.findCurrentNode().getId());
    return (
      <div ref={(el) => { this.rootEl = el; }}>
        <Panel header={this.createPanelHeader()} collapsible defaultExpanded={false}>
          <Form>
            <div>
              <Col md={3}>変数名</Col>
              <Col md={9}>定義</Col>
            </div>
            <div>
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Addon>{pageNo}-</InputGroup.Addon>
                  <FormControl type="text" value={variableName} disabled={!editMode} onChange={e => this.handleChangeName(e.target.value)} />
                </InputGroup>
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
                <span className="pull-right text-danger form-control-static">{errorMessage}</span>
              </Col>
            </div>
          </Form>
        </Panel>
      </div>
    );
  }
}

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeLogicVariable: (pageId, logicVariableId, logicVariable) => dispatch(EditorActions.changeLogicVariable(pageId, logicVariableId, logicVariable)),
  removeLogicVariable: (pageId, logicVariableId) => dispatch(EditorActions.removeLogicVariable(pageId, logicVariableId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(LogicVariableForm);
