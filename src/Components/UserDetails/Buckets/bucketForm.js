import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Form, Button, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { required, number, bucket } from '../../../Validaions';

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
    meta: PropTypes.any
};

const BucketForm = ({ t, handleClose, handleSubmit }) => {
    return <React.Fragment>
        <Form>
            <Field
                name="name"
                label={t('name')}
                component={Fld}
                type="text"
                validate={[required, bucket]}
            />
            <Field
                name="storageSizeLimit"
                label={t('storageSizeLimit')}
                component={Fld}
                type="text"
                validate={[required, number]}
            />
            <Field
                name="objectsLimit"
                label={t('objectsLimit')}
                component={Fld}
                type="number"
                validate={[required, number]}
            />
            <Modal.Actions align={'right'}>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button onClick={handleSubmit} primary type='submit'>{t('submit')}</Button>
            </Modal.Actions>
        </Form>
    </React.Fragment >;
};

BucketForm.propTypes = {
    t: PropTypes.func,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSubmit: PropTypes.func
};

export default reduxForm({
    form: 'createBucket'
})(BucketForm);
