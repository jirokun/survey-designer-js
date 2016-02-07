import React, { Component, PropTypes } from 'react'
import { findFlow, makeCytoscapeElements } from '../../utils'
const cytoscape = require('cytoscape');
const cycola = require('cytoscape-cola');

cycola(cytoscape, cola);

export default class Graph extends Component {
  componentDidMount() {
    const data = this.props.state.defs[this.defsName];
    const { state } = this.props;
    const elements = makeCytoscapeElements(state);
    this.cy = cytoscape({
      container: this.refs.graph, // container to render in
      elements: 
      [
        { // node a
          data: { id: 'a' }
        },
        { // node b
          data: { id: 'b' }
        },
        { // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true
      }
    });
    this.cy.load(elements);
  }
  componentWillUnmount() {
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { flowDefs, conditionDefs } = this.props.state.defs;
    const { newFlowDefs, newConditionDefs } = nextProps.state.defs;
    return true;
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
