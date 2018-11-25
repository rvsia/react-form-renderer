import React from 'react';
import PropTypes from 'prop-types';
import { __ } from '../global-functions';
import RendererContext from './renderer-context';

const FormControls = ({
  onSubmit,
  onCancel,
  onReset,
  submitLabel,
  cancelLabel,
  resetLabel,
  pristine,
  canReset,
  canSubmit,
}) => (
  <RendererContext.Consumer>
    { ({ layoutMapper: { Col, FormGroup, Button, ButtonGroup }}) => (
      <Col xs={ 12 }>
        <FormGroup>
          <ButtonGroup>
            <Button type="button" variant="primary" disabled={ !canSubmit } onClick={ onSubmit } label={ submitLabel } />
            { canReset && <Button type="button" disabled={ pristine } onClick={ onReset } label={ resetLabel } /> }
            { onCancel && <Button type="button" onClick={ onCancel } label={ cancelLabel } /> }
          </ButtonGroup>
        </FormGroup>
      </Col>
    ) }
  </RendererContext.Consumer>
);

FormControls.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onReset: PropTypes.func,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  resetLabel: PropTypes.string,
  pristine: PropTypes.bool,
  canReset: PropTypes.bool,
  canSubmit: PropTypes.bool,
};

FormControls.defaultProps = {
  submitLabel: __('Submit'),
  cancelLabel: __('Cancel'),
  resetLabel: __('Reset'),
  canReset: false,
  canSubmit: false,
};

export default FormControls;
