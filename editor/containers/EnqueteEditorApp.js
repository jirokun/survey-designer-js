import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SplitPane from 'react-split-pane'
import Frame from 'react-frame-component'
import EnqueteRuntimeApp from '../../runtime/containers/EnqueteRuntimeApp'
import Graph from '../components/Graph'
import ComponentList from '../components/ComponentList'
import Editor from '../components/Editor'
import PageSetting from '../components/PageSetting'
import { Tabs, Tab} from 'react-bootstrap';
import yaml from 'js-yaml'
import * as EditorActions from '../actions'
import * as RuntimeActions from '../../runtime/actions'
import * as Utils from '../../utils'

export default class EnqueteEditorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'graph'
    };
  }
  componentDidMount() {
    this.resizeGraphPane();
  }
  resizeGraphPane(e) {
    const { resizeGraphPane } = this.props;
    const width = this.refs.left.getBoundingClientRect().width;
    resizeGraphPane(width);
    this.onDragEnd();
  }
  onDragStarted() {
    this.overlay = document.createElement('div');
    this.overlay.style.width = window.innerWidth + 'px';
    this.overlay.style.height = window.innerHeight + 'px';
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
  onTabChange(e, tab) {
    e.preventDefault();
    const url = e.target.href;
    const hashIndex = url.indexOf('#');
    const targetName = url.substring(hashIndex + 1);
    this.setState({active: targetName});
  }
  render() {
    const _this = this;
    const { state, actions } = this.props;
    const splitPaneSize = {
      minSize: 100,
      defaultSize: 400
    };
    console.log(state);
    const page = Utils.findPageFromFlow(state, state.values.currentFlowId);
    let isYamlValid = false;
    if (page) {
      const draft = Utils.findDraft(state, page.id);
      if (draft) {
        isYamlValid = draft.valid;
      }
    }

    // TODO SplitPaneをiframeに対応する
    return (
      <SplitPane ref="root" split="vertical" {...splitPaneSize} onDragFinished={this.resizeGraphPane.bind(this)} onDragStarted={this.onDragStarted.bind(this)}>
        <div className="left" ref="left">
          <Tabs id="left-tab">
            <Tab eventKey={1} title="Graph"><Graph actions={actions}/></Tab>
            <Tab eventKey={2} title="ComponentList"><ComponentList/></Tab>
            <Tab eventKey={3} title="PageSetting"><PageSetting/></Tab>
          </Tabs>
        </div>
        <div className="right" ref="right">
          <SplitPane split="horizontal" {...splitPaneSize} onDragFinished={this.onDragEnd.bind(this)} onDragStarted={this.onDragStarted.bind(this)}>
            <Editor/>
            <div ref="preview" className="preview-pane">
              <Frame className={isYamlValid ? "" : "hidden"} head={
                <link rel="stylesheet" href="/css/runtime.css"/>
              }>
                <EnqueteRuntimeApp/>
              </Frame>
              <div className={isYamlValid ? "hidden" : "alert alert-danger error"}>
                <span className="glyphicon glyphicon-exclamation-sign"></span>
                <span className="sr-only">Error:</span>
                データが正しくありません
              </div>
            </div>
          </SplitPane>
        </div>
      </SplitPane>
    )
  }
}

const stateToProps = state => ({
  state: state
});
const actionsToProps = dispatch => ({
  resizeGraphPane: width => dispatch(EditorActions.resizeGraphPane(width)),
  resizeEditorPane: height => dispatch(EditorActions.resizeEditorPane(height)),
  changeCodemirror: value => dispatch(EditorActions.changeCodemirror(value))
});

export default connect(
  stateToProps,
  actionsToProps
)(EnqueteEditorApp);
