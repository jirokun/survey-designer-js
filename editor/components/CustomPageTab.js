import React, { Component, PropTypes } from 'react'
import { cloneObj, findFlow } from '../../utils'

export default class CustomPageTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tab-pane active">
      </div>
    )
  }
}

CustomPageTab.propTypes = {
  state: PropTypes.object.isRequired
}
