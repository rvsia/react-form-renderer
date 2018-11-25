import { required, minLength, patternValidator, minValue, maxValue } from './';

import { validators } from '../constants';

export default validatorType => ({
  [validators.REQUIRED]: required,
  [validators.MIN_LENGTH]: minLength,
  [validators.MIN_ITEMS_VALIDATOR]: minLength,
  [validators.PATTERN_VALIDATOR]: patternValidator,
  [validators.MAX_NUMBER_VALUE]: maxValue,
  [validators.MIN_NUMBER_VALUE]: minValue,
})[validatorType];
