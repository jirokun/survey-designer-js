import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, FormControl, Radio, Checkbox } from 'react-bootstrap';
import * as Utils from '../../utils'

class PageSetting extends Component {
  constructor(props) {
    super(props);
  }
  FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  }
  render() {
    return (
      <div className="form-container">
        <FormGroup controlId="page_title">
          <ControlLabel>ページタイトル</ControlLabel>
          <FormControl type="text"/>
        </FormGroup>

        <FormGroup controlId="page_sub_title">
          <ControlLabel>ページサブタイトル</ControlLabel>
          <FormControl type="text"/>
        </FormGroup>

        <FormGroup controlId="page_layout">
          <ControlLabel>レイアウト</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="flow_layout">フローレイアウト</option>
            <option value="grid_layout">グリッドレイアウト</option>
          </FormControl>
        </FormGroup>
      </div>
    );
  }
}

const stateToProps = state => ({
});
const actionsToProps = dispatch => ({
});

export default connect(
  stateToProps,
  actionsToProps
)(PageSetting);
