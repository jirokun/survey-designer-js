/* eslint-env jest */
import validate from '../../lib/runtime/validators';

describe('Validator', () => {
  describe('validateCheckboxQuestion', () => {
    it('チェックボックスのチェック数がminCheckCountに満たない場合エラーが返る', () => {
      const value = {
        123: [
          { checked: true },
          { checked: false },
          { checked: false },
        ],
      };
      const constraints = {
        123: { CheckboxQuestion: { minCheckCount: 2 } },
      };
      const result = validate(value, constraints, { fullMessages: false });
      expect(result[123].length).toBe(1);
      expect(result[123][0]).toBe('少なくとも2つ選択してください');
    });

    it('チェックボックスのチェック数がminCheckCountを満たす場合エラーが返らない', () => {
      const value = {
        123: [
          { checked: true },
          { checked: false },
          { checked: true },
        ],
      };

      const constraints = {
        123: { CheckboxQuestion: { minCheckCount: 2 } },
      };
      const result = validate(value, constraints);
      expect(result).toBe(undefined);
    });

    it('チェックボックスのチェック数がmaxCheckCountを超える場合エラーが返る', () => {
      const value = {
        123: [
          { checked: true },
          { checked: false },
          { checked: true },
        ],
      };
      const constraints = {
        123: { CheckboxQuestion: { maxCheckCount: 1 } },
      };
      const result = validate(value, constraints, { fullMessages: false });
      expect(result[123].length).toBe(1);
      expect(result[123][0]).toBe('選択できる数は1つまでです');
    });

    it('チェックボックスのチェック数がmaxCheckCountを超えない場合エラーが返らない', () => {
      const value = {
        123: [
          { checked: true },
          { checked: false },
          { checked: true },
        ],
      };
      const constraints = {
        123: { CheckboxQuestion: { maxCheckCount: 2 } },
      };
      const result = validate(value, constraints);
      expect(result).toBe(undefined);
    });
  });
});
