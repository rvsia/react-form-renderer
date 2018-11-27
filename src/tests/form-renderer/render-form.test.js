import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import renderForm from '../../form-renderer/render-form';
import RendererContext, { configureContext } from '../../form-renderer/renderer-context';
import { components, validators } from '../../constants';

describe('renderForm function', () => {
  let layoutMapper;

  const ContextWrapper = ({ children, ...props }) => (
    <RendererContext.Provider value={ configureContext({
      ...props,
    }) }>
      <Form onSubmit={ jest.fn() } mutators={{ ...arrayMutators }}>
        { () =>  children }
      </Form>
    </RendererContext.Provider>
  );

  beforeEach(() => {
    layoutMapper = {
      Col: ({ children }) => <div>{ children }</div>,
      FormGroup: ({ children }) => <div>{ children }</div>,
      ButtonGroup: ({ children }) => <div>{ children }</div>,
      HelpBlock: ({ children }) => <div>{ children }</div>,
      Button: ({ label, bsStyle, ...rest }) => <button { ...rest }>{ label }</button>,
      Icon: ({ type, name }) => <div>Icon: { name }</div>,
    };
  });

  it('should render single field from defined componentTypes', () => {
    const formFields = [{
      component: components.TEXT_FIELD,
      name: 'foo',
    }];
    const wrapper = mount(
      <ContextWrapper formFieldsMapper={{
        [components.TEXT_FIELD]: ({ FieldProvider, dataType, ...props }) => <div { ...props }>TextField</div>,
      }}>
        { renderForm(formFields, { renderForm }) }
      </ContextWrapper>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should correctly assign dataType validator if no additional validators given', () => {
    const formFields = [{
      component: components.TEXT_FIELD,
      name: 'foo',
      dataType: 'string',
    }];
    const wrapper = mount(
      <ContextWrapper formFieldsMapper={{
        [components.TEXT_FIELD]: ({ FieldProvider, dataType, ...props }) => <div { ...props }>TextField</div>,
      }}>
        { renderForm(formFields, { renderForm }) }
      </ContextWrapper>
    );
    const form = wrapper.find(Form);
    form.instance().form.change('foo', 1);
    expect(form.instance().state.state.errors.foo).toBe(('Field value has to be string'));
  });

  it('should correctly assign required validator with custom message', () => {
    const formFields = [{
      component: components.TEXT_FIELD,
      name: 'foo',
      dataType: 'string',
      validate: [{
        type: validators.REQUIRED,
        message: 'Bar',
      }],
    }];
    const wrapper = mount(
      <ContextWrapper formFieldsMapper={{
        [components.TEXT_FIELD]: ({ FieldProvider, dataType, ...props }) => <div { ...props }>TextField</div>,
      }}>
        { renderForm(formFields, { renderForm }) }
      </ContextWrapper>
    );
    const form = wrapper.find(Form);
    expect(form.instance().state.state.errors.foo).toBe(('Bar'));
  });

  it('should render single field from with custom componentType', () => {
    const formFields = [{
      component: 'custom-component',
      name: 'foo',
    }];
    const wrapper = mount(
      <ContextWrapper formFieldsMapper={{
        'custom-component': ({ FieldProvider, dataType, formOptions, ...props }) => <div { ...props }>Custom component</div>,
      }}>
        { renderForm(formFields, { renderForm }) }
      </ContextWrapper>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render single field from with custom componentType and assign FieldProvider', () => {
    const formFields = [{
      component: 'custom-component',
      name: 'foo',
      assignFieldProvider: true,
    }];

    const wrapper = mount(
      <ContextWrapper formFieldsMapper={{
        'custom-component': ({ FieldProvider, dataType, formOptions, ...props }) => (
          <FieldProvider { ...props } render={ () => <div>Custom component</div> } />
        ),
      }}>
        { renderForm(formFields, { renderForm }) }
      </ContextWrapper>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render array field', () => {
    const formFields = [{
      component: components.FIELD_ARRAY,
      name: 'foo',
      key: 'bar',
      fields: [],
    }];

    const wrapper = mount(
      <ContextWrapper layoutMapper={ layoutMapper }>
        { renderForm(formFields, { renderForm }) }
      </ContextWrapper>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should correctly assign array field validators', () => {
    const formFields = [{
      component: components.FIELD_ARRAY,
      name: 'foo',
      key: 'bar',
      validate: [{
        type: validators.REQUIRED,
      }, {
        type: validators.MIN_ITEMS_VALIDATOR,
        treshold: 3,
      }],
      fields: [{
        component: components.TEXT_FIELD,
        name: 'name',
        type: 'text',
      }],
    }];

    const wrapper = mount(
      <ContextWrapper
        layoutMapper={ layoutMapper }
        formFieldsMapper={{
          [components.TEXT_FIELD]: ({ FieldProvider, dataType, ...props }) => <div { ...props }>TextField</div>,
        }}
      >
        { renderForm(formFields, { renderForm }) }
      </ContextWrapper>
    );

    const form = wrapper.find(Form);
    form.instance().form.mutators.push('foo');
    expect(form.instance().state.state.errors.foo).toBeTruthy();
  });

  it('should render condition field only if the condition is met', () => {
    const formFields = [{
      component: 'custom-component',
      name: 'foo',
      condition: {
        when: 'bar',
        is: 'fuzz',
      },
    }];

    const wrapper = mount(
      <ContextWrapper formFieldsMapper={{
        'custom-component': ({ FieldProvider, dataType, formOptions, ...props }) => <div { ...props }>Custom component</div>,
      }}>
        { renderForm(formFields, { renderForm }) }
      </ContextWrapper>
    );
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.find(Form).instance().form.change('bar', 'fuzz');
    wrapper.update();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
