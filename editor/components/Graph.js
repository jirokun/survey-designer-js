import React, { Component, PropTypes } from 'react'
import { findPage, findFlow, makeCytoscapeElements } from '../../utils'
const cytoscape = require('cytoscape');
const cycola = require('cytoscape-cola');

cycola(cytoscape, cola);

export default class Graph extends Component {
  componentDidMount() {
    const data = this.props.state.defs[this.defsName];
    const { state, onFlowSelected, getPreviewWindow } = this.props;
    const elements = makeCytoscapeElements(state);
    this.cy = cytoscape({
      container: this.refs.graph, // container to render in
      elements: elements,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'border-width': 3,
            'border-color': '#666',
            'label': 'data(id)'
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
        name: 'breadthfirst',
        spacingFactor: 2.5,
        directed: true
      }
    });
    this.cy.on("click", 'node.page', (e) => {
      const data = e.cyTarget.data();
      const flow = findFlow(state, data.id);
      if (!flow) return;
      const page = findPage(state, flow.pageId);
      if (!page) return;
      onFlowSelected(flow.id, getPreviewWindow);
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextProps.state.defs) != JSON.stringify(this.props.state.defs);
  }
  componentDidUpdate() {
    const { state } = this.props;
    const elements = makeCytoscapeElements(state);
    this.cy.load(elements);
  }
  autoLayout() {
    this.cy.layout();
  }
  load() {
  }
  render() {
    const { state } = this.props;
    const href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(state, null, 2));
    return (
      <div ref="graph" className="graph">
        <div className="controller btn-group">
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
