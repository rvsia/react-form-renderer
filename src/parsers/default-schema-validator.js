import DefaultSchemaError from './schema-errors';
import isValidComponent from './isValidComponent';
import { validators, components } from '../constants';

const componentBlackList = [ components.FIELD_ARRAY, components.FIXED_LIST ];

const checkFieldsArray = (obj, objectKey) => {
  if (!obj.hasOwnProperty('fields')) {
    throw new DefaultSchemaError(`Component of type ${objectKey} must contain "Fields" property of type array, received undefined!`);
  }

  if (!Array.isArray(obj.fields)) {
    throw new DefaultSchemaError(`Component of type ${objectKey} must contain "Fields" property of type array, received type: ${typeof obj.fields}!`);
  }
};

const checkCondition = (condition, fieldName) => {
  if (Array.isArray(condition) || typeof condition !== 'object') {
    throw new DefaultSchemaError(`
      Error occured in field defintion with name: "${fieldName}".
      Field condition must be an object, received ${Array.isArray(condition) ? 'array' : typeof condition}!
    `);
  }

  if (!condition.hasOwnProperty('when')) {
    throw new DefaultSchemaError(`
      Error occured in field defintion with name: "${fieldName}".
      Field condition must have "when" property! Properties received: [${Object.keys(condition)}].
    `);
  }

  if (typeof condition.when !== 'string') {
    throw new DefaultSchemaError(`
      Error occured in field defintion with name: "${fieldName}".
      Field condition property "when" must be oof type "string", ${typeof condition.when} received!].
    `);
  }

  if (!condition.hasOwnProperty('is')) {
    throw new DefaultSchemaError(`
      Error occured in field defintion with name: "${fieldName}".
      Field condition must have "is" property! Properties received: [${Object.keys(condition)}].
    `);
  }
};

const checkValidators = (validate, fieldName) => {
  if (!Array.isArray(validate)) {
    throw new DefaultSchemaError(`
      Error occured in field defintion with name: "${fieldName}".
      Field validate property must be an Array, ${typeof validate} received!
    `);
  }

  validate.forEach((validator, index) => {
    if (Array.isArray(validator) || typeof validator !== 'object') {
      throw new DefaultSchemaError(`
        Error occured in field defintion with name: "${fieldName}".
        Field validator at index: ${index} must be and object, ${Array.isArray(validator) ? 'array' : typeof validator} received!
      `);
    }

    if (!validator.hasOwnProperty('type')) {
      throw new DefaultSchemaError(`
        Error occured in field defintion with name: "${fieldName}".
        Field validator at index: ${index} does not have "type" property! Properties received: [${Object.keys(validator)}].
      `);
    }

    if (!Object.values(validators).includes(validator.type)) {
      throw new DefaultSchemaError(`
        Error occured in field defintion with name: "${fieldName}".
        Field validator at index: ${index} does not have correct "type" property!
        Received "${validator.type}", expected one of: [${Object.values(validators)}].
      `);
    }
  });
};

const iterateOverFields = (fields, formFieldsMapper, layoutMapper) => {
  fields.forEach(field => {
    if (Array.isArray(field)) {
      return iterateOverFields(field, formFieldsMapper, layoutMapper);
    }

    if (!field.hasOwnProperty('component')) {
      throw new DefaultSchemaError(`Each fields item must have "component" property!`);
    }

    if (!componentBlackList.includes(field.component) && !formFieldsMapper.hasOwnProperty(field.component)) {
      throw new DefaultSchemaError(`
        Component of type "${field.component}" is not present in formFieldsMapper.
        Please make sure "${field.component} is included in your formFieldsMapper."
        FormFieldsMapper has these values: [${Object.keys(formFieldsMapper)}]
      `);
    }

    if (!componentBlackList.includes(field.component) && !isValidComponent(formFieldsMapper[field.component])) {
      throw new DefaultSchemaError(`FormComponent "${field.component}" from formFieldsMapper is not a valid React component!`);
    }

    if (!field.hasOwnProperty('name') && !field.hasOwnProperty('title') && !field.hasOwnProperty('key')) {
      throw new DefaultSchemaError(`Each fields item must have "name" or "key" property! Name is used as a unique identifier of form fields.`);
    }

    if (field.hasOwnProperty('condition')) {
      checkCondition(field.condition, field.name);
    }

    if (field.hasOwnProperty('validate')) {
      checkValidators(field.validate, field.name);
    }
  });
};

const defaultSchemaValidator = (schema, formFieldsMapper, layoutMapper = {}) => {
  if (Array.isArray(schema) || typeof schema !== 'object') {
    throw new DefaultSchemaError(`Form Schema must be an object, received ${Array.isArray(schema) ? 'array' : typeof schema}!`);
  }

  checkFieldsArray(schema, 'schema');
  iterateOverFields(schema.fields, formFieldsMapper, layoutMapper);

};

export default defaultSchemaValidator;
