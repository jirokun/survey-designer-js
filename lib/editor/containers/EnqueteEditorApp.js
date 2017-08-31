/* eslint-env browser */
import ReactDOMServer from 'react-dom/server';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Menu from '../components/Menu';
import Flow from '../components/Flow';
import Editor from '../components/Editor';
import AllJavaScriptEditor from '../components/editors/AllJavaScriptEditor';
import PreviewPane from '../components/PreviewPane';
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
      children.push(<PreviewPane />);
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
