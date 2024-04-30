import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const CustomField = ({ input, label, meta: { error, touched }, placeholder, subLabel }) => {
    return (
        <React.Fragment>
            <Form.Field error={touched && error ? true : false}>
                <label>{label} <span className='sublabel'>{subLabel}</span></label>
                <input {...input} placeholder={placeholder} />
                {touched && error && (
                    <Label basic pointing>
                        {error}
                    </Label>
                )}
            </Form.Field>
        </React.Fragment>
    );
};

CustomField.propTypes = {
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any,
    placeholder: PropTypes.any,
};

export default CustomField;
