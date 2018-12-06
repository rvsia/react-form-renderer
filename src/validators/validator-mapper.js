import { required, length, pattern, numericality } from './';

import { validators } from '../constants';

export default validatorType => ({
  [validators.REQUIRED]: required,
  [validators.MIN_LENGTH]: ({ treshold, ...rest }) => length({ minimum: treshold, ...rest }),
  [validators.MAX_LENGTH]: ({ treshold, ...rest }) => length({ maximum: treshold, ...rest }),
  [validators.EXACT_LENGTH]: ({ treshold, ...rest }) => length({ is: treshold, ...rest }),
  [validators.MIN_ITEMS_VALIDATOR]: ({ treshold, ...rest }) =>
    length({ minimum: treshold, message: `Must have at least ${treshold} items.`, ...rest }),
  [validators.PATTERN_VALIDATOR]: pattern,
  [validators.MAX_NUMBER_VALUE]: ({ value, ...rest }) => numericality({ '<': value, ...rest }),
  [validators.MIN_NUMBER_VALUE]: ({ value, ...rest }) => numericality({ '>': value, ...rest }),
})[validatorType];
