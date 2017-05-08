/* eslint-env jest */
import { List } from 'immutable';
import ItemDefinition from '../../../../lib/runtime/models/survey/questions/internal/ItemDefinition';
import CheckboxQuestionState from '../../../../lib/runtime/states/CheckboxQuestionState';
import CheckboxQuestionDefinition from '../../../../lib/runtime/models/survey/questions/CheckboxQuestionDefinition';

describe('CheckboxQuestionState', () => {
  describe('setItemState', () => {
    it('排他を選択したときに他の項目が未選択かつdisabledになる', () => {
      const question = CheckboxQuestionDefinition
        .create()
        .set('items', List([
          new ItemDefinition({ index: 1, exclusive: true }),
          new ItemDefinition({ index: 0, exclusive: false }),
        ]));
      const model = new CheckboxQuestionState(question).setItemState(0, true);
      expect(model.getIn(['itemState', 0, 'checked'])).toBe(true);
      expect(model.getIn(['itemState', 0, 'disabled'])).toBe(false);
      expect(model.getIn(['itemState', 1, 'checked'])).toBe(false);
      expect(model.getIn(['itemState', 1, 'disabled'])).toBe(false);

      const result = model.setItemState(1, true);
      expect(result.getIn(['itemState', 0, 'checked'])).toBe(false);
      expect(result.getIn(['itemState', 0, 'disabled'])).toBe(true);
      expect(result.getIn(['itemState', 1, 'checked'])).toBe(true);
      expect(result.getIn(['itemState', 1, 'disabled'])).toBe(false);
    });

    it('排他を解除したとき他の項目のdisabledが解除される', () => {
      const question = CheckboxQuestionDefinition
        .create()
        .set('items', List([
          new ItemDefinition({ index: 1, exclusive: true }),
          new ItemDefinition({ index: 0, exclusive: false }),
        ]));
      const model = new CheckboxQuestionState(question).setItemState(1, true);
      expect(model.getIn(['itemState', 0, 'checked'])).toBe(false);
      expect(model.getIn(['itemState', 0, 'disabled'])).toBe(true);
      expect(model.getIn(['itemState', 1, 'checked'])).toBe(true);
      expect(model.getIn(['itemState', 1, 'disabled'])).toBe(false);

      const result = model.setItemState(1, false);
      expect(result.getIn(['itemState', 0, 'checked'])).toBe(false);
      expect(result.getIn(['itemState', 0, 'disabled'])).toBe(false);
      expect(result.getIn(['itemState', 1, 'checked'])).toBe(false);
      expect(result.getIn(['itemState', 1, 'disabled'])).toBe(false);
    });
  });
});
