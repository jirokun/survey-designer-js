/* eslint-env jest */
import ChoiceDefinition from '../../../lib/runtime/models/ChoiceDefinition';

describe('ChoiceDefinition', () => {
  describe('transformFreeInput', () => {
    it('先頭にある{$TEXT_INPUT}が<input type="text"/>タグに変換される', () => {
      const result = ChoiceDefinition.transformFreeInput('q', 0, '{$TEXT_INPUT}abc');
      expect(result).toBe('<input type="text" name="q__value1__text" id="q__value1__text" />abc');
    });

    it('文中に有る{$TEXT_INPUT}が<input type="text"/>タグに変換される', () => {
      const result = ChoiceDefinition.transformFreeInput('q', 0, 'abc{$TEXT_INPUT}abc');
      expect(result).toBe('abc<input type="text" name="q__value1__text" id="q__value1__text" />abc');
    });

    it('最後に有る{$TEXT_INPUT}が<input type="text"/>タグに変換される', () => {
      const result = ChoiceDefinition.transformFreeInput('q', 0, 'abc{$TEXT_INPUT}');
      expect(result).toBe('abc<input type="text" name="q__value1__text" id="q__value1__text" />');
    });

    it('先頭にある{$NUMBER_INPUT}が<input type="number"/>タグに変換される', () => {
      const result = ChoiceDefinition.transformFreeInput('q', 0, '{$NUMBER_INPUT}abc');
      expect(result).toBe('<input type="number" name="q__value1__text" id="q__value1__text" />abc');
    });

    it('文中に有る{$NUMBER_INPUT}が<input type="number"/>タグに変換される', () => {
      const result = ChoiceDefinition.transformFreeInput('q', 0, 'abc{$NUMBER_INPUT}abc');
      expect(result).toBe('abc<input type="number" name="q__value1__text" id="q__value1__text" />abc');
    });

    it('最後に有る{$NUMBER_INPUT}が<input type="number"/>タグに変換される', () => {
      const result = ChoiceDefinition.transformFreeInput('q', 0, 'abc{$NUMBER_INPUT}');
      expect(result).toBe('abc<input type="number" name="q__value1__text" id="q__value1__text" />');
    });
  });
});
