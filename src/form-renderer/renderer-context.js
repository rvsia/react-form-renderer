import { createContext } from 'react';

const ComponentType = createContext('');

export default ComponentType;

export const configureContext = ({
  layoutMapper,
  formFieldsMapper,
}) => ({
  layoutMapper,
  formFieldsMapper,
});
