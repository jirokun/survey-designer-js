/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import S from 'string';
import classNames from 'classnames';
import Page from '../../runtime/components/Page';
import Finisher from '../../runtime/components/Finisher';
import BranchEditor from '../../editor/components/editors/BranchEditor';
import * as Actions from '../../runtime/actions';
import { showDevId, isDevelopment } from '../../utils';
import ImagePopup from '../../runtime/components/plain/ImagePopup';
import NumberValidation from '../../runtime/components/plain/NumberValidation';
import Reprint from '../../runtime/components/plain/Reprint';

/** 制御情報表示のためのコンテナ */
class EnqueteDetailApp extends Component {
  componentDidMount() {
    const { survey } = this.props;

    // Reactを使わないコンポーネントを定義する
    if (isDevelopment()) showDevId(this.rootEl);
    new ImagePopup(this.rootEl).initForDetail();
    new NumberValidation(this.rootEl, survey).initForDetail();
    new Reprint(this.rootEl, survey).initForDetail();
  }

  /** nodeを描画 */
  createNode(node) {
    const { survey, options, runtime, view } = this.props;
    const showPageNo = options.isShowPageNo();

    if (node === null) {
      return <div>削除されたノードです</div>;
    } else if (node.isPage()) {
      const page = survey.findPageFromNode(node.getId());
      const pageProps = {
        survey,
        options,
        runtime,
        view,
        page,
      };
      return (
        <div>
          <div className={classNames('page-no', { hidden: !showPageNo })} data-dev-id-label={page.getDevId()}>
            {page.getLogicalVariables().size > 0 ? <span className="detail-function">ロジック変数</span> : null}
            {!S(page.getJavaScriptCode()).isEmpty() ? <span className="detail-function">JavaScript</span> : null}
            {page.isFreeMode() ? <span className="detail-function">フリーモード</span> : null}
            ページ {survey.calcPageNo(page.getId())}
          </div>
          <Page key={node.getId()} {...pageProps} doNotTransition showEditModeMessage doNotExecuteJavaScript />
        </div>
      );
    } else if (node.isBranch()) {
      const branch = survey.findBranchFromNode(node.getId());
      return (
        <div key={node.getId()}>
          <div className={classNames('branch-no', { hidden: !showPageNo })}>分岐 {survey.calcBranchNo(branch.getId())}</div>
          <BranchEditor node={node} branch={branch} />
        </div>
      );
    } else if (node.isFinisher()) {
      const finisher = survey.findFinisherFromNode(node.getId());
      return (
        <div>
          <div className={classNames('finisher-no', { hidden: !showPageNo })}>終了 {survey.calcFinisherNo(finisher.getId())} {finisher.isComplete() ? 'COMPLETE' : 'SCREEN'}</div>
          <Finisher
            key={node.getId()}
            finisher={finisher}
            doNotPostAnswers
          />
        </div>
      );
    }
    throw new Error(`不明なnodeTypeです。type: ${node.getType()}`);
  }

  render() {
    const { survey, options } = this.props;

    const headerHtml = options.getHeaderHtml();
    survey.refreshReplacer();
    return (
      <div className={isDevelopment() && 'development'}>
        {survey.getCssRuntimeUrls().toArray().map(url => <link key={url} type="text/css" rel="stylesheet" href={url} />)}
        {survey.getCssPreviewUrls().toArray().map(url => <link key={url} type="text/css" rel="stylesheet" href={url} />)}
        { headerHtml ? <div className="survey-header" dangerouslySetInnerHTML={{ __html: headerHtml }} /> : null }
        <div ref={(el) => { this.rootEl = el; }} id="content">
          <div id="surveyBox">
            <h1>{survey.getTitle()}</h1>
          </div>
          <div>
            {survey.getNodes().map(node => (
              <div key={`${node.getId()}_container`} className="questionsEditBox">
                {this.createNode(node)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  survey: state.getSurvey(),
  runtime: state.getRuntime(),
  view: state.getViewSetting(),
  options: state.getOptions(),
});
const actionsToProps = dispatch => ({
  restart: () => dispatch(Actions.restart()),
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnqueteDetailApp);
