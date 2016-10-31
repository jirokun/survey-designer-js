import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce'
import CheckboxEditor from './question_editor/CheckboxEditor'
import ConditionEditor from './ConditionEditor'
import { Well, Panel, Glyphicon, Form, FormGroup, ControlLabel, Grid, Col, Row } from 'react-bootstrap';
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'
import * as Validator from '../validator'

class BranchEditor extends Component {
  constructor(props) {
    super(props);
  }

  handleClickAddButton() {
  }

  handleClickMinusButton() {
  }

  handleChangeBranch(index, condition) {
    const { changeBranch, branch } = this.props;
    branch.conditions[index] = condition;
    changeBranch(branch.id, branch);
  }

  renderConditions() {
    const { branch } = this.props;
    return branch.conditions.map((condition, i) => <ConditionEditor key={`${branch.id}_${i}`} condition={condition} index={i} isLast={branch.conditions.length === i + 1} handleChangeBranch={this.handleChangeBranch.bind(this)}/>);
  }

  render() {
    const { branch } = this.props;
    const conditions = branch.conditions;
    return (
      <Grid fluid>
        <Row>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>分岐設定</ControlLabel>
              {this.renderConditions()}
            </FormGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  changeBranch: (branchId, value) => dispatch(EditorActions.changeBranch(branchId, value))
});

export default connect(
  stateToProps,
  actionsToProps
)(BranchEditor);
