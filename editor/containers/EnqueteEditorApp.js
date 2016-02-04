import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

export default class EnqueteEditorApp extends Component {
  componentDidMount() {
    var data = [
      { id: 'flow1', type: 'page', pageId: 'page1', nextFlowId: 'flow2'},
      { id: 'flow2', type: 'page', pageId: 'page2', nextFlowId: 'flow3'},
      { id: "flow3", type: "branch", conditionId: 'cond1'},
      { id: 'flow4', type: 'page', pageId: 'page3', nextFlowId: '__END__'},
      { id: 'flow5', type: 'page', pageId: 'page4', nextFlowId: '__END__'}
    ];

    var hot = new Handsontable(this.refs.flowsHot, {
      colHeaders: ['ID', 'Type', 'PageId', 'NextFlowId', 'ConditionId'],
      columns: [
        {data: 'id'},
        {data: 'type', editor: 'select', selectOptions: ['page', 'branch']},
        {data: 'pageId'},
        {data: 'nextFlowId'},
        {data: 'conditionId'}
      ],
      width: 100,
      data: data
    });
  }
  render() {
    return (
      <div>
        <div className="left" ref="left">cytoscape.jsを動かす</div>
        <div className="right" ref="right">
          <ul className="nav nav-tabs">
            <li className="active"><a href="#flows-tab" data-toggle="tab">Flows</a></li>
            <li ><a href="#conditions-tab" data-toggle="tab">Conditions</a></li>
            <li ><a href="#pages-tab" data-toggle="tab">Pages</a></li>
            <li ><a href="#questions-tab" data-toggle="tab">Questions</a></li>
            <li ><a href="#items-tab" data-toggle="tab">Items</a></li>
          </ul>

          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="flows-tab">
              <div ref="flowsHot"></div>
            </div>
            <div role="tabpanel" className="tab-pane" id="pages-tab">
              <div ref="pagesHot"></div>
            </div>
            <div role="tabpanel" className="tab-pane" id="questions-tab">
              <div ref="questionsHot"></div>
            </div>
            <div role="tabpanel" className="tab-pane" id="items-tab">
              <div ref="itemsHot"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
