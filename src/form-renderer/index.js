import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import PropTypes from 'prop-types';
import miqParser from '../parsers/miq-parser/miq-parser';
import mozillaParser from '../parsers/mozilla-parser/mozilla-schema-parser';
import RendererContext, { configureContext } from './renderer-context';
import FormControls from './form-controls';
import renderForm from './render-form';

const schemaMapper = type => ({
  mozilla: (schema, uiSchema) => mozillaParser(schema, uiSchema),
  miq: schema => miqParser(schema),
  default: schema => ({ schema }),
})[type];

const FormRenderer = ({
  layoutMapper,
  formFieldsMapper,
  onSubmit,
  onCancel,
  canReset,
  onReset,
  schema,
  schemaType,
  buttonsLabels,
  disableSubmit,
  initialValues,
  uiSchema,
}) => {
  const inputSchema = schemaMapper(schemaType)(schema, uiSchema);
  return (
    <RendererContext.Provider value={ configureContext({
      layoutMapper,
      formFieldsMapper,
    }) }>
      <Form
        onSubmit={ onSubmit }
        mutators={{ ...arrayMutators }}
        initialValues={{
          ...inputSchema.defaultValues,
          ...initialValues,
        }}
        subscription={{ pristine: true, submitting: true }}
        render={ ({ handleSubmit, pristine, valid, form: { reset, mutators, change }}) => (
          <RendererContext.Consumer>
            { ({ layoutMapper: { FormWrapper }}) => (
              <FormWrapper>
                { renderForm(inputSchema.schema.fields, { push: mutators.push, change, pristine }) }
                <FormControls
                  onSubmit={ handleSubmit }
                  onCancel={ onCancel }
                  canReset={ canReset }
                  onReset={ () => {
                    if (canReset) {
                      onReset && onReset();
                      reset();
                    }
                  } }
                  pristine={ pristine }
                  canSubmit={ disableSubmit ? !pristine && !valid : !pristine }
                  { ...buttonsLabels }
                />
              </FormWrapper>
            ) }
          </RendererContext.Consumer>
        ) }
      />
    </RendererContext.Provider>
  );};

export default FormRenderer;

FormRenderer.propTypes = {
  formType: PropTypes.oneOf([ 'pf3', 'pf4' ]),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  canReset: PropTypes.bool,
  schema: PropTypes.object.isRequired,
  schemaType: PropTypes.oneOf([ 'mozilla', 'miq', 'default' ]),
  buttonsLabels: PropTypes.object,
  disableSubmit: PropTypes.bool,
  initialValues: PropTypes.object,
  uiSchema: PropTypes.object,
};

FormRenderer.defaultProps = {
  formType: 'pf3',
  resetAble: false,
  schemaType: 'default',
  buttonsLabels: {},
  disableSubmit: false,
  initialValues: {},
  uiSchema: {},
};
