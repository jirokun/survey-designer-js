/* eslint-env jest */
import { List } from 'immutable';
import CheckboxQuestionDefinition from '../../../../../lib/runtime/models/survey/questions/CheckboxQuestionDefinition';
import ItemDefinition from '../../../../../lib/runtime/models/survey/questions/internal/ItemDefinition';

describe('CheckboxQuestionDefinition', () => {
  describe('randomize', () => {
    it('itemsをランダムにできる', () => {
      const question = CheckboxQuestionDefinition.create().set('items', List.of(
        new ItemDefinition({ label: '0' }),
        new ItemDefinition({ label: '1' }),
        new ItemDefinition({ label: '2' }),
      ));
      const orderMap = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ];
      // 100回試してすべてランダムで表示されることを確認する
      for (let i = 0; i < 100; i++) {
        const result = CheckboxQuestionDefinition.randomize(question.getItems());
        if (result.get(0).getLabel() === '0') orderMap[0][0] = true;
        if (result.get(0).getLabel() === '1') orderMap[0][1] = true;
        if (result.get(0).getLabel() === '2') orderMap[0][2] = true;
        if (result.get(1).getLabel() === '0') orderMap[1][0] = true;
        if (result.get(1).getLabel() === '1') orderMap[1][1] = true;
        if (result.get(1).getLabel() === '2') orderMap[1][2] = true;
        if (result.get(2).getLabel() === '0') orderMap[2][0] = true;
        if (result.get(2).getLabel() === '1') orderMap[2][1] = true;
        if (result.get(2).getLabel() === '2') orderMap[2][2] = true;
      }
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(orderMap[i][j]).toBe(true);
        }
      }
    });

    it('itemsを固定のものを除きランダムにできる', () => {
      const question = CheckboxQuestionDefinition.create().set('items', List.of(
        new ItemDefinition({ label: '0' }),
        new ItemDefinition({ label: '1', randomFixed: true }),
        new ItemDefinition({ label: '2' }),
      ));
      const orderMap = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ];
      // 100回試してindex == 1がlabel='1'に固定されていることを確認する
      for (let i = 0; i < 100; i++) {
        const result = CheckboxQuestionDefinition.randomize(question.getItems());
        if (result.get(0).getLabel() === '0') orderMap[0][0] = true;
        if (result.get(0).getLabel() === '1') orderMap[0][1] = true;
        if (result.get(0).getLabel() === '2') orderMap[0][2] = true;
        if (result.get(1).getLabel() === '0') orderMap[1][0] = true;
        if (result.get(1).getLabel() === '1') orderMap[1][1] = true;
        if (result.get(1).getLabel() === '2') orderMap[1][2] = true;
        if (result.get(2).getLabel() === '0') orderMap[2][0] = true;
        if (result.get(2).getLabel() === '1') orderMap[2][1] = true;
        if (result.get(2).getLabel() === '2') orderMap[2][2] = true;
      }
      expect(orderMap[0][0]).toBe(true);
      expect(orderMap[0][1]).toBe(false);
      expect(orderMap[0][2]).toBe(true);
      expect(orderMap[1][0]).toBe(false);
      expect(orderMap[1][1]).toBe(true);
      expect(orderMap[1][2]).toBe(false);
      expect(orderMap[2][0]).toBe(true);
      expect(orderMap[2][1]).toBe(false);
      expect(orderMap[2][2]).toBe(true);
    });
  });

  describe('createOutputDefinitionsFromItem', () => {
    it('additionlInputを含まないitemの場合1つのOutputDefinitionが返る', () => {
      const outputDefinitions = new CheckboxQuestionDefinition({ _id: 'c1' }).getOutputDefinitionsFromItem(new ItemDefinition({ _id: 'id1', label: '0', index: 0 }), '0', '0');
      expect(outputDefinitions.size).toBe(1);
      expect(outputDefinitions.get(0).getId()).toBe('id1');
      expect(outputDefinitions.get(0).getName()).toBe('c1__value1');
    });

    it('additionlInputを含むitemの場合2つのOutputDefinitionが返る', () => {
      const outputDefinitions = new CheckboxQuestionDefinition({ _id: 'c1' }).getOutputDefinitionsFromItem(new ItemDefinition({ _id: 'id1', label: '0', index: 0, additionalInput: true }), '0', '0');
      expect(outputDefinitions.size).toBe(2);
      expect(outputDefinitions.get(0).getId()).toBe('id1');
      expect(outputDefinitions.get(1).getId()).toBe('id1__text');
      expect(outputDefinitions.get(0).getName()).toBe('c1__value1');
      expect(outputDefinitions.get(1).getName()).toBe('c1__value1__text');
    });
  });

  describe('getOutputDefinitions', () => {
    it('item(additionalInputなし)が2つある場合2つのOutputDefinitionが返る', () => {
      const items = List.of(
        new ItemDefinition({ _id: 'id1', label: '0', index: 0 }),
        new ItemDefinition({ _id: 'id2', label: '1', index: 1 }),
      );

      const outputDefinitions = new CheckboxQuestionDefinition({ _id: 'c1', items }).getOutputDefinitions('0', '0');
      expect(outputDefinitions.size).toBe(2);
      expect(outputDefinitions.get(0).getId()).toBe('id1');
      expect(outputDefinitions.get(1).getId()).toBe('id2');
      expect(outputDefinitions.get(0).getName()).toBe('c1__value1');
      expect(outputDefinitions.get(1).getName()).toBe('c1__value2');
    });

    it('item(additionalInputあり)が2つある場合4つのOutputDefinitionが返る', () => {
      const items = List.of(
        new ItemDefinition({ _id: 'id1', label: '0', index: 0, additionalInput: true }),
        new ItemDefinition({ _id: 'id2', label: '1', index: 1, additionalInput: true }),
      );

      const outputDefinitions = new CheckboxQuestionDefinition({ _id: 'c1', items }).getOutputDefinitions('0', '0');
      expect(outputDefinitions.size).toBe(4);
      expect(outputDefinitions.get(0).getId()).toBe('id1');
      expect(outputDefinitions.get(1).getId()).toBe('id1__text');
      expect(outputDefinitions.get(2).getId()).toBe('id2');
      expect(outputDefinitions.get(3).getId()).toBe('id2__text');
    });
  });
});
