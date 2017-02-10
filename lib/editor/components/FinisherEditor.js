import React, { Component } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ReactMixin from 'react-mixin';
import { connect } from 'react-redux';
import uuid from 'node-uuid';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../actions';

class FinisherEditor extends Component {
  constructor(props) {
    super(props);
    this.uuid = uuid.v4();
  }

  componentDidUpdate(prevProps) {
    const oldFinisher = prevProps.finisher;
    const finisher = this.props.finisher;
    if (oldFinisher.id === finisher.id) {
      return;
    }
    const editor = tinymce.EditorManager.get(this.uuid);
    editor.setContent(finisher.getHtml());
  }

  handleTinyMCEChange(editor) {
    const { finisher, changeFinisherAttribute } = this.props;
    changeFinisherAttribute(finisher.getId(), 'html', editor.getContent());
  }

  handleChangeFinisherAttribute(attribute, value) {
    const { finisher, changeFinisherAttribute } = this.props;
    changeFinisherAttribute(finisher.getId(), attribute, value);
  }

  render() {
    const { state, finisher } = this.props;

    const finisherNo = state.calcFinisherNo(finisher.getId());
    return (
      <div className="form-horizontal">
        <h4>{finisherNo} 終了ページ設定</h4>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>表示内容</Col>
          <Col md={10}>
            <TinyMCE
              id={this.uuid}
              config={{
                menubar: '',
                toolbar: 'bold italic underline strikethrough forecolor backcolor removeformat table link unlink fullscreen',
                plugins: 'table contextmenu textcolor paste fullscreen link',
                inline: false,
                height: 40,
                statusbar: false,
              }}
              onKeyup={(e, editor) => this.handleTinyMCEChange(editor)}
              onChange={(e, editor) => this.handleTinyMCEChange(editor)}
              content={finisher.getHtml()}
            />
          </Col>
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
