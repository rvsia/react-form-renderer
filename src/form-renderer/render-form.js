import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { dataTypeValidator } from '../validators';
import validatorMapper from '../validators/validator-mapper';
import RendererContext from './renderer-context';
import { shouldWrapInField, composeValidators } from './helpers';
import { components } from '../constants';

const assignSpecialType = componentType => [ components.CHECKBOX, components.RADIO ].includes(componentType) ? componentType : undefined;
const shouldAssignFormOptions = componentType => [ components.FIELD_ARRAY, components.FIXED_LIST ].includes(componentType);

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

const FieldWrapper = ({ componentType, validate, component, formOptions, assignFieldProvider, ...rest }) => {
  const componentProps = {
    type: assignSpecialType(componentType),
    FieldProvider: Field,
    ...rest,
    component,
  };
  if (shouldAssignFormOptions(componentType)) {
    componentProps.formOptions = {
      hasFixedItems: componentType === components.FIXED_LIST,
      ...formOptions,
    };
    componentProps.arrayValidator = value => {
      if (!Array.isArray(value)) {
        return;
      }

      const arrayValidator = composeValidators(validate);
      let result = arrayValidator(value ? value.length > 0 ? value : undefined : undefined);
      if (typeof result === 'function') {
        result = result(value);
      }

      return result;
    };
  } else {
    componentProps.validate = composeValidators(validate);
  }

  return shouldWrapInField(componentType)
    ? <Field { ...componentProps } />
    : component({ formOptions, ...rest, FieldProvider: assignFieldProvider && Field });
};

const renderSingleField = ({ component, condition, ...rest }, formOptions) => (
  <Fragment key={ rest.key || rest.name }>
    <RendererContext.Consumer>
      { ({ formFieldsMapper }) => (
        <FormConditionWrapper condition={ condition }>
          <FieldWrapper
            componentType={ component }
            component={ formFieldsMapper[component] }
            formOptions={ formOptions }
            name={ rest.name || rest.key }
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
    ? [ ...field.validate.map(({ type, ...options }) => validatorMapper(type)(options)),
      field.dataType && dataTypeValidator(field.dataType)(),
    ]
    : [ field.dataType && dataTypeValidator(field.dataType)() ],
});

const renderForm = (fields, formOptions) => fields.map(field => (Array.isArray(field)
  ? renderForm(field, formOptions)
  : renderSingleField(prepareFieldProps(field), { renderForm, ...formOptions })));

export default renderForm;
