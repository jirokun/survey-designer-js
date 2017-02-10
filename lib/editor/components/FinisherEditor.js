import React, { Component } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { connect } from 'react-redux';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import * as EditorActions from '../actions';

class FinisherEditor extends Component {
  handleChangeFinisherAttribute(attribute, value) {
    const { page, question, changeFinisherAttribute } = this.props;
    changeFinisherAttribute(page.getId(), question.getId(), attribute, value);
  }

  render() {
    const { state, finisher } = this.props;

    const finisherNo = state.calcFinisherNo(finisher.getId());
    return (
      <div>
        <h4>{finisherNo} 終了ページ設定</h4>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>表示内容</Col>
          <Col md={10}><textarea /></Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>終了タイプ</Col>
          <Col md={10}>
            <FormControl componentClass="select" value={finisher.getFinishType()} onChange={e => this.handleChangeFinisherAttribute('finishType', e.target.value)}>
              <option value="COMPLETE">COMPLETE</option>
              <option value="SCREEN">SCREEN</option>
            </FormControl>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

ReactMixin(FinisherEditor.prototype, LinkedStateMixin);

const stateToProps = state => ({
  state,
});
const actionsToProps = dispatch => ({
  changeFinisherAttribute: (finisherId, attribute, value) =>
    dispatch(EditorActions.changeFinisherAttribute(finisherId, attribute, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(FinisherEditor);
