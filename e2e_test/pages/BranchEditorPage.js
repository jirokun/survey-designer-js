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

  findBranchEditorElement() {
    return browser.element('.editor-pane .branch-editor-container');
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

  setConditionType(index, label) {
    this.selectSelectElement(this.findBranchEditorElement().elements('.condition-type').value[index], label);
  }

  setNextNodeId(index, label) {
    this.selectSelectElement(this.findBranchEditorElement().elements('.condition-next-node-id').value[index], label);
  }

  setOutputId(index, label) {
    this.selectSelectElement(this.findBranchEditorElement().elements('.condition-ref-id').value[index], label);
  }

  setConditionValue(index, label) {
    this.selectSelectElement(this.findBranchEditorElement().elements('.condition-value').value[index], label);
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
          const isValueTypeEditorExist = conditionEditorEl.isExisting('.value-editor-part select');
          let value;
          const isValueSelectExist = conditionEditorEl.isExisting('.value-editor-part select:nth-child(2)');
          const isValueInputExist = conditionEditorEl.isExisting('.value-editor-part .react-numeric-input input');
          if (isValueSelectExist) {
            value = this.getSelectedSelectLabel(conditionEditorEl.element('.value-editor-part select:nth-child(2)'));
          } else if (isValueInputExist) {
            value = conditionEditorEl.element('.value-editor-part .value-editor-part .react-numeric-input input').getValue();
          }
          const outputId = this.getSelectedSelectLabel(conditionEditorEl.element('.condition-ref-id'));
          return {
            outputId,
            valueType: isValueTypeEditorExist ? this.getSelectedSelectLabel(conditionEditorEl.elements('.value-editor-part select').value[0]) : null,
            value: value || null,
            operator: conditionEditorEl.isExisting('.condition-value') ? this.getSelectedSelectLabel(conditionEditorEl.element('.condition-value')) : null,
          };
        }),
      };
    });
  }
}

module.exports = BranchEditorPage;
