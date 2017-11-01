import React, { Component } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import tinymce from 'tinymce';
import HtmlEditorPart from '../question_editors/parts/HtmlEditorPart';
import * as EditorActions from '../../actions';
import './../../../constants/tinymce_ja';

/** Finisherの編集画面 */
class FinisherEditor extends Component {
  /** コンストラクタ */
  constructor(props) {
    super(props);
    // tinymceがかぶらないようにするためにcuidを生成
    this.cuid = cuid();
  }

  /** tinymceの値が変わったときの処理 */
  handleHtmlChange(finisherId, html) {
    const { changeFinisherAttribute } = this.props;
    changeFinisherAttribute(finisherId, 'html', html);
  }

  /** tinymce以外のコントロールの値が変わったときの処理 */
  handleChangeFinisherAttribute(finisherId, attribute, value) {
    const { changeFinisherAttribute } = this.props;
    changeFinisherAttribute(finisherId, attribute, value);
  }

  /** 描画 */
  render() {
    const { survey, finisher } = this.props;
    const finisherId = finisher.getId();

    const finisherNo = survey.calcFinisherNo(finisher.getId());
    return (
      <div className="form-horizontal">
        <h4 className="enq-title enq-title__finisher">{finisherNo} 終了ページ設定</h4>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>表示内容</Col>
          <Col md={10}>
            <HtmlEditorPart
              key={`${finisherId}_html_editor`}
              onChange={html => this.handleHtmlChange(finisherId, html)}
              content={finisher.getHtml()}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>終了タイプ</Col>
          <Col md={10}>
            <FormControl componentClass="select" value={finisher.getFinishType()} onChange={e => this.handleChangeFinisherAttribute(finisherId, 'finishType', e.target.value)}>
              <option value="COMPLETE">COMPLETE</option>
              <option value="SCREEN">SCREEN</option>
            </FormControl>
          </Col>
        </FormGroup>
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
  changeFinisherAttribute: (finisherId, attribute, value) =>
    dispatch(EditorActions.changeFinisherAttribute(finisherId, attribute, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(FinisherEditor);
