/* eslint-env jest */
import ChoiceDefinition from '../../../lib/runtime/models/questions/ChoiceDefinition';

describe('ChoiceDefinition', () => {
  describe('transform', () => {
    it('先頭にある{$TEXT_INPUT}がある場合正しくparseされる', () => {
      const input = new ChoiceDefinition({ label: '{$TEXT_INPUT}abc' });
      const result = input.parseLabel('a', 0);
      expect(result.getLabel()).toBe('');
      expect(result.getUnit()).toBe('abc');
      expect(result.hasTextInput()).toBe(true);
      expect(result.hasNumberInput()).toBe(false);
    });

    it('中間にある{TEXT_INPUT}がある場合正しくparseされる', () => {
      const input = new ChoiceDefinition({ label: 'xyz{$TEXT_INPUT}abc' });
      const result = input.parseLabel('a', 0);
      expect(result.getLabel()).toBe('xyz');
      expect(result.getUnit()).toBe('abc');
      expect(result.hasTextInput()).toBe(true);
      expect(result.hasNumberInput()).toBe(false);
    });

    it('最後にある{TEXT_INPUT}がある場合正しくparseされる', () => {
      const input = new ChoiceDefinition({ label: 'xyz{$TEXT_INPUT}' });
      const result = input.parseLabel('a', 0);
      expect(result.getLabel()).toBe('xyz');
      expect(result.getUnit()).toBe('');
      expect(result.hasTextInput()).toBe(true);
      expect(result.hasNumberInput()).toBe(false);
    });

    it('先頭にある{$NUMBER_INPUT}がある場合正しくparseされる', () => {
      const input = new ChoiceDefinition({ label: '{$NUMBER_INPUT}abc' });
      const result = input.parseLabel('a', 0);
      expect(result.getLabel()).toBe('');
      expect(result.getUnit()).toBe('abc');
      expect(result.hasTextInput()).toBe(false);
      expect(result.hasNumberInput()).toBe(true);
    });

    it('中間にある{NUMBER_INPUT}がある場合正しくparseされる', () => {
      const input = new ChoiceDefinition({ label: 'xyz{$NUMBER_INPUT}abc' });
      const result = input.parseLabel('a', 0);
      expect(result.getLabel()).toBe('xyz');
      expect(result.getUnit()).toBe('abc');
      expect(result.hasTextInput()).toBe(false);
      expect(result.hasNumberInput()).toBe(true);
    });

    it('最後にある{NUMBER_INPUT}がある場合正しくparseされる', () => {
      const input = new ChoiceDefinition({ label: 'xyz{$NUMBER_INPUT}' });
      const result = input.parseLabel('a', 0);
      expect(result.getLabel()).toBe('xyz');
      expect(result.getUnit()).toBe('');
      expect(result.hasTextInput()).toBe(false);
      expect(result.hasNumberInput()).toBe(true);
    });
  });
});
