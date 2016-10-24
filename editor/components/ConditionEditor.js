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

  handleClickAddButton() {
  }

  handleClickMinusButton() {
  }

  renderNotLast() {
    const { condition } = this.props;
    return (
      <Well className="branch-editor">
        <div className="branch-editor-header">
          <span>以下の</span>
          <select className="form-control">
            <option>全て</option>
            <option>いずれか</option>
          </select>
          <span>を満たす場合</span>
          <input type="text" className="form-control" placeholder="フローID"/>
          <span>に遷移する</span>
        </div>
        <div className="branch-editor-body">
          <div className="condition-editor">
            <input type="text" className="form-control" placeholder="質問ID"/>
            <span>の値が</span>
            <input type="text" className="form-control" placeholder="値"/>
            <select className="form-control">
              <option value="==">と等しい</option>
              <option value=">=">以上</option>
              <option value="<=">以下</option>
              <option value=">">より大きい</option>
              <option value="<">より小さい</option>
            </select>
            <Glyphicon className="clickable icon-button text-info" glyph="plus-sign" onClick={this.handleClickAddButton.bind(this)}/>
            <Glyphicon className="clickable icon-button text-danger" glyph="minus-sign" onClick={this.handleClickMinusButton.bind(this)}/>
          </div>
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
          <input type="text" className="form-control" placeholder="フローID"/>
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
