import React, { Component } from 'react';

export default class Finisher extends Component {
  render() {
    const { finisher } = this.props;
    return (
      <div className="notice" dangerouslySetInnerHTML={{ __html: finisher.getHtml() }} />
    );
  }
}
