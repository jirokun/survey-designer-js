import React, { Component, PropTypes } from 'react'
import { cloneObj, findFlow } from '../../utils'

export default class CustomPageTab extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { state, actions } = this.props;
    this.editor = CKEDITOR.replace(this.refs.htmlEditor, {
      extraPlugins: 'tableresize'
    });
    this.editor.on('change', (e) => {
      actions.changeCustomPage('custom1', this.editor.getData());
    });
  }
  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    return (
      <div className="tab-pane active">
        <div ref="htmlEditor"></div>
      </div>
    )
  }
}

CustomPageTab.propTypes = {
  state: PropTypes.object.isRequired
}


