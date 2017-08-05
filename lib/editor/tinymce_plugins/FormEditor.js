/* eslint-env browser */
import React from 'react';
import { Modal, Form, FormGroup, Col, FormControl, ControlLabel } from 'react-bootstrap';

export default class FormEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: true,
    };
  }

  render() {
    const { survey, runtime, selectedElement } = this.props;
    const page = runtime.findCurrentPage(survey);
    const outputDefinitions = page.getOutputDefinitions(survey);
    console.log(outputDefinitions);

    return (
      <Modal key="dialog-development" show={this.state.isShown} onHide={() => this.setState({ isShown: false })}>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={2}>紐つける項目</Col>
              <Col sm={10}>
                <FormControl componentClass="select">
                  <option>選択してください</option>
                  {
                    outputDefinitions.map(od => <option value={od.getName()}>{od.getOutputNo()} {od.getLabel()}</option>)
                  }
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={2}>クラス名</Col>
              <Col sm={10}><FormControl defaultValue={selectedElement.className} /></Col>
            </FormGroup>

          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
