import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { dataTypeValidator } from '../validators';
import validatorMapper from '../validators/validator-mapper';
import RendererContext from './renderer-context';
import { shouldWrapInField, composeValidators } from './helpers';
import { components } from '../constants';
import { isEmpty as lodashIsEmpty } from 'lodash';
import { memoize } from '../validators/helpers';

const assignSpecialType = componentType => [ components.CHECKBOX, components.RADIO ].includes(componentType) ? componentType : undefined;
const shouldAssignFormOptions = componentType => [ components.FIELD_ARRAY, components.FIXED_LIST ].includes(componentType);

const isEmptyValue = (value) => typeof value === 'number' || value === true ? false : lodashIsEmpty(value);

const Condition = ({ when, is, isNotEmpty, isEmpty, children, pattern, notMatch }) => {
  const shouldRender = value => {
    if (isNotEmpty){
      return !isEmptyValue(value);
    }

    if (isEmpty){
      return isEmptyValue(value);
    }

    if (pattern) {
      return notMatch ? !pattern.test(value) : pattern.test(value);
    }

    const isMatched = Array.isArray(is) ? !!is.includes(value) : value === is;

    return notMatch ? !isMatched : isMatched;
  };

  return (
    <Field name={ when } subscription={{ value: true }}>
      { ({ input: { value }}) => (shouldRender(value) ? children : null) }
    </Field>
  );
};

class FieldProvider extends React.Component{
  componentWillUnmount(){
    if ((this.props.formOptions.clearOnUnmount || this.props.clearOnUnmount) && this.props.clearOnUnmount !== false) {
      this.props.formOptions.change(this.props.name, undefined);
    }
  }

  render(){
    const { clearOnUnmount, ...props } = this.props;
    return <Field { ...props } />;
  }
}

const FormConditionWrapper = ({ condition, children }) => (condition ? (
  <Condition { ...condition }>
    { children }
  </Condition>
) : children);

const FieldWrapper = ({ componentType, validate, component, formOptions, assignFieldProvider, ...rest }) => {
  const componentProps = {
    type: assignSpecialType(componentType),
    FieldProvider,
    ...rest,
    formOptions,
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

  const Component = component;
  return shouldWrapInField(componentType)
    ? <FieldProvider { ...componentProps } />
    : <Component formOptions={ formOptions } validate={ composeValidators(validate) } { ...rest } FieldProvider={ FieldProvider } />;
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

const prepareValidator = (validator) => ((typeof validator === 'function')
  ? memoize(validator)
  : validatorMapper(validator.type)({ ...validator }));

const prepareFieldProps = field => ({
  ...field,
  dataType: undefined,
  validate: field.validate
    ? [
      ...field.validate.map((validator) => prepareValidator(validator)),
      field.dataType && dataTypeValidator(field.dataType)(),
    ]
    : [
      field.dataType && dataTypeValidator(field.dataType)(),
    ],
});

const renderForm = (fields, formOptions) => fields.map(field => (Array.isArray(field)
  ? renderForm(field, formOptions)
  : renderSingleField(prepareFieldProps(field), { renderForm, ...formOptions })));

export default renderForm;
