import React, { Component, PropTypes } from 'react'
import { findFlow, makeCytoscapeElements } from '../../utils'
const cytoscape = require('cytoscape');
//const cycola = require('cytoscape-cola');
//const cola = require('cola');

//cycola(cytoscape, cola);

export default class Graph extends Component {
  componentDidMount() {
    const data = this.props.state.defs[this.defsName];
    const { state } = this.props;
    const elements = makeCytoscapeElements(state);
    console.log(elements);
    var cy = cytoscape({
      container: this.refs.graph, // container to render in
      elements: elements, /*
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
      */
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
        name: 'grid',
        rows: 1
      }
    });
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <div ref="graph" className="graph">
      </div>
    )
  }
}

Graph.propTypes = {
  state: PropTypes.object.isRequired
}
