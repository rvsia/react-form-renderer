import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { composeValidators } from './helpers';
import RendererContext from './renderer-context';

const ArrayItem = ({
  renderForm,
  fields,
  fieldKey,
  fieldIndex,
  name,
  remove,
}) => (
  <RendererContext.Consumer>
    { ({ layoutMapper: { Col, Button, ButtonGroup, Icon, ArrayFieldWrapper }}) => (
      <ArrayFieldWrapper>
        <Col xs={ 11 } className="final-form-array-item">
          { renderForm(fields.map((field) => {
            const itemName = field.name
              ? field.name.substring(field.name.lastIndexOf('.') + 1)
              : `${fieldKey}[${fieldIndex}]`;
            const fieldName = `${name}${itemName && itemName !== 'items' ? itemName : ''}`;
            return { ...field, name: fieldName, key: name };
          })) }
        </Col>
        <Col xs={ 1 } className="final-form-group-controls">
          <ButtonGroup className="pull-right">
            <Button type="button" bsStyle="danger" onClick={ () => remove(fieldIndex) }><Icon name="close" /></Button>
          </ButtonGroup>
        </Col>
      </ArrayFieldWrapper>
    ) }
  </RendererContext.Consumer>
);

ArrayItem.propTypes = {
  renderForm: PropTypes.func.isRequired,
  fieldKey: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  fieldIndex: PropTypes.number.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.func.isRequired,
};

const DynamicArray = ({
  fieldKey,
  arrayValidator,
  title,
  description,
  renderForm,
  fields,
  itemDefault,
}) => (
  <RendererContext.Consumer>
    { ({ layoutMapper: { Col, FormGroup, Button, ButtonGroup, Icon, HelpBlock }}) => (
      <FieldArray key={ fieldKey } name={ fieldKey } validate={ arrayValidator }>
        { ({ fields: { map, remove, push }, meta: { error, dirty, submitFailed }}) => (
          <Fragment>
            { title && <Col xs={ 12 }><h3>{ title }</h3></Col> }
            { description && <Col xs={ 12 }><p>{ description }</p></Col> }
            { map((name, index) => (
              <ArrayItem
                key={ `${name}-${index}` }
                fields={ fields }
                name={ name }
                fieldKey={ fieldKey }
                fieldIndex={ index }
                renderForm={ renderForm }
                remove={ remove }
              />)) }
            <Col xs={ 11 }>{ (dirty || submitFailed) && error && typeof error === 'string' && <HelpBlock>{ error }</HelpBlock> }</Col>
            <Col xs={ 1 } className="final-form-array-add-container">
              <FormGroup>
                <ButtonGroup className="pull-right">
                  <Button type="button" onClick={ () => push(itemDefault) }>
                    <Icon type="fa" name="plus" />
                  </Button>
                </ButtonGroup>
              </FormGroup>
            </Col>
          </Fragment>
        ) }
      </FieldArray>
    ) }
  </RendererContext.Consumer>
);

DynamicArray.propTypes = {
  fieldKey: PropTypes.string,
  arrayValidator: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  renderForm: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object),
  itemDefault: PropTypes.any,
};

const FixedArrayField = ({ title, description, fields, renderForm, additionalItems }) => {
  return (
    <RendererContext.Consumer>
      { ({ layoutMapper: { Col }}) => (
        <Fragment>
          { title && <Col xs={ 12 }><h3>{ title }</h3></Col> }
          { description && <Col xs={ 12 }><p>{ description }</p></Col> }
          { renderForm(fields) }
          { renderForm([ additionalItems ]) }
        </Fragment>
      ) }
    </RendererContext.Consumer>
  );
};

FixedArrayField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  renderForm: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  additionalItems: PropTypes.object.isRequired,
};

const renderArrayField = props => {
  const { fieldKey, arrayValidator, ...rest } = props;
  return (
    props.formOptions.hasFixedItems ? <FixedArrayField { ...props } renderForm={ props.formOptions.renderForm } /> : (
      <DynamicArray
        fieldKey={ rest.input.name }
        { ...rest }
        arrayValidator={ arrayValidator }
        renderForm={ props.formOptions.renderForm }
      />
    )
  );
};

renderArrayField.propTypes = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  fields: PropTypes.array.isRequired,
  validate: PropTypes.array,
  itemDefault: PropTypes.any,
};
renderArrayField.defaultProps = {
  validate: [],
};

export default renderArrayField;
