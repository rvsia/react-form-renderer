/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom";
import FormRenderer from '../src';
import layoutMapper from './layout-mapper';
import formFieldsMapper from './form-fields-mapper';
import miqSchema from '../src/demo-schemas/miq-schemas/input'
import { conditionalSchema, widgetSchema, uiWidgetSchema, arraySchema, uiArraySchema } from '../src/demo-schemas/mozilla-schemas';

const App = () => (
    <div style={{ padding: 20 }}>
        <FormRenderer
            layoutMapper={layoutMapper}
            formFieldsMapper={formFieldsMapper}
            onSubmit={console.log}
            onCancel={console.log}
            schemaType="mozilla"
            schema={arraySchema}
            uiSchema={uiArraySchema}
        />
    </div>
)

ReactDOM.render(<App />, document.getElementById('root'));
