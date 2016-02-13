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
      connectMode: false
    };
  }
  componentDidMount() {
    this.cy = this.makeCytoscape();
    this.addEventListenerToCytoscape();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.updating === true) {
      this.setState({ updating: false });
      return false;
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    const { state } = this.props;
    const elements = makeCytoscapeElements(state);
    if (JSON.stringify(prevProps.state.defs) != JSON.stringify(this.props.state.defs)) {
      this.cy.load(elements);
    }
  }
  // event listener

  /** page flowを追加 */
  addPage() {
    this.addFlow('page');
  }
  /** branch flowを追加 */
  addBranch() {
    this.addFlow('branch');
  }
  addFlow(type) {
    const { state, onDefsChange } = this.props;
    const flowId = nextFlowId(state);
    this.cy.add({
      data: { id: flowId, label: flowId + '()' },
      classes: type,
      position: this.state.rightClickPosition
    });
    let flowDefs = cloneObj(state.defs.flowDefs);
    flowDefs.push({ id: flowId, type: type });
    this.setState({ updating: true });
    onDefsChange('flowDefs', flowDefs, this.props.getPreviewWindow);
  }
  removeFlow(ele) {
    const { state, onDefsChange } = this.props;
    const flowId = ele.id();
    this.cy.remove('#' + flowId);
    let flowDefs = cloneObj(state.defs.flowDefs);
    const index = flowDefs.findIndex((def) => { return def.id === flowId; });
    flowDefs.splice(index, 1);
    this.setState({ updating: true });
    onDefsChange('flowDefs', flowDefs, this.props.getPreviewWindow);
  }
  connectFlow(ele) {
    const { state, onDefsChange, getPreviewWindow } = this.props;
    const flowId = ele.id();
    this.setState({ connectMode: true });
    // TODO これは一度実行すればOK
    this.cy.on('click', (e) => {
      if (this.state.connectMode !== true) return;
      this.setState({ connectMode: false });
      const target = e.cyTarget;
      if (!target.isNode || !target.isNode()) return;
      const targetFlowId = target.id();
      let newState = cloneObj(state);
      let sourceFlow = findFlow(newState, flowId);
      if (sourceFlow.type === 'page') {
        this.cy.add({
          data: { source: sourceFlow.id, target: targetFlowId }
        });
        this.setState({ updating: true });
        sourceFlow.nextFlowId = targetFlowId;
        onDefsChange('flowDefs', newState.defs.flowDefs, getPreviewWindow);
      } else if (sourceFlow.type === 'branch') {
        this.cy.add({
          data: { source: sourceFlow.id, target: targetFlowId }
        });
        this.setState({ updating: true });
        newState.defs.conditionDefs.push({
          flowId: sourceFlow.id,
          type: 'if',
          nextFlowId: targetFlowId
        });
        onDefsChange('conditionDefs', newState.defs.conditionDefs, getPreviewWindow);
      } else {
        throw 'unknown flow type: ' + sourceFlow.type;
      }
    });
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
    this.cy.on("click", 'node.page', (e) => {
      const data = e.cyTarget.data();
      const flow = findFlow(state, data.id);
      if (!flow) return;
      const page = findPage(state, flow.pageId);
      if (!page) return;
      onFlowSelected(flow.id, getPreviewWindow);
    });
    this.cy.on('cxttapstart', (e) => {
      // nodeを追加するポイントを記録しておく
      _this.state.rightClickPosition = e.cyPosition;
    });
    this.cy.on('position', (e) => {
      const node = e.cyTarget;
      const flowId = node.data('id');
      const { x, y } = node.position();
      console.log(node.data('id'));
      // TODO positionDefsを更新
    });
    this.cy.cxtmenu({
      selector: 'edge',
      commands: [
        { content: 'remove edge', select: (edge) => { console.log(ele.id()); }}
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
        { content: 'connect flow', select: this.connectFlow.bind(this) },
        { content: 'remove page flow', select: this.removeFlow.bind(this) }
      ]
    });
    this.cy.cxtmenu({
      selector: 'node.branch',
      commands: [
        { content: 'connect flow', select: this.connectFlow.bind(this) },
        { content: 'remove branch flow', select: this.removeFlow.bind(this) }
      ]
    });

  }
  autoLayout() {
    this.cy.layout({ name: 'breadthfirst', directed: true });
  }
  load() {
    var defs = this.cy.json().elements.nodes.map((el) => {
      return { x: el.position.x, y: el.position.y, flowId: el.data.id };
    });
    console.log(this.cy.json().elements.nodes);
  }
  render() {
    const { state } = this.props;
    const href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(state, null, 2));
    return (
      <div ref="graph" className={ this.state.connectMode ? "graph connect-mode" : "graph" }>
        <div className="graph-controller btn-group">
          <button className="btn btn-default btn-sm" onClick={this.autoLayout.bind(this)}><span className="glyphicon glyphicon-th"></span></button>
          <a className="btn btn-default btn-sm" href={href} download="enquete.json"><span className="glyphicon glyphicon-floppy-save"></span></a>
          <button className="btn btn-default btn-sm" onClick={this.load.bind(this)}><span className="glyphicon glyphicon-floppy-open"></span></button>
        </div>
      </div>
    )
  }
}

Graph.propTypes = {
  state: PropTypes.object.isRequired
}
