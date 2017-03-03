/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import Frame from 'react-frame-component';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import runtimeCss from '!css!sass!../../runtime/css/runtime.scss';
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp';
import Menu from '../components/Menu';
import Graph from '../components/Graph';
import Editor from '../components/Editor';
import * as EditorActions from '../actions';

/** エディタアプリのコンテナ */
class EnqueteEditorApp extends Component {
  /** プレビューペインを描画する */
  static renderPreviewPane() {
    // ランタイム時に使用するcssを環境変数(.env)から取得する。
    // カンマ区切りでURLを指定すると、URLのlinkタグがプレビューアプリに注入される
    const cssLinks = ENV.RUNTIME_CSS_URL.split(/,/).map(url => `<link type="text/css" rel="stylesheet" href="${url}" />`).join('');
    return (
      <div key="previewPane" className="preview-pane">
        <Frame
          initialContent={`
            <!DOCTYPE html>
            <html>
            <head>
              ${cssLinks}
              <style>${runtimeCss}</style>
            </head>
            <body class="m3-enquete__user-agent-group--PC">
              <div id="runtime-container"></div>
            </body>
          </html>`}
          mountTarget="#runtime-container"
        >
          <EnqueteRuntimeApp noPostAnswer />
        </Frame>
      </div>
    );
  }

  /**
   * EnqueteEditorAppの中でiframeを利用しており、iframeの上で
   * はmousemoveが受け取ることができず、SplitPaneのdragが正しく動作しない。
   * この問題を回避するため、drag開始時にoverlayをwindow全体にかぶせて
   * すべての箇所でmousemoveイベントを受け取れるようにしている。
   */
  handleDragStarted() {
    this.overlay = document.createElement('div');
    this.overlay.style.width = `${window.innerWidth}px`;
    this.overlay.style.height = `${window.innerHeight}px`;
    this.overlay.style.position = 'absolute';
    this.overlay.style.top = '0px';
    this.overlay.style.left = '0px';
    document.body.appendChild(this.overlay);
  }

  /** dragが終わったタイミングでhandleDragStartedで生成したoverlayを除去する */
  handleDragFinished() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      delete this.overlay;
    }
  }

  /** 表示の設定によって1,2,3ペインでの表示を切り替える */
  render() {
    const { state } = this.props;
    const splitPaneSize = {
      defaultSize: 300,
    };
    const rightSplitPaneSize = {
      defaultSize: '50%',
    };

    const viewSetting = state.getViewSetting();
    let panes;
    const children = [];
    if (viewSetting.getGraphPane()) {
      children.push(<Graph key="graphPane" />);
    }
    if (viewSetting.getEditorPane()) {
      children.push(<Editor key="editorPane" />);
    }
    if (viewSetting.getPreviewPane()) {
      children.push(EnqueteEditorApp.renderPreviewPane());
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
  state,
});

// HTML5BackendのDragDropContextのHOC
export default DragDropContext(HTML5Backend)(
  connect(
    stateToProps,
  )(EnqueteEditorApp),
);
