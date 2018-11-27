import { required, minLength, patternValidator, minValue, maxValue } from '../../validators/';
import { validators } from '../../constants';
import validatorMapper from '../../validators/validator-mapper';

describe('Validator mapper', () => {
  it('should return required validator', () => {
    expect(validatorMapper(validators.REQUIRED)).toEqual(required);
  });

  it('should return minLength validator', () => {
    expect(validatorMapper(validators.MIN_LENGTH)).toEqual(minLength);
  });

  it('should return patternValidator validator', () => {
    expect(validatorMapper(validators.PATTERN_VALIDATOR)).toEqual(patternValidator);
  });

  it('should return minValue validator', () => {
    expect(validatorMapper(validators.MIN_NUMBER_VALUE)).toEqual(minValue);
  });

  it('should return maxValue validator', () => {
    expect(validatorMapper(validators.MAX_NUMBER_VALUE)).toEqual(maxValue);
  });

  it('should return minItems validator', () => {
    expect(validatorMapper(validators.MIN_ITEMS_VALIDATOR)).toEqual(minLength);
  });
});
