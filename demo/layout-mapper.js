import React from 'react';
import { layoutComponents } from '../src/constants';

const Button = ({ variant, label, ...rest }) => (
  <button
    style={{
      backgroundColor: variant === 'primary' ? 'red' : 'initial',
    }}
    { ...rest }
  >
    { label }
  </button>
);

const Col = ({ children, ...props }) => <div { ...props }>{ children }</div>;
const FormGroup = ({ children }) => <div style={{ backgroundColor: 'tomato' }} >{ children }</div>;
const ButtonGroup = ({ children }) => <div style={{ backgroundColor: 'ivory' }} >{ children }</div>;

const layoutMapper = {
  [layoutComponents.FORM_WRAPPER]: ({ children, ...props }) => <form { ...props }>{ children }</form>,
  [layoutComponents.BUTTON]: Button,
  [layoutComponents.COL]: Col,
  [layoutComponents.FORM_GROUP]: FormGroup,
  [layoutComponents.BUTTON_GROUP]: ButtonGroup,
};

export default layoutMapper;
