/* eslint-env node */
/* global browser */

class BranchEditorPage {
  constructor(editorPage, branchNo) {
    this.editorPage = editorPage;
    this.branchNo = branchNo;
  }

  findBranchElement() {
    return this.editorPage.findNodeElement(`分岐 ${this.branchNo}`);
  }

  findBranchEditorElement(branchEditorIndex, selector) {
    return browser
      .elements('.editor-pane .branch-editor').value[branchEditorIndex]
      .element(selector);
  }

  findConditionEditorElement(branchEditorIndex, childConditionIndex, selector) {
    return browser
      .elements('.editor-pane .branch-editor').value[branchEditorIndex]
      .elements('.condition-editor').value[childConditionIndex]
      .element(selector);
  }

  addCondition(conditionIndex) {
    this.findBranchElement().elements('.insert-item-box').value[conditionIndex].click();
  }

  removeCondition(conditionIndex) {
    this.findBranchElement().elements('.conditions .delete-button').value[conditionIndex].click();
  }

  selectSelectElement(element, label) {
    element.click();
    const option = element.elements('option').value.find(optionEl => optionEl.getText() === label);
    option.click();
  }

  setConditionType(branchEditorIndex, label) {
    const conditionType = this.findBranchEditorElement(branchEditorIndex, '.condition-type');
    this.selectSelectElement(conditionType, label);
  }

  setNextNodeId(branchEditorIndex, label) {
    const conditionNextNodeId = this.findBranchEditorElement(branchEditorIndex, '.condition-next-node-id');
    this.selectSelectElement(conditionNextNodeId, label);
  }

  setOutputId(branchEditorIndex, childConditionIndex, label) {
    const conditionRefId = this.findConditionEditorElement(branchEditorIndex, childConditionIndex, '.condition-ref-id');
    this.selectSelectElement(conditionRefId, label);
  }

  setConditionValue(branchEditorIndex, childConditionIndex, label) {
    const conditionValue = this.findConditionEditorElement(branchEditorIndex, childConditionIndex, '.condition-value');
    this.selectSelectElement(conditionValue, label);
  }

  setValueType(branchEditorIndex, childConditionIndex, label) {
    const valueType = this.findConditionEditorElement(branchEditorIndex, childConditionIndex, '.value-type');
    this.selectSelectElement(valueType, label);
  }

  setReferenceSelect(branchEditorIndex, childConditionIndex, label) {
    const referenceSelect = this.findConditionEditorElement(branchEditorIndex, childConditionIndex, '.reference-select');
    this.selectSelectElement(referenceSelect, label);
  }

  setValue(branchEditorIndex, childConditionIndex, value) {
    const fixedValueInput = this.findConditionEditorElement(branchEditorIndex, childConditionIndex, '.fixed-value-input');
    fixedValueInput.setValue(value);
  }

  setOperator(branchEditorIndex, childConditionIndex, label) {
    const operator = this.findConditionEditorElement(branchEditorIndex, childConditionIndex, '.condition-ref-operator');
    this.selectSelectElement(operator, label);
  }

  getSelectedSelectLabel(el) {
    const value = el.getValue();
    const selectedOptionEl = el.elements('option').value.find(optionEl => optionEl.getValue() === value);
    return selectedOptionEl.getText();
  }

  getConditions() {
    this.findBranchElement().click();
    return browser.elements('.branch-editor').value.map((branchEditorEl) => {
      return {
        conditionType: this.getSelectedSelectLabel(branchEditorEl.element('.condition-type')),
        nextNodeId: this.getSelectedSelectLabel(branchEditorEl.element('.condition-next-node-id')),
        conditions: branchEditorEl.elements('.condition-editor').value.map((conditionEditorEl) => {
          let valueType = null;
          if (conditionEditorEl.isExisting('.value-editor-part select')) {
            valueType = this.getSelectedSelectLabel(conditionEditorEl.elements('.value-editor-part select').value[0]);
          }

          let value = null;
          if (conditionEditorEl.isExisting('.value-editor-part select:nth-child(2)')) {
            value = this.getSelectedSelectLabel(conditionEditorEl.element('.value-editor-part select:nth-child(2)'));
          } else if (conditionEditorEl.isExisting('.value-editor-part .react-numeric-input input')) {
            value = conditionEditorEl.element('.value-editor-part .react-numeric-input input').getValue();
          } else if (conditionEditorEl.isExisting('.fixed-value-input')) {
            value = this.getSelectedSelectLabel(conditionEditorEl.element('.fixed-value-input'));
          } else if (conditionEditorEl.isExisting('.reference-select')) {
            value = this.getSelectedSelectLabel(conditionEditorEl.element('.reference-select'));
          }

          let operator = null;
          if (conditionEditorEl.isExisting('.condition-value')) {
            operator = this.getSelectedSelectLabel(conditionEditorEl.element('.condition-value'));
          } else if (conditionEditorEl.isExisting('.condition-ref-operator')) {
            operator = this.getSelectedSelectLabel(conditionEditorEl.element('.condition-ref-operator'));
          }

          const outputId = this.getSelectedSelectLabel(conditionEditorEl.element('.condition-ref-id'));
          return { outputId, valueType, value, operator };
        }),
      };
    });
  }
}

module.exports = BranchEditorPage;
