import React, { Component, PropTypes } from 'react'
import { cloneObj, nextFlowId, findPage, findFlow, makeCytoscapeElements } from '../../utils'
import { connect } from 'react-redux'
import { loadState, setElementsPosition, changePosition, selectFlow, removeEdge, removeFlow, addBranch, addPageFlow, addBranchFlow, connectFlow, clonePage } from '../actions'
const cytoscape = require('cytoscape');
const cycola = require('cytoscape-cola');
const jquery = require('jquery');
const cxtmenu = require('cytoscape-cxtmenu');

cycola(cytoscape, cola);
cxtmenu(cytoscape, jquery);

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightClickPosition: null,
      sourceFlowId: null,
      connectMode: false
    };
  }
  componentDidMount() {
    this.cy = this.makeCytoscape();
    this.addEventListenerToCytoscape();
  }
  componentDidUpdate(prevProps, prevState) {
    const { state } = this.props;
    const elements = makeCytoscapeElements(state);
    const zoom = this.cy.zoom();
    const pan = this.cy.pan();
    try {
      // 値が正しくない場合ここで落ちる
      this.cy.load(elements);
    } catch (e) {
      console.error(e);
      return;
    }
    // zoomとpanが更新されないように上書きする
    this.cy.zoom(zoom);
    this.cy.pan(pan);
    if (prevProps.state.viewSettings.graphWidth !== this.props.state.viewSettings.graphWidth) {
      this.cy.fit();
    }
  }
  // event listener
  onFileSelected(e) {
    const { loadState } = this.props;
    if (e.target.files.length !== 1) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const state = JSON.parse(e.target.result);
      loadState(state);
    }
    reader.readAsText(file, 'UTF-8');
  }
  onSelectFlow(e) {
    const { state, selectFlow } = this.props;
    const data = e.cyTarget.data();
    const flow = findFlow(state, data.id);
    if (!flow) return;
    selectFlow(flow.id);
  }
  onCxtTapstart(e) {
    // nodeを追加するポイントを記録しておく
    this.state.rightClickPosition = e.cyPosition;
  }
  onPositionChange(e) {
    const { state, changePosition } = this.props;
    const node = e.cyTarget;
    const flowId = node.data('id');
    const { x, y } = node.position();
    changePosition(flowId, x, y);
  }
  removeEdge(edge) {
    const { state, removeEdge } = this.props;
    const sourceFlowId = edge.source().data('id');
    const targetFlowId = edge.target().data('id');
    removeEdge(sourceFlowId, targetFlowId);
  }
  /** page flowを追加 */
  addPage() {
    const { addPageFlow } = this.props;
    const { x, y } = this.state.rightClickPosition;
    addPageFlow(x, y);
  }
  /** page 複製する */
  clonePage(ele) {
    const { clonePage } = this.props;
    const { x, y } = this.state.rightClickPosition;
    const flowId = ele.id();
    clonePage(flowId, x, y);
  }

  /** branch flowを追加 */
  addBranch() {
    const { addBranchFlow } = this.props;
    const { x, y } = this.state.rightClickPosition;
    addBranchFlow(x, y);
  }
  removeFlow(ele) {
    const { removeFlow } = this.props;
    const flowId = ele.id();
    removeFlow(flowId);
  }
  startConnectFlow(ele) {
    const { state } = this.props;
    const flowId = ele.id();
    this.setState({ connectMode: true, sourceFlowId: flowId });
  }
  finishConnectFlow(e) {
    if (this.state.connectMode !== true) return;
    const { state, connectFlow } = this.props;
    this.setState({ connectMode: false });
    const target = e.cyTarget;
    if (!target.isNode || !target.isNode()) return;
    const targetFlowId = target.id();
    connectFlow(this.state.sourceFlowId, targetFlowId);
  }
  makeCytoscape() {
    const data = this.props.state.defs[this.defsName];
    const { state, onFlowSelected,
      onDeleteFlow, onAddFlow,
      onDeleteEdge, onAddEdge
    } = this.props;
    const elements = makeCytoscapeElements(state);
    const _this = this;
    return cytoscape({
      container: this.refs.graph, // container to render in
      elements: elements,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(label)'
          }
        },
        {
          selector: '.selected',
          style: {
            'background-color': '#0ff',
          }
        },
        {
          selector: '.branch',
          style: {
            'shape': 'diamond',
            'label': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'label': 'data(label)',
            'line-color': '#ccc',
            'edge-text-rotation': 'autorotate',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'preset'
      }
    });
  }
  addEventListenerToCytoscape() {
    const _this = this;
    // TODO 全部メソッドに移動すべき
    this.cy.on("click", 'node', this.onSelectFlow.bind(this));
    this.cy.on('click', this.finishConnectFlow.bind(this));
    this.cy.on('cxttapstart', this.onCxtTapstart.bind(this));
    this.cy.on('tapstart', this.onCxtTapstart.bind(this));
    this.cy.on('tapend', 'node', this.onPositionChange.bind(this));
    this.cy.cxtmenu({
      selector: 'edge',
      commands: [
        { content: 'remove edge', select: this.removeEdge.bind(this) }
      ]
    });
    this.cy.cxtmenu({
      selector: 'core',
      commands: [
        { content: 'add page', select: this.addPage.bind(this) },
        { content: 'add branch', select: this.addBranch.bind(this) }
      ]
    });
    this.cy.cxtmenu({
      selector: 'node.page',
      commands: [
        { content: 'connect flow', select: this.startConnectFlow.bind(this) },
        { content: 'clone page', select: this.clonePage.bind(this) },
        { content: 'remove page flow', select: this.removeFlow.bind(this) }
      ]
    });
    this.cy.cxtmenu({
      selector: 'node.branch',
      commands: [
        { content: 'connect flow', select: this.startConnectFlow.bind(this) },
        { content: 'remove branch flow', select: this.removeFlow.bind(this) }
      ]
    });
  }
  fit() {
    this.cy.fit();
  }
  autoLayout() {
    const { setElementsPosition } = this.props;
    this.cy.layout({ name: 'breadthfirst', directed: true });
    const positions = this.cy.elements().map((e) => {
      const position = e.position()
      return { flowId: e.data('id'), x: position.x, y:position.y };
    });
    setElementsPosition(positions);
  }
  load() {
    var defs = this.cy.json().elements.nodes.map((el) => {
      return { x: el.position.x, y: el.position.y, flowId: el.data.id };
    });
  }
  render() {
    const { state } = this.props;
    const href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(state, null, 2));
    return (
      <div ref="graph" className={ this.state.connectMode ? "graph connect-mode" : "graph" }>
        <div className="graph-controller btn-group">
          <button className="btn btn-default btn-sm" onClick={this.fit.bind(this)}><span className="glyphicon glyphicon-screenshot"></span></button>
          <button className="btn btn-default btn-sm" onClick={this.autoLayout.bind(this)}><span className="glyphicon glyphicon-th"></span></button>
          <a className="btn btn-default btn-sm" href={href} download="enquete.json"><span className="glyphicon glyphicon-floppy-save"></span></a>
          <input id="fileInput" type="file" onChange={this.onFileSelected.bind(this)} accept=".json"/>
          <label htmlFor="fileInput" className="btn btn-default btn-sm" onClick={this.load.bind(this)}><span className="glyphicon glyphicon-floppy-open"></span></label>
        </div>
      </div>
    )
  }
}

Graph.propTypes = {
  state: PropTypes.object.isRequired
}

const stateToProps = state => ({
  state: state,
  defs: state.defs
});

const actionsToProps = dispatch => ({
  loadState: state => dispatch(loadState(state)),
  setElementsPosition: positions => dispatch(setElementsPosition(positions)),
  changePosition: (flowId, x, y) => dispatch(changePosition(flowId, x, y)),
  selectFlow: flowId => dispatch(selectFlow(flowId)),
  removeEdge: (sourceFlowId, targetFlowId) => dispatch(removeEdge(sourceFlowId, targetFlowId)),
  removeFlow: flowId => dispatch(removeFlow(flowId)),
  addPageFlow: (x, y) => dispatch(addPageFlow(x, y)),
  addBranchFlow: (x, y) => dispatch(addBranchFlow(x, y)),
  clonePage: (flowId, x, y) => dispatch(clonePage(flowId, x, y)),
  connectFlow: (sourceFlowId, targetFlowId) => dispatch(connectFlow(sourceFlowId, targetFlowId)),
});

export default connect(
  stateToProps,
  actionsToProps
)(Graph);

