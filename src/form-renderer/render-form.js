import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { dataTypeValidator } from '../validators';
import validatorMapper from '../validators/validator-mapper';
import RendererContext from './renderer-context';
import { shouldWrapInField, composeValidators } from './helpers';

const Condition = ({ when, is, children }) => {
  const shouldRender = value => (Array.isArray(is) ? !!is.find(item => item === value) : value === is);
  return (
    <Field name={ when } subscription={{ value: true }}>
      { ({ input: { value }}) => (shouldRender(value) ? children : null) }
    </Field>
  );
};

const FormConditionWrapper = ({ condition, children }) => (condition ? (
  <Condition { ...condition }>
    { children }
  </Condition>
) : children);

const FieldWrapper = ({ componentType, validate, component, formOptions, ...rest }) =>
  shouldWrapInField(componentType) ?
    <Field { ...rest } component={ component } validate={ composeValidators(validate) } />
    : component({ formOptions, ...rest });

const renderSingleField = ({ component, condition, ...rest }, formOptions) => (
  <Fragment key={ rest.key || rest.name }>
    <RendererContext.Consumer>
      { ({ formFieldsMapper }) => (
        <FormConditionWrapper condition={ condition }>
          <FieldWrapper
            componentType={ component }
            component={ formFieldsMapper(component) }
            formOptions={ formOptions }
            { ...rest }
          />
        </FormConditionWrapper>
      ) }
    </RendererContext.Consumer>
  </Fragment>
);

renderSingleField.propTypes = {
  component: PropTypes.string.isRequired,
};

const prepareFieldProps = field => ({
  ...field,
  dataType: undefined,
  validate: field.validate
    ? [ ...field.validate.map(({ type, ...options }) => Object.keys(options).length === 0
      ? validatorMapper(type)
      : validatorMapper(type)(options)),
    field.dataType && dataTypeValidator(field.dataType)(),
    ]
    : [ field.dataType && dataTypeValidator(field.dataType)() ],
});

const renderForm = (fields, formOptions) => fields.map(field => (Array.isArray(field)
  ? renderForm(field, formOptions)
  : renderSingleField(prepareFieldProps(field), { renderForm, ...formOptions })));

export default renderForm;
