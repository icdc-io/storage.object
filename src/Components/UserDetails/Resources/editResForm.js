import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number } from '../../../Validaions';

const Fld = ({ input, label, meta: { error, touched } }) => {
    return <React.Fragment>
        <Form.Field error={(touched && error) ? true : false} >
            <label>{label}</label>
            <input {...input}/>
            {touched && error && <Label basic pointing>{error}</Label>}
        </Form.Field>
    </React.Fragment>;
};

Fld.propTypes = {
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any,
    min: PropTypes.any
};

const EditResForm = ({ t, handleClose, handleSubmit, name }) => {
    return <React.Fragment>
        <Form>
            <Field
                name={name}
                component={Fld}
                type="text"
                validate={[required, number]}
            />
            <Modal.Actions align={'right'}>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button onClick={handleSubmit} primary type='submit'>{t('submitt')}</Button>
            </Modal.Actions>
        </Form>
    </React.Fragment >;
};

EditResForm.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string
};

export default reduxForm({
    form: 'editResForm'
})(EditResForm);
