/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import numbro from 'numbro';
import pikaday from 'pikaday';
import Zeroclipboard from 'zeroclipboard';
import Handsontable from 'handsontable';
import HotTable from 'react-handsontable';
import 'handsontable/dist/handsontable.full.css';
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp';
import * as Actions from '../../runtime/actions';

/** プレビューのためのコンテナ */
class EnquetePreviewApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'pc',
      answerOpen: true,
    };
  }

  handleAnswerValueChange(changes, source) {
    const { survey, changeAnswers, selectNode } = this.props;
    if (source === 'loadData') return;
    const allOutputDefinitions = survey.getAllOutputDefinitions();
    const changedAnswer = {};
    changes.forEach((change) => {
      if (change[0] === 0) {
        // ページの更新
        const pageLabel = change[3];
        const match = pageLabel.match(/^(ページ|終了) (\d+)$/);
        if (match) {
          const ref = match[1] === 'ページ' ? survey.getPages().find(p => survey.calcPageNo(p.getId()) === match[2]) : 
            survey.getFinishers().find(f => survey.calcPageNo(f.getId()) === match[2]);
          const node = survey.findNodeFromRefId(ref.getId());
          selectNode(node.getId());
        }
      } else {
        changedAnswer[allOutputDefinitions.get(change[0] - 1).getName()] = change[3];
      }
    });
    changeAnswers(changedAnswer);
  }

  changeView(mode) {
    this.setState({ mode });
    this.props.parsleyWrapper.destroy();
  }

  render() {
    const { survey, runtime, restart } = this.props;
    const { mode } = this.state;

    if (mode === 'pc') {
      document.body.className = 'm3-enquete__user-agent-group--PC';
    } else {
      document.body.className = 'm3-enquete__user-agent-group--SP';
    }

    const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/).map(url => <link key={url} type="text/css" rel="stylesheet" href={url} />);
    const answers = runtime.getAnswers();
    const hotData = survey.getAllOutputDefinitions().map(od => (
      {
        outputNo: od.getOutputNo(),
        dlLabel: od.getDlLabel(),
        value: answers.get(od.getName()),
        name: od.getName(),
      }
    )).toArray();

    const node = runtime.findCurrentNode(survey);
    if (node.isPage()) {
      const page = runtime.findCurrentPage(survey);
      hotData.unshift({
        outputNo: 'ページ名',
        dlLabel: null,
        value: `ページ ${survey.calcPageNo(page.getId())}`,
        name: null,
      });
    } else if (node.isFinisher()) {
      const finisher = runtime.findCurrentFinisher(survey);
      hotData.unshift({
        outputNo: 'ページ名',
        dlLabel: null,
        value: `終了 ${survey.calcPageNo(finisher.getId())}`,
        name: null,
      });
    } else {
      throw new Error(`想定しないnodeType: ${node.geType()}`);
    }

    return (
      <div>
        {cssLinks}
        <div className={classNames('preview-main', { open: this.state.answerOpen })}>
          <div className="formButtons preview">
            <p>[プレビュー モード] 回答は保存されません</p>
            <button onClick={() => restart()}>やり直す</button>
            <button onClick={() => window.close()}>閉じる</button>
            <button className="spMode pc" style={{ marginLeft: '50px' }} onClick={() => this.changeView('pc')}>PC表示</button>
            <button className="spMode sp" onClick={() => this.changeView('sp')}>スマホ表示</button>
          </div>
          <EnqueteRuntimeApp doNotPostAnswers showEditModeMessage showAnswerDownloadLink />
        </div>
        <div className="preview-answer">
          <h3>回答値</h3>
          <HotTable
            data={hotData}
            columns={[
              { data: 'outputNo', readOnly: true },
              { data: 'dlLabel', readOnly: true },
              { data: 'value' },
            ]}
            colHeaders={['設問番号', 'CSV出力時のカラム名', '値']}
            afterChange={(value, event) => this.handleAnswerValueChange(value, event)}
          />
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
  changeAnswers: answers => dispatch(Actions.changeAnswers(answers)),
  selectNode: nodeId => dispatch(Actions.selectNode(nodeId)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnquetePreviewApp);
