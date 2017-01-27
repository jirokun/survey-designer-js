/* eslint-env browser */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import Frame from 'react-frame-component';
import { Tabs, Tab } from 'react-bootstrap';
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp';
import Graph from '../components/Graph';
import Editor from '../components/Editor';
import Menu from '../components/Menu';
import PageSetting from '../components/PageSetting';
import * as EditorActions from '../actions';
import runtimeCss from '!css!sass!../../runtime/css/runtime.scss';

export class EnqueteEditorApp extends Component {
  onDragStarted() {
    this.overlay = document.createElement('div');
    this.overlay.style.width = `${window.innerWidth}px`;
    this.overlay.style.height = `${window.innerHeight}px`;
    this.overlay.style.position = 'absolute';
    this.overlay.style.top = '0px';
    this.overlay.style.left = '0px';
    document.body.appendChild(this.overlay);
  }

  onDragEnd() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      delete this.overlay;
    }
  }

  renderPreviewPane() {
    const style = <style type="text/css" dangerouslySetInnerHTML={{ __html: runtimeCss[0][1] }} />;
    return (
      <div className="preview-pane">
        <Frame head={style}>
          <EnqueteRuntimeApp />
        </Frame>
      </div>
    );
  }

  render() {
    const { state } = this.props;
    const splitPaneSize = {
      minSize: 100,
      defaultSize: 300,
    };
    const rightSplitPaneSize = {
      minSize: 600,
      defaultSize: '50%',
    };

    // iframeの中にstyleを入れるためhead属性に下記のstyleを設定する
    const viewSetting = state.getViewSetting();
    let panes;
    const children = [];
    if (viewSetting.getPageListPane()) {
      children.push(<Graph />);
    }
    if (viewSetting.getEditorPane()) {
      children.push(<Editor />);
    }
    if (viewSetting.getPreviewPane()) {
      children.push(this.renderPreviewPane());
    }
    if (children.length === 3) {
      // すべて表示する場合3ペイン
      panes = (
        <SplitPane
          split="vertical"
          {...splitPaneSize}
          onDragFinished={() => this.onDragEnd(this)}
          onDragStarted={() => this.onDragStarted(this)}
        >
          {children[0]}
          <SplitPane
            split="vertical"
            {...rightSplitPaneSize}
            onDragFinished={() => this.onDragEnd(this)}
            onDragStarted={() => this.onDragStarted()}
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
          onDragFinished={() => this.onDragEnd(this)}
          onDragStarted={() => this.onDragStarted(this)}
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

    // TODO SplitPaneをiframeに対応する
    return (
      <div>
        <Menu />
        {panes}
      </div>
    );
  }
}

const stateToProps = state => ({
  runtimeValues: state.get('runtimeValues'),
  state,
});
const actionsToProps = dispatch => ({
  resizeGraphPane: width => dispatch(EditorActions.resizeGraphPane(width)),
  resizeEditorPane: height => dispatch(EditorActions.resizeEditorPane(height)),
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value)),
});

export default connect(
  stateToProps,
  actionsToProps,
)(EnqueteEditorApp);
