/* eslint-env jest */
import PersonalInfoQuestionDefinition from '../../../../../lib/runtime/models/survey/questions/PersonalInfoQuestionDefinition';
import * as FIELDS from '../../../../../lib/constants/personalInfoFields';

describe('PersonalInfoQuestionDefinition', () => {
  describe('updateDefaultItems', () => {
    it('itemsに初期値を設定できる', () => {
      let pq = new PersonalInfoQuestionDefinition();

      pq = pq.updateDefaultItems();
      expect(pq.getItems().size).toBe(23);
      expect(pq.getItems().get(0).getRowType()).toBe('NameRow');
      expect(pq.getItems().get(22).getRowType()).toBe('InterviewRow');
    });
  });

  describe('getOutputName', () => {
    it('OutputNameを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      expect(pq.getOutputName(FIELDS.name)).toBe(`${pq.getId()}_${FIELDS.name}`);
    });
  });

  describe('getCheckboxLabelId', () => {
    it('LabelIdを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.name);
      expect(pq.getCheckboxLabelId(outputName)).toBe(`${outputName}__text`);
    });
  });

  describe('getCheckboxLabelIdByPropName', () => {
    it('LabelIdを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.name);
      expect(pq.getCheckboxLabelIdByPropName(FIELDS.name)).toBe(`${outputName}__text`);
    });
  });

  describe('getLabel', () => {
    it('ラベルを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();

      const item = pq.getItems().get(0);
      const field = item.getFields().get(0);
      expect(pq.getLabel(item, field)).toBe('氏名/氏名');
    });
  });

  describe('getFieldName', () => {
    it('フィールド名を返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.name);
      expect(pq.getFieldName(outputName)).toBe(FIELDS.name);
    });
  });

  describe('isHomeTelCheckbox', () => {
    it('自宅電話番号チェックボックスの場合、trueを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.scheduleContactHomeTel);
      expect(pq.isHomeTelCheckbox(outputName)).toBeTruthy();
    });

    it('自宅電話番号チェックボックスでない場合、falseを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.scheduleContactMobileTel);
      expect(pq.isHomeTelCheckbox(outputName)).toBeFalsy();
    });
  });

  describe('isMobileTelCheckbox', () => {
    it('携帯電話番号チェックボックスの場合、trueを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.scheduleContactMobileTel);
      expect(pq.isMobileTelCheckbox(outputName)).toBeTruthy();
    });

    it('携帯電話番号チェックボックスでない場合、falseを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.scheduleContactWorkTel);
      expect(pq.isMobileTelCheckbox(outputName)).toBeFalsy();
    });
  });

  describe('isWorkTelCheckbox', () => {
    it('携帯電話番号チェックボックスの場合、trueを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.scheduleContactWorkTel);
      expect(pq.isWorkTelCheckbox(outputName)).toBeTruthy();
    });

    it('携帯電話番号チェックボックスでない場合、falseを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.scheduleContactEmail);
      expect(pq.isWorkTelCheckbox(outputName)).toBeFalsy();
    });
  });

  describe('isEmailCheckbox', () => {
    it('携帯電話番号チェックボックスの場合、trueを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.scheduleContactEmail);
      expect(pq.isEmailCheckbox(outputName)).toBeTruthy();
    });

    it('携帯電話番号チェックボックスでない場合、falseを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      const outputName = pq.getOutputName(FIELDS.scheduleContactHomeTel);
      expect(pq.isEmailCheckbox(outputName)).toBeFalsy();
    });
  });

  describe('getOutputDefinitions', () => {
    it('outputDefinitionを返す', () => {
      const pq = new PersonalInfoQuestionDefinition().updateDefaultItems();
      expect(pq.getOutputDefinitions().size).toBe(21);
      expect(pq.getOutputDefinitions().get(0).getLabel()).toBe('氏名/氏名');
    });
  });
});
