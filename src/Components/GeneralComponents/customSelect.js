import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const CustomSelect = ({ input, label, meta: { error, touched }, options, edit, initialValues, editable, placeholder }) => {
    return (
        <React.Fragment>
            <Form.Field error={touched && error ? true : false}>
                <label>{label}</label>
                <Dropdown
                    clearable
                    placeholder={placeholder}
                    selection
                    fluid
                    options={options}
                    disabled={edit && !editable}
                    value={edit ? initialValues.default_placement : input.value}
                    onChange={(param, data) => input.onChange(data.value)}
                />
            </Form.Field>
        </React.Fragment>
    );
};

CustomSelect.propTypes = {
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any,
    options: PropTypes.array,
    edit: PropTypes.bool,
    placeholder: PropTypes.any,
};

export default CustomSelect;
