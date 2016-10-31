import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import CheckboxEditor from './question_editor/CheckboxEditor';
import { Well, Panel, Glyphicon, Form, FormGroup, ControlLabel, Grid, Col, Row } from 'react-bootstrap';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'
import * as Validator from '../validator'

class ConditionEditor extends Component {
  constructor(props) {
    super(props);
  }

  handleClickAddButton(ccIndex, e) {
    const { handleChangeBranch, index } = this.props;
    const condition = this.getCondition();
    condition.childConditions.splice(ccIndex, 0, {
      key: '',
      operator : '==',
      value: ''
    });

    handleChangeBranch(index, condition);
  }

  handleClickMinusButton(ccIndex, e) {
    const { handleChangeBranch, index } = this.props;
    console.log(arguments);
    const condition = this.getCondition();
    condition.childConditions.splice(ccIndex, 1);
    handleChangeBranch(index, condition);
  }

  handleChange() {
    const { handleChangeBranch, index } = this.props;
    const type = this.refs.conditionType.value;
    const nextFlowId = this.refs.conditionNextFlowId.value;

    handleChangeBranch(index, this.getCondition());
  }

  getCondition() {
    const root = ReactDOM.findDOMNode(this);
    const type = this.refs.conditionType.value;
    const nextFlowId = this.refs.conditionNextFlowId.value;
    const refIdElements= root.querySelectorAll('.condition-ref-id');
    const refValueElements = root.querySelectorAll('.condition-ref-value');
    const refOperatorElements = root.querySelectorAll('.condition-ref-operator');
    const childConditions = Array.prototype.slice.apply(refIdElements).map((el, i) => {
      return {
        key: refIdElements[i].value,
        operator: refOperatorElements[i].value,
        value: refValueElements[i].value
      };
    });
    return { type, nextFlowId, childConditions };
  }

  renderChildCondition(childCondition, index, childConditions) {
    return (
      <div className="condition-editor">
        <input type="text" className="form-control condition-ref-id" placeholder="質問ID" value={childCondition.key} onChange={this.handleChange.bind(this)}/>
        <span>の値が</span>
        <input type="text" className="form-control condition-ref-value" placeholder="値" value={childCondition.value} onChange={this.handleChange.bind(this)}/>
        <select className="form-control condition-ref-operator" value={childCondition.operator} onChange={this.handleChange.bind(this)}>
          <option value=">=">以上</option>
          <option value="==">と等しい</option>
          <option value="<=">以下</option>
          <option value=">">より大きい</option>
          <option value="<">より小さい</option>
          <option value="includes">の選択肢を選択している</option>
          <option value="notIncludes">の選択肢を選択していない</option>
        </select>
        <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={this.handleClickAddButton.bind(this, index)}/>
        { childConditions.length === 1 ? null : <Glyphicon className="clickable icon-button text-danger" glyph="minus-sign" onClick={this.handleClickMinusButton.bind(this, index)}/> }
      </div>
    );
  }

  renderNotLast() {
    const { condition } = this.props;
    return (
      <Well className="branch-editor">
        <div className="branch-editor-header">
          <span>以下の</span>
          <select ref="conditionType" className="form-control condition-type" value={condition.type} onChange={this.handleChange.bind(this)}>
            <option value="all">全て</option>
            <option value="any">いずれか</option>
          </select>
          <span>を満たす場合</span>
          <input ref="conditionNextFlowId" type="text" className="form-control condition-next-flow-id" placeholder="フローID" value={condition.nextFlowId} onChange={this.handleChange.bind(this)}/>
          <span>に遷移する</span>
        </div>
        <div className="branch-editor-body">
          {condition.childConditions.map((cc, i, childConditions) => this.renderChildCondition(cc, i, childConditions))}
        </div>
      </Well>
    );
  }

  renderLast() {
    const { condition } = this.props;
    return (
      <Well className="branch-editor">
        <div className="branch-editor-header">
          <span>上記以外の場合</span>
          <input ref="conditionNextFlowId" type="text" className="form-control condition-next-flow-id" placeholder="フローID" value={condition.nextFlowId} onChange={this.handleChange.bind(this)}/>
          <span>に遷移する</span>
        </div>
      </Well>
    );
  }

  render() {
    const { condition, isLast } = this.props;
    if (isLast) {
      return this.renderLast();
    } else{
      return this.renderNotLast();
    }
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(ConditionEditor);
