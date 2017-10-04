/* eslint-disable no-undef */
/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import Frame from 'react-frame-component';
import classNames from 'classnames';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import photoSwipeCss from '!css-loader!photoswipe/dist/photoswipe.css';
import photoSwipeDefaultSkinCSS from '!css-loader!photoswipe/dist/default-skin/default-skin.css';
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp';
import Menu from '../components/Menu';
import Flow from '../components/Flow';
import Editor from '../components/Editor';
import AllJavaScriptEditor from '../components/editors/AllJavaScriptEditor';
import { SURVEY_NOT_MODIFIED, SURVEY_POSTED_SUCCESS } from '../../constants/states';
import { isDevelopment } from '../../utils';
import '../css/bootstrap.less';

/** エディタアプリのコンテナ */
class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = { dragging: false };
  }

  /** Reactのライフサイクルメソッド */
  componentDidMount() {
    if (isDevelopment()) return;
    // 保存がされていない場合に遷移をしようとした場合は警告を出す
    window.addEventListener('beforeunload', (e) => {
      const { view } = this.props;
      const saveSurveyStatus = view.getSaveSurveyStatus();
      if (!(saveSurveyStatus === SURVEY_NOT_MODIFIED || saveSurveyStatus === SURVEY_POSTED_SUCCESS)) {
        e.returnValue = '修正が保存されていませんがこのページから遷移しますか？';
      }
    }, false);
  }


  /**
   * EnqueteEditorAppの中でiframeを利用しており、iframeの上で
   * はmousemoveが受け取ることができず、SplitPaneのdragが正しく動作しない。
   * この問題を回避するため、drag開始時にiframeをhiddenにする
   */
  handleDragStarted() {
    this.setState({ dragging: true });
  }

  /** dragが終わったタイミングでiframeを表示する */
  handleDragFinished() {
    this.setState({ dragging: false });
  }

  /** プレビューペインを描画する */
  createPreviewPane() {
    const { survey } = this.props;
    const frameKey = survey.getCssRuntimeUrls().toArray().concat(survey.getCssPreviewUrls().toArray()).join(',');

    // ランタイム時に使用するcssを環境変数(.env)から取得する。
    // カンマ区切りでURLを指定すると、URLのlinkタグがプレビューアプリに注入される
    return (
      <div key="previewPane" className={classNames('preview-pane', { hidden: this.state.dragging })}>
        <Frame
          key={frameKey}
          initialContent={`
            <!DOCTYPE html>
            <html>
            <head>
              <style>${photoSwipeCss}</style>
              <style>${photoSwipeDefaultSkinCSS}</style>
              ${survey.getCssRuntimeUrls().toArray().map(url => `<link type="text/css" rel="stylesheet" href=${url} />`).join('\n')}
              ${survey.getCssPreviewUrls().toArray().map(url => `<link type="text/css" rel="stylesheet" href=${url} />`).join('\n')}
            </head>
            <body class="m3-enquete__user-agent-group--PC">
              <div id="runtime-container"></div>
            </body>
          </html>`}
          mountTarget="#runtime-container"
        >
          <EnqueteRuntimeApp doNotPostAnswers doNotTransition doNotExecuteJavaScript doNotValidate />
        </Frame>
      </div>
    );
  }


  /** 表示の設定によって1,2,3ペインでの表示を切り替える */
  render() {
    const { runtime, view } = this.props;
    const splitPaneSize = {
      defaultSize: 300,
    };
    const rightSplitPaneSize = {
      defaultSize: '50%',
    };

    const nodeId = runtime.getCurrentNodeId();

    if (view.getShowAllJsEditor()) {
      return <AllJavaScriptEditor />;
    }

    let panes;
    const children = [];
    if (view.getFlowPane()) {
      children.push(<Flow key="flowPane" />);
    }
    if (view.getEditorPane()) {
      children.push(<Editor key={`editorPane-${nodeId}`} />);
    }
    if (view.getPreviewPane()) {
      children.push(this.createPreviewPane());
    }
    if (children.length === 3) {
      // すべて表示する場合3ペイン
      panes = (
        <SplitPane
          split="vertical"
          {...splitPaneSize}
          onDragFinished={() => this.handleDragFinished()}
          onDragStarted={() => this.handleDragStarted()}
        >
          {children[0]}
          <SplitPane
            split="vertical"
            {...rightSplitPaneSize}
            onDragFinished={() => this.handleDragFinished()}
            onDragStarted={() => this.handleDragStarted()}
          >
            {children[1]}
            {children[2]}
          </SplitPane>
        </SplitPane>
      );
    } else if (children.length === 2) {
      panes = (
        <SplitPane
          split="vertical"
          {...splitPaneSize}
          onDragFinished={() => this.handleDragFinished()}
          onDragStarted={() => this.handleDragStarted()}
        >
          {children}
        </SplitPane>
      );
    } else if (children.length === 1) {
      panes = (
        <div>
          {children}
        </div>
      );
    }

    return (
      <div>
        <Menu />
        <div className="main">
          {panes}
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

// HTML5BackendのDragDropContextのHOC
export default DragDropContext(HTML5Backend)(
  connect(
    stateToProps,
  )(EnqueteEditorApp),
);
