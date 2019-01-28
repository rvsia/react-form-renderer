import output from '../../demo-schemas/miq-schemas/output';
import React from 'react';
import defaultSchemaValidator from '../../parsers/default-schema-validator';
import { components } from '../../constants/';

describe('Default schema validator', () => {
  let formFieldsMapper;
  beforeEach(() => {
    formFieldsMapper = {
      foo: props => <div>Component</div>,
      invalidComponent: 'baz',
      [components.TABS]: ({ children }) => <div>{ children }</div>,
    };
  });
  it('should fail if input is not a object', () => {
    expect(() => defaultSchemaValidator([])).toThrow();
  });

  it('should fail if input object does not have fields key', () => {
    expect(() => defaultSchemaValidator({})).toThrow();
  });

  it('should fail if input object does fields key that is not array', () => {
    expect(() => defaultSchemaValidator({ fields: {}})).toThrow();
  });

  it('should fail if field item does not have component property', () => {
    expect(() => defaultSchemaValidator({ fields: [{}]})).toThrow();
  });

  it('should fail if field item does not have name property', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field component property is not in form fields mapper.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'blarghs',
      name: 'foo',
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field component from form fields mapper is not a valid React component.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'invalidComponent',
      name: 'foo',
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field condition is not correct type.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: '',
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field condition is missing when key.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: {},
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field condition is missing is key.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: { when: 'Foo' },
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field condition when property is not correct type.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: { when: 123, is: 456 },
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field validate is not an array.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: {},
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field validate item is not an object.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: [ '' ],
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field validate item does not have type property.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: [{}],
    }]}, formFieldsMapper)).toThrow();
  });

  it('should fail if field validate item validator type does not exist.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: [{
        type: 'magic',
      }],
    }]}, formFieldsMapper)).toThrow();
  });

  it('should pass validation', () => {
    expect(() => defaultSchemaValidator(output, {
      ...formFieldsMapper, 'sub-form': () => <div />,
      'text-field': () => <div />,
      'textarea-field': () => <div />,
      checkbox: () => <div />,
      radio: () => <div />,
      'select-field': () => <div />,
      'date-picker': () => <div />,
      'time-picker': () => <div />,
      'tag-control': () => <div />,
    })).not.toThrow();
  });
});
