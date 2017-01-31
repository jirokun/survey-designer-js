import validate from 'validate.js';

validate.validators.CheckboxQuestion = (value, options) => {
  const errors = [];
  const checkedCount = value.reduce((previousValue, currentValue) => (currentValue === true ? previousValue + 1 : previousValue), 0);
  if (options.minCheckCount > 0 && options.minCheckCount > checkedCount) {
    errors.push(`少なくとも${options.minCheckCount}つ選択してください`);
  }
  if (options.maxCheckCount > 0 && options.maxCheckCount < checkedCount) {
    errors.push(`選択できる数は${options.maxCheckCount}つまでです`);
  }
  return errors;
};

export default validate;
