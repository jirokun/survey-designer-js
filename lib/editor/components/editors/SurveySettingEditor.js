/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Radio, FormControl, Col, ControlLabel, Modal, FormGroup } from 'react-bootstrap';
import Help from '../Help';
import * as Action from '../../actions';

/** 画面上部のMenuの設定 */
class SurveySettingEditor extends Component {
  handleChangeCssUrls(event) {
    const { options, changeSurveyCssOption } = this.props;

    const id = event.target.value;
    const cssOption = options.getCssOptionById(id);
    changeSurveyCssOption(cssOption);
  }

  render() {
    const { survey, options, view, hideMenuConfig, changeSurveyAttribute } = this.props;

    const cssOptionId = options.getCssOptionIdByUrls(survey.getCssRuntimeUrls(), survey.getCssPreviewUrls());

    return (
      <Modal className="survey-settings-modal" show={view.getShowMenuConfig()} onHide={() => hideMenuConfig()}>
        <Modal.Body>
          <div className="form-horizontal">
            <FormGroup>
              <Col componentClass={ControlLabel} md={3}>スタイル定義</Col>
              <Col md={9}>
                <FormControl componentClass="select" value={cssOptionId} onChange={e => this.handleChangeCssUrls(e)}>
                  {options.getCssOptions().toArray().map(o => <option key={o.getId()} value={o.getId()}>{o.getTitle()}</option>)}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} md={3}>ゼロ埋め <Help messageId="zeroSetting" /></Col>
              <Col md={9}>
                <Radio
                  name="surveyZeroSetting"
                  checked={survey.getZeroSetting() === true}
                  onChange={() => changeSurveyAttribute('zeroSetting', true)}
                >有効</Radio>
                <Radio
                  name="surveyZeroSetting"
                  checked={survey.getZeroSetting() === false}
                  onChange={() => changeSurveyAttribute('zeroSetting', false)}
                >無効</Radio>
              </Col>
            </FormGroup>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  options: state.getOptions(),
  view: state.getViewSetting(),
});
const actionsToProps = dispatch => ({
  changeSurveyAttribute: (attributeName, value) => dispatch(Action.changeSurveyAttribute(attributeName, value)),
  changeSurveyCssOption: cssOption => dispatch(Action.changeSurveyCssOption(cssOption)),
  hideMenuConfig: () => dispatch(Action.changeShowMenuConfig(false)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(SurveySettingEditor);
