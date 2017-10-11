/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import * as Action from '../../actions';

/** 画面上部のMenuの設定 */
class MenuConfigModal extends Component {
  handleChangeCssUrls(event) {
    const { options, changeSurveyCssOption } = this.props;

    const id = event.target.value;
    const cssOption = options.getCssOptionById(id);
    changeSurveyCssOption(cssOption);
  }

  render() {
    const { survey, options, view, hideMenuConfig } = this.props;

    const id = options.getCssOptionIdByUrls(survey.getCssRuntimeUrls(), survey.getCssPreviewUrls(), survey.getCssDetailUrls()) || '';

    return (
      <Modal show={view.getShowMenuConfig()} onHide={() => hideMenuConfig()}>
        <Modal.Body>
          <div>CSSの選択：
            <select value={id} onChange={e => this.handleChangeCssUrls(e)}>
              {options.getCssOptions().toArray().map(o => <option key={o.getId()} value={o.getId()}>{o.getTitle()}</option>)}
            </select>
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
  changeSurveyCssOption: cssOption => dispatch(Action.changeSurveyCssOption(cssOption)),
  hideMenuConfig: () => dispatch(Action.changeShowMenuConfig(false)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(MenuConfigModal);
