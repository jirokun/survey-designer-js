import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TinyMCE from 'react-tinymce';
import CheckboxEditor from './question_editor/CheckboxEditor';
import { Panel, Glyphicon, Form, FormGroup, ControlLabel, Grid, Col, Row } from 'react-bootstrap';
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

  render() {
    const { branch } = this.props;
    return (
      <Grid fluid>
        <Row>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>分岐設定</ControlLabel>
              <Panel className="branch-editor" bsStyle="primary">
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
              </Panel>

              <Panel className="branch-editor" bsStyle="primary">
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
              </Panel>

              <Panel className="branch-editor" bsStyle="primary">
                <div className="branch-editor-header">
                  <span>上記以外の場合</span>
                  <input type="text" className="form-control" placeholder="フローID"/>
                  <span>に遷移する</span>
                </div>
              </Panel>

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
});

export default connect(
  stateToProps,
  actionsToProps
)(BranchEditor);
