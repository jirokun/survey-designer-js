import React, { Component } from 'react';
import { connect } from 'react-redux';
import cuid from 'cuid';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import tinymce from 'tinymce';
import TinyMCE from 'react-tinymce';
import * as EditorActions from '../../actions';

/** Finisherの編集画面 */
class FinisherEditor extends Component {
  /** コンストラクタ */
  constructor(props) {
    super(props);
    // tinymceがかぶらないようにするためにcuidを生成
    this.cuid = cuid();
  }

  /**
   * Reactのライフサイクルメソッド
   * finisher間でnodeを移動したときにtinymceのcontentが変更されるように処理
   */
  componentDidUpdate(prevProps) {
    const oldFinisher = prevProps.finisher;
    const finisher = this.props.finisher;
    if (oldFinisher.getId() === finisher.getId()) {
      return;
    }
    const editor = tinymce.EditorManager.get(this.cuid);
    editor.setContent(finisher.getHtml());
  }

  /** tinymceの値が変わったときの処理 */
  handleTinyMCEChange(editor) {
    const { finisher, changeFinisherAttribute } = this.props;
    changeFinisherAttribute(finisher.getId(), 'html', editor.getContent());
  }

  /** tinymce以外のコントロールの値が変わったときの処理 */
  handleChangeFinisherAttribute(attribute, value) {
    const { finisher, changeFinisherAttribute } = this.props;
    changeFinisherAttribute(finisher.getId(), attribute, value);
  }

  /** 描画 */
  render() {
    const { survey, finisher } = this.props;

    const finisherNo = survey.calcFinisherNo(finisher.getId());
    return (
      <div className="form-horizontal">
        <h4 className="enq-title enq-title__finisher">{finisherNo} 終了ページ設定</h4>
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>表示内容</Col>
          <Col md={10}>
            <TinyMCE
              id={this.cuid}
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
        <FormGroup>
          <Col componentClass={ControlLabel} md={2}>ポイント</Col>
          <Col md={10}>
            <FormControl componentClass="input" type="number" value={finisher.getPoint()} onChange={e => this.handleChangeFinisherAttribute('point', e.target.value)} />
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
