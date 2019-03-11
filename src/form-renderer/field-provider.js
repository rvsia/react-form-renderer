import React, { Component } from 'react';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

class FieldProvider extends Component{
  componentWillUnmount(){
    if ((this.props.formOptions.clearOnUnmount || this.props.clearOnUnmount) && this.props.clearOnUnmount !== false) {
      this.props.formOptions.change(this.props.name, undefined);
    }
  }

  render(){
    const { clearOnUnmount, component, ...props } = this.props;
    const Component = component;
    return <Field { ...props } render={ ({ initialValue, ...rest }) => <Component { ...rest } /> } />;
  }
}

FieldProvider.propTypes = {
  formOptions: PropTypes.shape({
    clearOnUnmount: PropTypes.bool,
    change: PropTypes.func,
  }),
  name: PropTypes.string,
  clearOnUnmount: PropTypes.bool,
  component: PropTypes.any,
};

FieldProvider.defaultProps = {
  formOptions: {},
};

export default FieldProvider;

