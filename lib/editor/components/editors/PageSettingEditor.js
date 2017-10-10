/* eslint-env browser */
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import $ from 'jquery';
import { prettyPrint } from 'html';
import { ControlLabel, FormGroup, Checkbox, Col, Radio } from 'react-bootstrap';
import Help from '../Help';
import Page from '../../../runtime/components/Page';
import * as EditorActions from '../../actions';
import { isDevelopment } from '../../../utils';

class PageSettingEditor extends Component {
  handleChangeFreeMode(freeMode) {
    const { survey, options, runtime, view, page, changePageAttribute } = this.props;

    if (!freeMode && !confirm('フリーモードで編集した内容は失われますが本当によろしいですか？')) return;

    const props = {
      survey,
      options,
      runtime,
      view,
      page,
    };
    const pageHtml = ReactDOMServer.renderToStaticMarkup(<Page {...props} hideButtons />);
    changePageAttribute(page.getId(), 'freeMode', freeMode);
    changePageAttribute(page.getId(), 'html', prettyPrint($(pageHtml).html(), {
      indent_size: 2,
    }));
  }

  render() {
    const { page, changePageAttribute } = this.props;
    return (
      <div className="page-settings form-horizontal">
        { isDevelopment() ? (
          <FormGroup >
            <Col componentClass={ControlLabel} md={3}>フリーモード <Help placement="bottom" messageId="freeMode" /></Col>
            <Col md={9}>
              <Checkbox inline checked={page.isFreeMode()} onChange={e => this.handleChangeFreeMode(e.target.checked)}>フリーモード</Checkbox>
            </Col>
          </FormGroup>
        ) : null }
        <FormGroup>
          <Col componentClass={ControlLabel} md={3}>ゼロ埋め <Help messageId="zeroSetting" /></Col>
          <Col md={9}>
            <Radio
              name="pageZeroSetting"
              checked={page.getZeroSetting() === null}
              onChange={() => changePageAttribute(page.getId(), 'zeroSetting', null)}
            >全体設定に従う</Radio>
            <Radio
              name="pageZeroSetting"
              checked={page.getZeroSetting() === true}
              onChange={() => changePageAttribute(page.getId(), 'zeroSetting', true)}
            >有効</Radio>
            <Radio
              name="pageZeroSetting"
              checked={page.getZeroSetting() === false}
              onChange={() => changePageAttribute(page.getId(), 'zeroSetting', false)}
            >無効</Radio>
          </Col>
        </FormGroup>
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  options: state.getOptions(),
  view: state.getViewSetting(),
});
const actionsToProps = dispatch => ({
  changePageAttribute: (pageId, attributeName, value) => dispatch(EditorActions.changePageAttribute(pageId, attributeName, value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(PageSettingEditor);
