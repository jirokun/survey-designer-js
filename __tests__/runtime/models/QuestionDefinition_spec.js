/* eslint-env jest */
import { List } from 'immutable';
import { json2ImmutableState } from '../../../lib/editor/store';
import QuestionDefinition from '../../../lib/runtime/models/QuestionDefinition';
import ChoiceDefinition from '../../../lib/runtime/models/ChoiceDefinition';
import sample1 from './sample1.json';

describe('QuestionDefinition', () => {
  describe('randomize', () => {
    it('choicesをランダムにできる', () => {
      const question = QuestionDefinition.create().set('choices', List.of(
        new ChoiceDefinition({ label: '0' }),
        new ChoiceDefinition({ label: '1' }),
        new ChoiceDefinition({ label: '2' }),
      ));
      const orderMap = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ];
      // 100回試してすべてランダムで表示されることを確認する
      for (let i = 0; i < 100; i++) {
        const result = QuestionDefinition.randomize(question.getChoices());
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

    it('choicesを固定のものを除きランダムにできる', () => {
      const question = QuestionDefinition.create().set('choices', List.of(
        new ChoiceDefinition({ label: '0' }),
        new ChoiceDefinition({ label: '1', randomFixed: true }),
        new ChoiceDefinition({ label: '2' }),
      ));
      const orderMap = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ];
      // 100回試してindex == 1がlabel='1'に固定されていることを確認する
      for (let i = 0; i < 100; i++) {
        const result = QuestionDefinition.randomize(question.getChoices());
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
});
