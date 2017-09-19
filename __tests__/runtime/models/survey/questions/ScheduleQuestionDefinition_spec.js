/* eslint-env jest */
import ScheduleQuestionDefinition from '../../../../../lib/runtime/models/survey/questions/ScheduleQuestionDefinition';

describe('ScheduleQuestionDefinition', () => {
  describe('updateDefaultItems', () => {
    it('itemsに初期値を設定できる', () => {
      let scheduleQuestionDefinition = new ScheduleQuestionDefinition();

      scheduleQuestionDefinition = scheduleQuestionDefinition.updateDefaultItems();
      expect(scheduleQuestionDefinition.getItems().size).toBe(2);
      expect(scheduleQuestionDefinition.getItems().get(0).getLabel()).toBe('9月2日(月)');
      expect(scheduleQuestionDefinition.getItems().get(1).getLabel()).toBe('9月3日(火)');
    });
  });

  describe('updateDefaultSubItems', () => {
    it('subItemsに初期値を設定できる', () => {
      let scheduleQuestionDefinition = new ScheduleQuestionDefinition();

      scheduleQuestionDefinition = scheduleQuestionDefinition.updateDefaultSubItems();
      expect(scheduleQuestionDefinition.getSubItems().size).toBe(3);
      expect(scheduleQuestionDefinition.getSubItems().get(0).getLabel()).toBe('<b>A.<br />午前<br />9:00～12:00</b>');
      expect(scheduleQuestionDefinition.getSubItems().get(1).getLabel()).toBe('<b>B.<br />午後<br />12:00～16:00</b>');
      expect(scheduleQuestionDefinition.getSubItems().get(2).getLabel()).toBe('<b>C.<br />夜間<br />16:00 以降</b>');
    });
  });
});
