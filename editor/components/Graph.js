import React, { Component, PropTypes } from 'react'
import { cloneObj, nextFlowId, findPage, findFlow, makeCytoscapeElements } from '../../utils'
const cytoscape = require('cytoscape');
const cycola = require('cytoscape-cola');
const jquery = require('jquery');
const cxtmenu = require('cytoscape-cxtmenu');

cycola(cytoscape, cola);
cxtmenu(cytoscape, jquery);

export default class Graph extends Component {
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
    console.log(elements);
    if (JSON.stringify(prevProps.state.defs) != JSON.stringify(this.props.state.defs)) {
      this.cy.load(elements);
    }
  }
  // event listener
  onFileSelected(e) {
    const { actions } = this.props;
    if (e.target.files.length !== 1) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const state = JSON.parse(e.target.result);
      actions.loadState(state);
    }
    reader.readAsText(file, 'UTF-8');
  }
  onClickNodePage(e) {
    const { state, actions, getPreviewWindow } = this.props;
    const data = e.cyTarget.data();
    const flow = findFlow(state, data.id);
    if (!flow) return;
    const page = findPage(state, flow.pageId);
    if (!page) return;
    actions.selectFlow(flow.id, getPreviewWindow);
  }
  onCxtTapstart(e) {
    // nodeを追加するポイントを記録しておく
    this.state.rightClickPosition = e.cyPosition;
  }
  onPositionChange(e) {
    const { state, actions, getPreviewWindow } = this.props;
    const node = e.cyTarget;
    const flowId = node.data('id');
    const { x, y } = node.position();
    actions.changePosition(flowId, x, y);
  }
  removeEdge(edge) {
    const { state, actions, getPreviewWindow } = this.props;
    const sourceFlowId = edge.source().data('id');
    const targetFlowId = edge.target().data('id');
    actions.removeEdge(sourceFlowId, targetFlowId);
  }
  /** page flowを追加 */
  addPage() {
    const { actions, getPreviewWindow } = this.props;
    const { x, y } = this.state.rightClickPosition;
    actions.addPageFlow(x, y, getPreviewWindow);
  }
  /** branch flowを追加 */
  addBranch() {
    const { actions, getPreviewWindow } = this.props;
    const { x, y } = this.state.rightClickPosition;
    actions.addBranchFlow(x, y, getPreviewWindow);
  }
  removeFlow(ele) {
    const flowId = ele.id();
    this.props.actions.removeFlow(flowId);
  }
  startConnectFlow(ele) {
    const { state } = this.props;
    const flowId = ele.id();
    this.setState({ connectMode: true, sourceFlowId: flowId });
  }
  finishConnectFlow(e) {
    if (this.state.connectMode !== true) return;
    const { state, actions, getPreviewWindow } = this.props;
    this.setState({ connectMode: false });
    const target = e.cyTarget;
    if (!target.isNode || !target.isNode()) return;
    const targetFlowId = target.id();
    actions.connectFlow(this.state.sourceFlowId, targetFlowId);
  }
  makeCytoscape() {
    const data = this.props.state.defs[this.defsName];
    const { state, onFlowSelected, getPreviewWindow,
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
            'border-width': 3,
            'border-color': '#666',
            'label': 'data(label)'
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 3,
            'border-color': '#8cc'
          }
        },
        {
          selector: '.branch',
          style: {
            'background-color': '#666',
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
    this.cy.on("click", 'node.page', this.onClickNodePage.bind(this));
    this.cy.on('click', this.finishConnectFlow.bind(this));
    this.cy.on('cxttapstart', this.onCxtTapstart.bind(this));
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
        { content: 'add page flow', select: this.addPage.bind(this) },
        { content: 'add branch flow', select: this.addBranch.bind(this) }
      ]
    });
    this.cy.cxtmenu({
      selector: 'node.page',
      commands: [
        { content: 'connect flow', select: this.startConnectFlow.bind(this) },
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
  autoLayout() {
    const { actions } = this.props;
    this.cy.layout({ name: 'breadthfirst', directed: true });
    const positions = this.cy.elements().map((e) => {
      const position = e.position()
      return { flowId: e.data('id'), x: position.x, y:position.y };
    });
    actions.setElementsPosition(positions);
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
